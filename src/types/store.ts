export interface StoreOption {
  id: number
  storeName: string
  franchiseId: number | null
  headOfficeId: number | null
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

// 점포 목록 조회 파라미터
export interface StoreSearchParams {
  office?: number
  franchise?: number
  store?: number
  status?: string
  from?: string
  to?: string
  page?: number
  size?: number
  sort?: string
}

// 페이지네이션 응답
export interface StorePaginatedResponse {
  content: StoreListItem[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  isFirst: boolean
  isLast: boolean
  hasNext: boolean
}

// 점포 상세 - 기본 정보
export interface StoreInfo {
  id: number
  storeOwner: string
  officeId: number
  officeName: string
  franchiseId: number | null
  franchiseName: string | null
  operationStatus: string
  statusUpdatedDate: string | null
  storeName: string
  storeCode: string
  businessNumber: string | null
  storeAddress: string | null
  storeAddressDetail: string | null
  ceoName: string | null
  ceoPhone: string | null
  storePhone: string | null
}

// 운영시간
export interface OperatingHour {
  dayType: string
  isOperating: boolean
  openTime: string | null
  closeTime: string | null
  breakStartTime: string | null
  breakEndTime: string | null
  weekDayTypes: string[] | null
}

// 점포 파일
export interface StoreFile {
  id: number
  originalFileName: string
  storedFileName: string | null
  uploadFileCategory: string
  filePath: string | null
  fileSize: number | null
  contentType: string | null
  mimeType: string | null
  publicUrl: string | null
}

// 점포 상세 응답
export interface StoreDetail {
  storeInfo: StoreInfo
  operating: OperatingHour[]
  files: StoreFile[]
}

// 점포 생성/수정 요청 DTO (서버 StoreHeaderRequest 기준)
export interface StoreHeaderRequest {
  storeOwner: string
  organizationId: number
  operationStatus: string
  storeName: string
  businessNumber: string | null
  storeAddress: string | null
  storeAddressDetail: string | null
  ceoName: string | null
  ceoPhone: string | null
  storePhone: string | null
  operatingHours?: OperatingHourRequest[]
}

export interface OperatingHourRequest {
  dayType: string
  isOperating: boolean
  openTime: string | null
  closeTime: string | null
  breakTimeEnabled?: boolean
  breakStartTime: string | null
  breakEndTime: string | null
  selectWeekDayList?: string[]
}

// 파일 삭제 요청 DTO
export interface FileDeleteRequest {
  shouldDeleteFileIds: number[]
}

export interface SubscribePlanCheck {
  canSave: boolean
  storeCount: number
  planName: string
  organizationId: number
}
