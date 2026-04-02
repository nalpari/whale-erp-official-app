export interface CommonCodeNode {
  id: number
  code: string
  name: string
  description?: string | null
  depth: number
  sortOrder?: number
  isActive: boolean
  codeMemo?: string | null
  children?: CommonCodeNode[]
}
