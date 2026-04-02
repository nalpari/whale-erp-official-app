export interface BpFranchiseNode {
  id: number
  name: string
  organizationCode: string
}

export interface BpHeadOfficeNode {
  id: number
  name: string
  organizationCode: string
  franchises: BpFranchiseNode[]
}
