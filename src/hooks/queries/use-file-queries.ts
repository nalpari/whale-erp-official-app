import { useQuery } from '@tanstack/react-query'
import { getFileInfo } from '@/lib/api/file'

export const fileKeys = {
  all: ['file'] as const,
  info: (id: number) => [...fileKeys.all, 'info', id] as const,
}

export const useFileInfo = (fileId?: number) => {
  return useQuery({
    queryKey: fileKeys.info(fileId ?? 0),
    queryFn: () => getFileInfo(fileId ?? 0),
    enabled: !!fileId,
  })
}
