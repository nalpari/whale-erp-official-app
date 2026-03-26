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

// 본사 정보 (BpResponse에서 필요한 필드만)
export interface HeadOffice {
  id: number
  companyName: string
  brandName?: string
  organizationCode: string
}
