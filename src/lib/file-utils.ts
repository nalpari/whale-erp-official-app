/** Content-Disposition 헤더에서 파일명 추출 (RFC5987 UTF-8 인코딩 우선) */
export function getFileNameFromDisposition(value?: string): string | null {
  if (!value) return null
  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1])
  const basicMatch = value.match(/filename="?([^";]+)"?/i)
  if (!basicMatch?.[1]) return null
  try {
    return decodeURIComponent(basicMatch[1])
  } catch (err) {
    console.warn('[getFileNameFromDisposition] 파일명 디코딩 실패:', err)
    return basicMatch[1]
  }
}

/** Blob을 파일로 다운로드 (a 태그 click 패턴) */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  try {
    link.click()
  } finally {
    link.remove()
    URL.revokeObjectURL(url)
  }
}
