'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePartTimerPayrollSearchStore } from '@/store/usePartTimerPayrollSearchStore'
import { useStoreStore } from '@/store/useStoreStore'
import { useAuthStore } from '@/store/useAuthStore'
import { usePartTimerPayrollList, useSendPartTimerPayrollEmail } from '@/hooks/queries/use-parttime-payroll-queries'
import { useCodeToName } from '@/hooks/queries/use-common-code-queries'
import { useMounted } from '@/hooks/use-mounted'
import { getErrorMessage } from '@/lib/api'
import type { PartTimerPayrollListItem } from '@/types/parttime-payroll'

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

export default function PartTimerPayList() {
  const router = useRouter()
  const setPartTimerSearchSheet = useBottomSheetControler(
    (state) => state.setPartTimerSearchSheet,
  )
  const { searchParams, hasSearched } = usePartTimerPayrollSearchStore()
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
  const { data, isLoading } = usePartTimerPayrollList(params, canSearch)
  const sendEmailMutation = useSendPartTimerPayrollEmail()
  const getWorkStatusName = useCodeToName('EMPWK')

  const payrollList = data?.content ?? []
  const totalElements = data?.totalElements ?? 0

  const handleSendEmail = async (e: React.MouseEvent, item: PartTimerPayrollListItem) => {
    e.stopPropagation()
    if (item.isEmailSend) return
    if (!confirm(`${item.memberName}님에게 급여명세서를 이메일로 전송하시겠습니까?`)) return
    try {
      await sendEmailMutation.mutateAsync(item.id)
      alert('이메일이 전송되었습니다.')
    } catch (error) {
      alert(getErrorMessage(error, '이메일 전송에 실패했습니다.'))
    }
  }

  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">파트타이머 급여명세서</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push('/parttimer/new')}
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
            onClick={() => setPartTimerSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>

        <PartTimerPayListContent
          mounted={mounted}
          hasSearched={hasSearched}
          headOfficeId={effectiveHeadOfficeId}
          isLoading={isLoading}
          payrollList={payrollList}
          onSendEmail={handleSendEmail}
          onItemClick={(id) => router.push(`/parttimer/${id}`)}
          getWorkStatusName={getWorkStatusName}
        />
      </div>
    </div>
  )
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="staff-list-wrap">
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
        {text}
      </div>
    </div>
  )
}

function PartTimerPayListContent({
  mounted,
  hasSearched,
  headOfficeId,
  isLoading,
  payrollList,
  onSendEmail,
  onItemClick,
  getWorkStatusName,
}: {
  mounted: boolean
  hasSearched: boolean
  headOfficeId: number | null
  isLoading: boolean
  payrollList: PartTimerPayrollListItem[]
  onSendEmail: (e: React.MouseEvent, item: PartTimerPayrollListItem) => void
  onItemClick: (id: number) => void
  getWorkStatusName: (code: string | undefined | null) => string
}) {
  if (!mounted || !hasSearched) return <EmptyMessage text="검색 조건을 설정해주세요." />
  if (!headOfficeId) return <EmptyMessage text="상단에서 점포를 먼저 선택해주세요." />
  if (isLoading) return <EmptyMessage text="불러오는 중..." />
  if (payrollList.length === 0) return <EmptyMessage text="검색 결과가 없습니다." />

  return (
    <div className="staff-list-wrap">
      {payrollList.map((item, index) => (
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
              {formatYearMonth(item.payrollYearMonth)}
            </div>
            <table className="info-table">
              <colgroup>
                <col style={{ width: '90px' }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>급여일</th>
                  <td>{formatDate(item.paymentDate)}</td>
                </tr>
                <tr>
                  <th>등록일</th>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
                <tr>
                  <th>본사</th>
                  <td>{item.headOfficeName}</td>
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
