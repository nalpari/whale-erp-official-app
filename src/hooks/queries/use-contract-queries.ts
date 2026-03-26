import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getContracts,
  getContract,
  createContractHeader,
  createContractWorkHours,
  createContractSalaryInfo,
  updateContractHeader,
  updateContractWorkHours,
  updateContractSalaryInfo,
  deleteContract,
  sendContractEmail,
  getMinimumWage,
} from '@/lib/api/contract'
import type {
  ContractSearchParams,
  ContractHeaderCreateRequest,
  ContractHeaderUpdateRequest,
  ContractWorkHoursRequest,
  ContractSalaryInfoCreateRequest,
  ContractSalaryInfoUpdateRequest,
} from '@/types/contract'

export const contractKeys = {
  all: ['contract'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  list: (params: ContractSearchParams) => [...contractKeys.lists(), params] as const,
  details: () => [...contractKeys.all, 'detail'] as const,
  detail: (id: number) => [...contractKeys.details(), id] as const,
  minimumWage: (year: number) => [...contractKeys.all, 'minimum-wage', year] as const,
}

// 목록 조회
export const useContractList = (params: ContractSearchParams, enabled = true) => {
  return useQuery({
    queryKey: contractKeys.list(params),
    queryFn: () => getContracts(params),
    enabled,
  })
}

// 상세 조회
export const useContractDetail = (id?: number) => {
  return useQuery({
    queryKey: contractKeys.detail(id ?? 0),
    queryFn: () => getContract(id ?? 0),
    enabled: !!id,
  })
}

// 최저임금 조회
export const useMinimumWage = (year: number) => {
  return useQuery({
    queryKey: contractKeys.minimumWage(year),
    queryFn: () => getMinimumWage(year),
  })
}

// Step 1: 헤더 등록
export const useCreateContractHeader = () => {
  return useMutation({
    mutationFn: ({
      data,
      workContractFile,
      wageContractFile,
    }: {
      data: ContractHeaderCreateRequest
      workContractFile?: File
      wageContractFile?: File
    }) => createContractHeader(data, workContractFile, wageContractFile),
  })
}

// Step 2: 근무시간 등록
export const useCreateContractWorkHours = () => {
  return useMutation({
    mutationFn: (data: ContractWorkHoursRequest) => createContractWorkHours(data),
  })
}

// Step 3: 급여정보 등록
export const useCreateContractSalaryInfo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ContractSalaryInfoCreateRequest) => createContractSalaryInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
    },
  })
}

// 헤더 수정
export const useUpdateContractHeader = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
      workContractFile,
      wageContractFile,
    }: {
      id: number
      data: ContractHeaderUpdateRequest
      workContractFile?: File
      wageContractFile?: File
    }) => updateContractHeader(id, data, workContractFile, wageContractFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.id) })
    },
  })
}

// 근무시간 수정
export const useUpdateContractWorkHours = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      contractId,
      data,
    }: {
      contractId: number
      data: ContractWorkHoursRequest
    }) => updateContractWorkHours(contractId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.contractId) })
    },
  })
}

// 급여정보 수정
export const useUpdateContractSalaryInfo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: ContractSalaryInfoUpdateRequest
    }) => updateContractSalaryInfo(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.id) })
    },
  })
}

// 삭제
export const useDeleteContract = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
    },
  })
}

// 이메일 전송
export const useSendContractEmail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => sendContractEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
    },
  })
}
