'use client'

import { useState } from 'react'
import { QueryClientProvider, QueryClient, QueryCache } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        onError: (err) => {
          console.error('[mutation] 실패:', err)
        },
      },
    },
    queryCache: new QueryCache({
      onError: (err, query) => {
        console.error(`[query] ${query.queryKey.join('/')} 실패:`, err)
      },
    }),
  })
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
