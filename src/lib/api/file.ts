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

/** 파일 다운로드 실행 — 팝업 차단 방지를 위해 동기적으로 창을 먼저 열고 URL 설정 */
export async function downloadFile(fileId: number): Promise<void> {
  const popup = window.open('about:blank', '_blank')
  if (!popup) throw new Error('다운로드 창이 차단되었습니다.')
  popup.opener = null

  try {
    const { downloadUrl } = await getDownloadUrl(fileId)
    popup.location.href = downloadUrl
  } catch (error) {
    popup.close()
    throw error
  }
}
