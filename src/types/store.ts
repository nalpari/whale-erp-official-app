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
