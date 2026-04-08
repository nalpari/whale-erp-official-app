import api from '@/lib/api'

export interface UploadFileResponse {
  id: number
  originalFileName: string
  storedFileName: string
  fileSize: number
  contentType: string | null
  fileExtension: string | null
}

/**
 * 파일 메타 정보 조회
 */
export const getFileInfo = async (fileId: number): Promise<UploadFileResponse> => {
  const response = await api.get<{ data: UploadFileResponse }>(`/api/v1/files/${fileId}`)
  return response.data.data
}

/**
 * 파일 다운로드 URL 조회 (pre-signed URL)
 */
export const getFileDownloadUrl = async (fileId: number): Promise<{ downloadUrl: string; originalFileName: string }> => {
  const response = await api.get<{ data: { downloadUrl: string; originalFileName: string } }>(
    `/api/v1/files/${fileId}/download-url`,
  )
  const { downloadUrl, originalFileName } = response.data.data

  // pre-signed URL 프로토콜 검증
  const urlProtocol = new URL(downloadUrl).protocol
  if (urlProtocol !== 'https:' && urlProtocol !== 'http:') {
    throw new Error(`허용되지 않는 URL 프로토콜: ${urlProtocol}`)
  }

  return { downloadUrl, originalFileName }
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
