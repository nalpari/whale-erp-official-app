export interface StoreOption {
  id: number
  storeName: string
}

export interface StoreListItem {
  id: number
  operationStatus: string
  officeName?: string
  franchiseName?: string
  storeName: string
  createdAt: string
}

// 본사 정보
export interface HeadOffice {
  id: number
  companyName: string
  brandName?: string
  organizationCode: string
}

// 가맹점 정보
export interface FranchiseSimple {
  id: number
  name?: string
  organizationCode: string
}

// 본사-가맹점 트리
export interface HeadOfficeTree {
  id: number
  name?: string
  organizationCode: string
  franchises: FranchiseSimple[]
}
