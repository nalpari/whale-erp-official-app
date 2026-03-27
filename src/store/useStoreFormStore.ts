import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { OperatingHourRequest } from '@/types/store'

interface StoreFormState {
  // Step 1
  storeOwner: string
  officeId: number | null
  franchiseId: number | null
  storeName: string
  operationStatus: string
  statusUpdatedDate: string

  // Step 2
  ceoName: string
  businessNumber: string
  storeAddress: string
  storeAddressDetail: string
  ceoPhone: string
  storePhone: string

  // Step 3
  storeImages: File[]
  existingImages: { id: number; originalFileName: string }[]
  deleteImageIds: number[]
  businessFile: File | null

  // Step 4
  operating: OperatingHourRequest[]

  // Actions
  setField: <K extends keyof StoreFormState>(key: K, value: StoreFormState[K]) => void
  setOperating: (operating: OperatingHourRequest[]) => void
  addStoreImage: (file: File) => void
  removeStoreImage: (index: number) => void
  markDeleteExistingImage: (id: number) => void
  reset: () => void
}

const DEFAULT_OPERATING: OperatingHourRequest[] = [
  { dayType: 'WEEKDAY', isOperating: true, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, selectWeekDayList: [] },
  { dayType: 'SATURDAY', isOperating: true, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null },
  { dayType: 'SUNDAY', isOperating: true, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null },
]

const initialState = {
  storeOwner: 'HEAD_OFFICE',
  officeId: null,
  franchiseId: null,
  storeName: '',
  operationStatus: 'STOPR_001',
  statusUpdatedDate: new Date().toISOString().slice(0, 10),
  ceoName: '',
  businessNumber: '',
  storeAddress: '',
  storeAddressDetail: '',
  ceoPhone: '',
  storePhone: '',
  storeImages: [] as File[],
  existingImages: [] as { id: number; originalFileName: string }[],
  deleteImageIds: [] as number[],
  businessFile: null as File | null,
  operating: [...DEFAULT_OPERATING] as OperatingHourRequest[],
}

export const useStoreFormStore = create<StoreFormState>()(
  devtools(
    (set) => ({
      ...initialState,

      setField: (key, value) => set({ [key]: value } as Partial<StoreFormState>, false, `storeForm/set-${String(key)}`),

      setOperating: (operating) => set({ operating }, false, 'storeForm/setOperating'),

      addStoreImage: (file) =>
        set(
          (state) => ({ storeImages: [...state.storeImages, file] }),
          false,
          'storeForm/addImage',
        ),

      removeStoreImage: (index) =>
        set(
          (state) => ({ storeImages: state.storeImages.filter((_, i) => i !== index) }),
          false,
          'storeForm/removeImage',
        ),

      markDeleteExistingImage: (id) =>
        set(
          (state) => ({
            deleteImageIds: [...state.deleteImageIds, id],
            existingImages: state.existingImages.filter((img) => img.id !== id),
          }),
          false,
          'storeForm/markDeleteImage',
        ),

      reset: () => set({ ...initialState, operating: [...DEFAULT_OPERATING] }, false, 'storeForm/reset'),
    }),
    { name: 'StoreFormStore' },
  ),
)
