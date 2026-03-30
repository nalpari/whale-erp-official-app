import api from '@/lib/api'

export interface DownloadUrlResponse {
  fileId: number
  originalFileName: string
  downloadUrl: string
}

/** 파일 다운로드 URL 조회 (Pre-signed URL) */
export async function getDownloadUrl(fileId: number): Promise<DownloadUrlResponse> {
  const response = await api.get<{ data: DownloadUrlResponse }>(
    `/api/v1/files/${fileId}/download-url`,
  )
  return response.data.data
}

/** 파일 다운로드 실행 (새 탭으로 열기) */
export async function downloadFile(fileId: number): Promise<void> {
  const { downloadUrl } = await getDownloadUrl(fileId)
  window.open(downloadUrl, '_blank')
}
