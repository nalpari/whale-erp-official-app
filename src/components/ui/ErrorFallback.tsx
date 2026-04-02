'use client'
import { useRouter } from 'next/navigation'

interface ErrorFallbackProps {
  message?: string
  showBack?: boolean
}

export default function ErrorFallback({ message = '데이터를 불러올 수 없습니다.', showBack = true }: ErrorFallbackProps) {
  const router = useRouter()

  return (
    <div className="container sub">
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>
        {message}
        {showBack && (
          <button className="btn-form blue" style={{ marginTop: '16px' }} onClick={() => router.back()}>
            돌아가기
          </button>
        )}
      </div>
    </div>
  )
}
