import api from '@/lib/api'

export interface UploadFileResponse {
  id: number
  originalFileName: string
  storedFileName: string
  fileSize: number
  contentType: string | null
  fileExtension: string | null
}

export interface DownloadUrlResponse {
  fileId: number
  originalFileName: string
  downloadUrl: string
}

/**
 * 파일 메타 정보 조회
 */
export const getFileInfo = async (fileId: number): Promise<UploadFileResponse> => {
  const response = await api.get<{ data: UploadFileResponse }>(`/api/v1/files/${fileId}`)
  return response.data.data
}

/** pre-signed URL 프로토콜 검증 */
const validateDownloadUrl = (downloadUrl: string): void => {
  const urlProtocol = new URL(downloadUrl).protocol
  if (urlProtocol !== 'https:' && urlProtocol !== 'http:') {
    throw new Error(`허용되지 않는 URL 프로토콜: ${urlProtocol}`)
  }
}

/**
 * 파일 다운로드 URL 조회 (pre-signed URL) — 급여명세서 첨부파일용
 */
export const getFileDownloadUrl = async (fileId: number): Promise<{ downloadUrl: string; originalFileName: string }> => {
  const response = await api.get<{ data: { downloadUrl: string; originalFileName: string } }>(
    `/api/v1/files/${fileId}/download-url`,
  )
  const { downloadUrl, originalFileName } = response.data.data
  validateDownloadUrl(downloadUrl)
  return { downloadUrl, originalFileName }
}

/** 파일 다운로드 URL 조회 (Pre-signed URL) */
export async function getDownloadUrl(fileId: number): Promise<DownloadUrlResponse> {
  const response = await api.get<{ data: DownloadUrlResponse }>(
    `/api/v1/files/${fileId}/download-url`,
  )
  const data = response.data.data
  validateDownloadUrl(data.downloadUrl)
  return data
}

/** 브라우저에서 파일 다운로드를 트리거한다. (DOM 사이드이펙트) */
export const triggerFileDownload = (url: string, fileName: string): void => {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  try {
    a.click()
  } finally {
    document.body.removeChild(a)
  }
}

/** 파일 다운로드 실행 — 팝업 차단 방지를 위해 동기적으로 창을 먼저 열고 URL 설정 */
export async function downloadFile(fileId: number): Promise<void> {
  const popup = window.open('about:blank', '_blank')
  if (!popup) throw new Error('다운로드 창이 차단되었습니다.')
  popup.opener = null

  try {
    const { downloadUrl } = await getDownloadUrl(fileId)
    if (popup.closed) throw new Error('다운로드 창이 닫혔습니다.')
    popup.location.href = downloadUrl
  } catch (error) {
    if (!popup.closed) popup.close()
    throw error
  }
}

/**
 * 첨부파일 업로드
 *
 * @param file 업로드할 파일
 * @param category 파일 카테고리 (백엔드 UploadFileCategory enum)
 * @param referenceType 연결 엔티티 타입 (백엔드 ReferenceType enum)
 * @param referenceId 연결 엔티티 ID
 */
export const uploadAttachment = async (
  file: File,
  category: string,
  referenceType: string,
  referenceId: number,
): Promise<UploadFileResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', category)
  formData.append('referenceType', referenceType)
  formData.append('referenceId', String(referenceId))

  const response = await api.post<{ data: UploadFileResponse }>(
    '/api/v1/files/attachments',
    formData,
  )
  return response.data.data
}
