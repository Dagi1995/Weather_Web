import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use_local_storage";

export interface SearchHistoryItem {
  id: string;
  query: string;
  lat: string;
  lon: string;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function useSearchHistory() {
  const [historyStorage, setHistoryStorage] = useLocalStorage<SearchHistoryItem[]>(
    "search-history",
    []
  );
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: () => historyStorage,
    initialData: historyStorage,
  });

  const addToHistory = useMutation({
    mutationFn: async (search: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
      const currentHistory = queryClient.getQueryData<SearchHistoryItem[]>(["search-history"]) ?? [];

      const newSearch: SearchHistoryItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };

      const filteredHistory = currentHistory.filter(
        (item) => !(item.lat === search.lat && item.lon === search.lon)
      );

      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);

      setHistoryStorage(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory) => {
      queryClient.setQueryData(["search-history"], newHistory);
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistoryStorage([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []);
    },
  });

  return {
    history: historyQuery.data ?? [],
    addToHistory,
    clearHistory,
  };
}
