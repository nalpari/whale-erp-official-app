'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useOvertimeSearchStore } from '@/store/useOvertimeSearchStore'
import { useStoreStore } from '@/store/useStoreStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useOvertimeList, useSendOvertimeEmail } from '@/hooks/queries/use-overtime-queries'
import { useCodeToName } from '@/hooks/queries/use-common-code-queries'
import { useMounted } from '@/hooks/use-mounted'
import { getErrorMessage } from '@/lib/api'
import { usePopupControler } from '@/store/usePopupControler'
import type { OvertimeAllowanceListItem } from '@/types/overtime'

const AVATAR_IMAGES = [
  '/assets/images/layout/avatar01.svg',
  '/assets/images/layout/avatar02.svg',
  '/assets/images/layout/avatar03.svg',
]

const formatYearMonth = (ym: string) => {
  if (ym.length !== 6) return ym
  return `${ym.slice(0, 4)}년 ${Number(ym.slice(4))}월 급여`
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return date.slice(0, 10).replace(/-/g, '.')
}

export default function OverTimeList() {
  const router = useRouter()
  const openAlert = usePopupControler((s) => s.openAlert)
  const setOverTimeSearchSheet = useBottomSheetControler(
    (state) => state.setOverTimeSearchSheet,
  )
  const searchParams = useOvertimeSearchStore((s) => s.searchParams)
  const hasSearched = useOvertimeSearchStore((s) => s.hasSearched)
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const selectedStore = useStoreStore((state) => state.selectedStore)
  const mounted = useMounted()

  const effectiveHeadOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? null
  const headOfficeId = mounted ? effectiveHeadOfficeId : null
  const params = {
    ...searchParams,
    ...(headOfficeId != null && { headOfficeId }),
    ...(mounted && selectedStore?.id && { storeId: selectedStore.id }),
  }
  const canSearch = mounted && hasSearched && !!effectiveHeadOfficeId
  const { data, isLoading, isError } = useOvertimeList(params, canSearch)
  const { mutateAsync: sendEmail, isPending: isSendingEmail } = useSendOvertimeEmail()
  const getWorkStatusName = useCodeToName('EMPWK')

  const overtimeList = data?.content ?? []
  const totalElements = data?.totalElements ?? 0

  const handleSendEmail = (e: React.MouseEvent, item: OvertimeAllowanceListItem) => {
    e.stopPropagation()
    if (item.isEmailSend || isSendingEmail) return
    openAlert({
      message: `${item.memberName}님에게 수당명세서를 이메일로 전송하시겠습니까?`,
      confirmText: '전송',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await sendEmail(item.id)
          openAlert({ message: '이메일이 전송되었습니다.' })
        } catch (error) {
          openAlert({ message: getErrorMessage(error, '이메일 전송에 실패했습니다.') })
        }
      },
    })
  }

  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">연장근무 수당명세서</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push('/overtime/new')}
          >
            등록
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>{canSearch ? `${totalElements}건` : '0건'}</span>
          </div>
          <button
            className="search-btn act"
            onClick={() => setOverTimeSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>

        <OverTimeListContent
          mounted={mounted}
          hasSearched={hasSearched}
          headOfficeId={effectiveHeadOfficeId}
          isLoading={isLoading}
          isError={isError}
          overtimeList={overtimeList}
          onSendEmail={handleSendEmail}
          onItemClick={(id) => router.push(`/overtime/${id}`)}
          onRetry={() => useOvertimeSearchStore.getState().search()}
          getWorkStatusName={getWorkStatusName}
        />
      </div>
    </div>
  )
}

function EmptyMessage({ text, isError, onRetry }: { text: string; isError?: boolean; onRetry?: () => void }) {
  return (
    <div className="staff-list-wrap">
      <div style={{ textAlign: 'center', padding: '40px 0', color: isError ? '#e74c3c' : '#999' }}>
        <div>{text}</div>
        {onRetry && (
          <button className="btn-s blue" style={{ marginTop: '12px' }} onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    </div>
  )
}

function OverTimeListContent({
  mounted,
  hasSearched,
  headOfficeId,
  isLoading,
  isError,
  overtimeList,
  onSendEmail,
  onItemClick,
  onRetry,
  getWorkStatusName,
}: {
  mounted: boolean
  hasSearched: boolean
  headOfficeId: number | null
  isLoading: boolean
  isError: boolean
  overtimeList: OvertimeAllowanceListItem[]
  onSendEmail: (e: React.MouseEvent, item: OvertimeAllowanceListItem) => void
  onItemClick: (id: number) => void
  onRetry: () => void
  getWorkStatusName: (code: string | undefined | null) => string
}) {
  if (!mounted || !hasSearched) return <EmptyMessage text="검색 조건을 설정해주세요." />
  if (!headOfficeId) return <EmptyMessage text="상단에서 점포를 먼저 선택해주세요." />
  if (isError) return <EmptyMessage text="데이터를 불러올 수 없습니다." isError onRetry={onRetry} />
  if (isLoading) return <EmptyMessage text="불러오는 중..." />
  if (overtimeList.length === 0) return <EmptyMessage text="검색 결과가 없습니다." />

  return (
    <div className="staff-list-wrap">
      {overtimeList.map((item, index) => (
        <div className="staff-list-item" key={item.id}>
          <div className="staff-item-header">
            <div className="head-staff-info">
              <div className="staff-icon">
                <Image
                  src={AVATAR_IMAGES[index % AVATAR_IMAGES.length]}
                  alt="staff-icon"
                  width={46}
                  height={46}
                />
              </div>
              <div className="staff-info-data">
                <div className="staff-name">
                  <span>{item.memberName}</span>
                  {item.isEmailSend ? (
                    <b className="badge org line">
                      <i className="email_icon"></i>전송완료
                    </b>
                  ) : (
                    <button
                      className="badge org"
                      onClick={(e) => onSendEmail(e, item)}
                    >
                      <i className="email_icon"></i>이메일 전송
                    </button>
                  )}
                </div>
                <div className="staff-job">
                  {[item.workDays, getWorkStatusName(item.workStatus)]
                    .filter((v) => v && v !== '-')
                    .join('/')}
                </div>
              </div>
            </div>
          </div>
          <button
            className="sub-item-bx"
            onClick={() => onItemClick(item.id)}
          >
            <div className="pay-title">
              {formatYearMonth(item.allowanceYearMonth)}
            </div>
            <table className="info-table">
              <colgroup>
                <col style={{ width: '90px' }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>급여일</th>
                  <td>{item.paymentDate ? formatDate(item.paymentDate) : '-'}</td>
                </tr>
                <tr>
                  <th>등록일</th>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
                <tr>
                  <th>본사</th>
                  <td>{item.headOfficeName ?? '-'}</td>
                </tr>
                {item.franchiseName && (
                  <tr>
                    <th>가맹점</th>
                    <td>
                      <div className="ellipsis">{item.franchiseName}</div>
                    </td>
                  </tr>
                )}
                {item.storeName && (
                  <tr>
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">{item.storeName}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </button>
        </div>
      ))}
    </div>
  )
}
