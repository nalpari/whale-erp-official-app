'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useContractSearchStore } from '@/store/useContractSearchStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { useContractList } from '@/hooks/queries/use-contract-queries'
import { useMounted } from '@/hooks/use-mounted'
import { CONTRACT_STATUS_BADGE } from '@/lib/constants'
import type { ContractListItem } from '@/types/contract'

const AVATAR_IMAGES = [
  '/assets/images/layout/avatar01.svg',
  '/assets/images/layout/avatar02.svg',
  '/assets/images/layout/avatar03.svg',
]

const formatDate = (date?: string) => {
  if (!date) return '-'
  return date.replace(/-/g, '.')
}


function getWorkDaysSummary(workHours?: ContractListItem['workHours']) {
  if (!workHours || workHours.length === 0) return '-'
  const DAY_LABEL: Record<string, string> = {
    WEEKDAY: '평일',
    SATURDAY: '토',
    SUNDAY: '일',
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    WEEKEND: '주말',
  }
  const activeDays = workHours.filter((w) => w.isWork)
  if (activeDays.length === 0) return '-'
  return activeDays.map((w) => DAY_LABEL[w.dayType] ?? w.dayType).join('/')
}

export default function ContractList() {
  const router = useRouter()
  const setContractSearchSheet = useBottomSheetControler(
    (state) => state.setContractSearchSheet,
  )
  const searchParams = useContractSearchStore((s) => s.searchParams)
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const selectedStore = useStoreStore((state) => state.selectedStore)
  const mounted = useMounted()

  // 본사 ID: auth > storeStore 순으로 fallback
  const effectiveHeadOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? null
  const headOfficeId = mounted ? effectiveHeadOfficeId : null
  const params = {
    ...searchParams,
    ...(headOfficeId != null && { headOfficeId }),
    storeId: mounted ? selectedStore?.id : undefined,
  }
  const canSearch = mounted && !!effectiveHeadOfficeId
  const { data, isLoading } = useContractList(params, canSearch)

  const contractList = data?.content ?? []
  const totalElements = data?.totalElements ?? 0

  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">근로계약 관리</div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>{canSearch ? `${totalElements}건` : '0건'}</span>
          </div>
          <button
            className="search-btn"
            onClick={() => setContractSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>

        <ContractListContent
          mounted={mounted}
          headOfficeId={effectiveHeadOfficeId}
          isLoading={isLoading}
          contractList={contractList}
          onItemClick={(id) => router.push(`/contract/${id}`)}
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

function ContractListContent({
  mounted,
  headOfficeId,
  isLoading,
  contractList,
  onItemClick,
}: {
  mounted: boolean
  headOfficeId: number | null
  isLoading: boolean
  contractList: ContractListItem[]
  onItemClick: (id: number) => void
}) {
  if (!mounted) return null
  if (!headOfficeId) return <EmptyMessage text="상단에서 점포를 먼저 선택해주세요." />
  if (isLoading) return <EmptyMessage text="불러오는 중..." />
  if (contractList.length === 0) return <EmptyMessage text="검색 결과가 없습니다." />

  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  return (
    <div className="staff-list-wrap">
      {contractList.map((item, index) => {
        const header = item.employmentContractHeader
        const statusInfo = header?.electronicContractStatus
          ? CONTRACT_STATUS_BADGE[header.electronicContractStatus]
          : null
        const workDays = getWorkDaysSummary(item.workHours)
        const salaryDay = header?.salaryDay != null ? `${header.salaryDay}일` : '-'
        const contractDate = header?.contractDate
          ? `${formatDate(header.contractDate)} (${header.contractTypeName ?? ''})`
          : '-'
        const isExpired = header?.contractEndDate
          ? header.contractEndDate < today
          : false

        return (
          <button
            className="staff-list-item"
            key={item.id}
            onClick={() => onItemClick(item.id)}
          >
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  {isExpired && <i className="contract-tip"></i>}
                  <Image
                    src={AVATAR_IMAGES[index % AVATAR_IMAGES.length]}
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>{item.employeeInfoName}</span>
                    {statusInfo && (
                      <i className={statusInfo.className}>{statusInfo.label}</i>
                    )}
                  </div>
                  <div className="staff-job">
                    {[
                      item.headOfficeOrganizationName ? '본사직원' : item.storeName ? '점포직원' : '',
                      header?.contractClassificationName,
                      item.workStatusName,
                    ].filter(Boolean).join('/')}
                  </div>
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '90px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>근무요일</th>
                    <td>{workDays}</td>
                  </tr>
                  <tr>
                    <th>급여일</th>
                    <td>{salaryDay}</td>
                  </tr>
                  <tr>
                    <th>계약기간</th>
                    <td>
                      {header?.contractStartDate
                        ? `${formatDate(header.contractStartDate)} ~ ${header.contractEndDate ? formatDate(header.contractEndDate) : '미정'}`
                        : '-'}
                    </td>
                  </tr>
                  <tr>
                    <th>계약일</th>
                    <td>{contractDate}</td>
                  </tr>
                  {item.headOfficeOrganizationName && (
                    <tr>
                      <th>본사</th>
                      <td>{item.headOfficeOrganizationName}</td>
                    </tr>
                  )}
                  {item.franchiseOrganizationName && (
                    <tr>
                      <th>가맹점</th>
                      <td>
                        <div className="ellipsis">{item.franchiseOrganizationName}</div>
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
            </div>
          </button>
        )
      })}
    </div>
  )
}
