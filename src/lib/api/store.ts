import api from '@/lib/api'
import type {
  StoreOption,
  HeadOffice,
  StoreSearchParams,
  StorePaginatedResponse,
  StoreDetail,
  StoreHeaderRequest,
} from '@/types/store'

const BASE_URL = '/api/v1/stores'

// 운영중인 본사 목록 조회
export const getHeadOffices = async (): Promise<HeadOffice[]> => {
  const response = await api.get<{ data: HeadOffice[] }>('/api/master/bp/head-offices')
  return response.data.data
}

// 점포 드롭다운 목록 조회 (본사 ID 기반)
export const getStoreOptions = async (officeId: number): Promise<StoreOption[]> => {
  const response = await api.get<{ data: StoreOption[] }>(`${BASE_URL}/options`, {
    params: { officeId },
  })
  return response.data.data
}

// undefined/null/빈 문자열 제거
const cleanParams = (params: object) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

// 점포 목록 조회
export const getStoreList = async (params: StoreSearchParams): Promise<StorePaginatedResponse> => {
  const response = await api.get<{ data: StorePaginatedResponse }>(BASE_URL, {
    params: cleanParams(params),
  })
  return response.data.data
}

// 점포 상세 조회
export const getStoreDetail = async (id: number): Promise<StoreDetail> => {
  const response = await api.get<{ data: StoreDetail }>(`${BASE_URL}/${id}`)
  return response.data.data
}

// 점포 생성 (multipart/form-data)
export const createStore = async (
  data: StoreHeaderRequest,
  storeImages?: File[],
  businessFile?: File,
): Promise<StoreDetail> => {
  const formData = new FormData()
  formData.append('storeDto', new Blob([JSON.stringify(data)], { type: 'application/json' }))

  if (storeImages) {
    storeImages.forEach((file) => formData.append('storeImages', file))
  }
  if (businessFile) {
    formData.append('businessFile', businessFile)
  }

  const response = await api.post<{ data: StoreDetail }>(BASE_URL, formData)
  return response.data.data
}

// 점포 수정 (multipart/form-data)
export const updateStore = async (
  id: number,
  data: StoreHeaderRequest,
  deleteImages?: number[],
  storeImages?: File[],
  businessFile?: File,
): Promise<StoreDetail> => {
  const formData = new FormData()
  formData.append('storeDto', new Blob([JSON.stringify(data)], { type: 'application/json' }))

  if (deleteImages && deleteImages.length > 0) {
    formData.append('deleteImages', new Blob([JSON.stringify(deleteImages)], { type: 'application/json' }))
  }
  if (storeImages) {
    storeImages.forEach((file) => formData.append('storeImages', file))
  }
  if (businessFile) {
    formData.append('businessFile', businessFile)
  }

  const response = await api.put<{ data: StoreDetail }>(`${BASE_URL}/${id}`, formData)
  return response.data.data
}

// 점포 삭제
export const deleteStore = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`)
}
