'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useEmployeeSearchStore } from '@/store/useEmployeeSearchStore'
import { useStoreStore } from '@/store/useStoreStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useEmployeeList } from '@/hooks/queries/use-employee-queries'
import { useMounted } from '@/hooks/use-mounted'
import type { EmployeeListItem } from '@/types/employee'

const AVATAR_IMAGES = [
  '/assets/images/layout/avatar01.svg',
  '/assets/images/layout/avatar02.svg',
  '/assets/images/layout/avatar03.svg',
]

/** 건강진단 만료일이 오늘 기준으로 경과했는지 판별 */
const isHealthCheckExpired = (expiryDate?: string) => {
  if (!expiryDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(expiryDate) < today
}

export default function StaffInfoList() {
  const router = useRouter()
  const setStaffSearchSheet = useBottomSheetControler(
    (state) => state.setStaffSearchSheet,
  )
  const { searchParams } = useEmployeeSearchStore()
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const selectedStore = useStoreStore((state) => state.selectedStore)
  const mounted = useMounted()

  const effectiveHeadOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? null
  const headOfficeId = mounted ? effectiveHeadOfficeId : null
  const params = {
    ...searchParams,
    ...(headOfficeId != null && { headOfficeOrganizationId: headOfficeId }),
    storeId: mounted ? selectedStore?.id : undefined,
  }
  const { data, isLoading } = useEmployeeList(params, mounted && !!effectiveHeadOfficeId)

  const employeeList = data?.content ?? []
  const totalElements = data?.totalElements ?? 0

  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">직원 관리</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push('/staff/invite')}
          >
            <i className="invite"></i>
            직원 초대
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>{totalElements}건</span>
          </div>
          <button
            className="search-btn"
            onClick={() => setStaffSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>

        <StaffListContent
          mounted={mounted}
          headOfficeId={effectiveHeadOfficeId}
          isLoading={isLoading}
          employeeList={employeeList}
          onDetailClick={(id) => router.push(`/staff/${id}`)}
          onContractClick={() => router.push('/contract')}
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

function StaffListContent({
  mounted,
  headOfficeId,
  isLoading,
  employeeList,
  onDetailClick,
  onContractClick,
}: {
  mounted: boolean
  headOfficeId: number | null
  isLoading: boolean
  employeeList: EmployeeListItem[]
  onDetailClick: (id: number) => void
  onContractClick: () => void
}) {
  if (!mounted) return null
  if (!headOfficeId) return <EmptyMessage text="상단에서 점포를 먼저 선택해주세요." />
  if (isLoading) return <EmptyMessage text="불러오는 중..." />
  if (employeeList.length === 0) return <EmptyMessage text="검색 결과가 없습니다." />

  return (
    <div className="staff-list-wrap">
      {employeeList.map((item, index) => (
        <div className="staff-list-item" key={item.employeeInfoId} onClick={() => onDetailClick(item.employeeInfoId)}>
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
                  <span>{item.employeeName}</span>
                  {item.memo && <i className="memo"></i>}
                </div>
                <div className="staff-job">
                  {[
                    item.employeeClassificationName,
                    item.contractClassificationName,
                    item.workStatusName,
                  ]
                    .filter(Boolean)
                    .join('/')}
                </div>
              </div>
            </div>
            <div className="sub-cont-btn-wrap">
              {item.memberStatus === '가입완료' ? (
                <div className="staff-invite-btn check">가입완료</div>
              ) : (
                <div className="staff-invite-btn">
                  {item.memberStatus || '가입요청전'}
                </div>
              )}
            </div>
          </div>
          <div className="sub-item-bx s">
            <table className="info-table">
              <colgroup>
                <col style={{ width: '92px' }} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>입사일</th>
                  <td>{item.hireDate || '-'}</td>
                </tr>
                <tr>
                  <th>건강진단만료일</th>
                  <td>
                    {isHealthCheckExpired(item.healthCheckExpiryDate) ? (
                      <span className="imp">
                        {item.healthCheckExpiryDate || '-'}
                      </span>
                    ) : (
                      item.healthCheckExpiryDate || '-'
                    )}
                  </td>
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
          </div>
          {/* 근로계약서 */}
          <button
            className="contract-link"
            onClick={(e) => { e.stopPropagation(); onContractClick() }}
          >
            <div className="contract-inner">
              <div className="contract-tit">근로계약서</div>
              {/* TODO: 근로계약관리 PR에서 계약 상태 배지 연동 */}
              <div className="auto-right">
                <i className="contract-arr"></i>
              </div>
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}
