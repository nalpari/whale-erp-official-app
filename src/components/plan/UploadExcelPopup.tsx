'use client'
import { useRef, useState } from 'react'
import type { ExcelValidationResponse } from '@/types/schedule'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPT_EXTENSIONS = '.xlsx,.xls'

interface UploadExcelPopupProps {
  isUploading: boolean
  isSaving: boolean
  result: ExcelValidationResponse | null
  onClose: () => void
  onUpload: (file: File) => void
  onSave: () => void
  onDownloadSample: () => void
  onAlert: (message: string) => void
}

export default function UploadExcelPopup({
  isUploading,
  isSaving,
  result,
  onClose,
  onUpload,
  onSave,
  onDownloadSample,
  onAlert,
}: UploadExcelPopupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const isProcessing = isUploading || isSaving

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      onAlert('파일 크기는 10MB 이하만 업로드할 수 있습니다.')
      e.target.value = ''
      return
    }

    setFileName(file.name)
    setSelectedFile(file)
    e.target.value = ''
  }

  const handleUpload = () => {
    if (!selectedFile) {
      onAlert('엑셀 파일을 선택해주세요.')
      return
    }
    onUpload(selectedFile)
  }

  return (
    <div className="popup-overlay" style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <div className="popup-container" style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '440px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>엑셀 업로드</h3>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#999', padding: '0 4px' }}
          >
            &times;
          </button>
        </div>

        {/* 본문 */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* 파일 선택 영역 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>엑셀 파일</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', color: fileName ? '#333' : '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {fileName || '파일을 선택하세요'}
              </div>
              <button
                className="btn-s outline-g"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                파일 찾기
              </button>
              <button
                className="btn-s outline-g"
                onClick={onDownloadSample}
                disabled={isProcessing}
              >
                샘플
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_EXTENSIONS}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* 업로드(검증) 버튼 */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <button
              className="btn-form blue"
              onClick={handleUpload}
              disabled={isProcessing || !selectedFile}
              style={{ minWidth: '120px' }}
            >
              {isUploading ? '검증 중...' : '업로드'}
            </button>
          </div>

          {/* 검증 결과 */}
          {result && (
            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
              {result.valid ? (
                <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', color: '#166534', fontSize: '14px', textAlign: 'center' }}>
                  정상적으로 업로드되었습니다. (전체 {result.totalRows}건, 유효 {result.validRows}건)
                </div>
              ) : (
                <>
                  <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', color: '#991b1b', fontSize: '14px', textAlign: 'center', marginBottom: '12px' }}>
                    검증에 실패했습니다. (전체 {result.totalRows}건, 오류 {result.invalidRows}건)
                  </div>
                  {result.errors.length > 0 && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '6px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #eee', width: '80px' }}>행 번호</th>
                            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>오류 내용</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.errors.map((err, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px 12px', color: '#666' }}>
                                {err.rowNumber === 0 ? '파일' : `${err.rowNumber}행`}
                              </td>
                              <td style={{ padding: '8px 12px', color: '#991b1b' }}>{err.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div style={{ display: 'flex', gap: '8px', padding: '16px 20px', borderTop: '1px solid #eee' }}>
          {result?.valid && (
            <button
              className="btn-form block blue"
              onClick={onSave}
              disabled={isProcessing}
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          )}
          <button
            className="btn-form block sky brd"
            onClick={onClose}
            disabled={isProcessing}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
