import { useQuery } from '@tanstack/react-query'
import { getBpTree } from '@/lib/api/bp'

export const bpKeys = {
  all: ['bp'] as const,
  tree: () => [...bpKeys.all, 'tree'] as const,
}

// 본사-가맹점 계층 트리
export const useBpTree = () => {
  return useQuery({
    queryKey: bpKeys.tree(),
    queryFn: getBpTree,
  })
}
