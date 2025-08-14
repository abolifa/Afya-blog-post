import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // Retry failed queries once
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default queryClient;
