'use client'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'
import { useHeadOffices, useHeadOfficeTree, useStoreOptions } from '@/hooks/queries/use-store-queries'
import type { WorkplaceType } from '@/types/employee'

export default function InviteForm01() {
  const { stepOne, setStepOne } = useStaffInviteStore()
  const { data: headOffices } = useHeadOffices()
  const { data: headOfficeTree } = useHeadOfficeTree()
  const { data: storeOptions } = useStoreOptions(
    stepOne.headOfficeOrganizationId ?? undefined,
  )

  // 선택된 본사의 가맹점 목록
  const franchiseOptions = headOfficeTree
    ?.find((ho) => ho.id === stepOne.headOfficeOrganizationId)
    ?.franchises ?? []

  const handleWorkplaceTypeChange = (type: WorkplaceType) => {
    setStepOne({
      workplaceType: type,
      franchiseOrganizationId: null,
      storeId: null,
    })
  }

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">직원 기본정보</div>
        </div>

        {/* 근무장소 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              근무장소 <span className="imp">*</span>
            </div>
            <div className="flex g8">
              <button
                className={`radio-btn block${stepOne.workplaceType === 'HEAD_OFFICE' ? ' act' : ''}`}
                onClick={() => handleWorkplaceTypeChange('HEAD_OFFICE')}
              >
                본사
              </button>
              <button
                className={`radio-btn block${stepOne.workplaceType === 'FRANCHISE' ? ' act' : ''}`}
                onClick={() => handleWorkplaceTypeChange('FRANCHISE')}
              >
                가맹점
              </button>
            </div>
          </div>
        </div>

        {/* 본사/가맹점/점포 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              본사/가맹점/점포 <span className="imp">*</span>
            </div>
            <div>
              <div className="block mb8">
                <select
                  className="select-form"
                  value={stepOne.headOfficeOrganizationId ?? ''}
                  onChange={(e) =>
                    setStepOne({
                      headOfficeOrganizationId: e.target.value ? Number(e.target.value) : null,
                      storeId: null,
                    })
                  }
                >
                  <option value="">본사 선택</option>
                  {headOffices?.map((ho) => (
                    <option key={ho.id} value={ho.id}>
                      {ho.companyName}
                    </option>
                  ))}
                </select>
              </div>
              {/* 가맹점 */}
              {stepOne.workplaceType === 'FRANCHISE' && (
                <div className="block mb8">
                  <select
                    className="select-form"
                    value={stepOne.franchiseOrganizationId ?? ''}
                    onChange={(e) =>
                      setStepOne({
                        franchiseOrganizationId: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">가맹점 선택</option>
                    {franchiseOptions.map((fr) => (
                      <option key={fr.id} value={fr.id}>
                        {fr.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="block">
                <select
                  className="select-form"
                  value={stepOne.storeId ?? ''}
                  onChange={(e) =>
                    setStepOne({
                      storeId: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  disabled={!stepOne.headOfficeOrganizationId}
                >
                  <option value="">점포 선택</option>
                  {storeOptions?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.storeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 직원명 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              직원명<span className="imp">*</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                value={stepOne.employeeName}
                onChange={(e) => setStepOne({ employeeName: e.target.value })}
                placeholder="직원명 입력"
              />
            </div>
          </div>
        </div>

        {/* 휴대폰 번호 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              휴대폰 번호<span className="imp"> *</span>
            </div>
            <div className="block">
              <input
                type="tel"
                className="input-frame"
                value={stepOne.mobilePhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setStepOne({ mobilePhone: value })
                }}
                placeholder="010-0000-0000"
              />
            </div>
            <div className="s-txt mt10">※ 숫자만 입력 가능</div>
          </div>
        </div>

        {/* Partner Office 권한 설정 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="filed-tit">Partner Office 권한 설정</div>
            </div>
            <div className="block">
              <select className="select-form">
                <option value="">선택</option>
              </select>
            </div>
            <div className="s-txt mt10">
              ※ 직원이 Partner Office에서 관리자로 겸임할 때 사용합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
