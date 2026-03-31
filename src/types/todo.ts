export interface CalendarDayData {
  day: number;
  totalCount: number;
  completedCount: number;
  incompleteCount: number;
  organizations: OrgGroup[];
}

export interface OrgGroup {
  headOfficeId: number;
  headOfficeName: string;
  franchiseId: number | null;
  franchiseName: string | null;
  storeId: number | null;
  storeName: string | null;
  employees: EmployeeGroup[];
}

export interface EmployeeGroup {
  employeeInfoId: number;
  employeeName: string;
  todos: TodoItem[];
}

export interface TodoItem {
  id: number;
  content: string;
  todoDate: string;
  isCompleted: boolean;
}

type TodoCreateBase = {
  headOfficeId?: number | null;
  franchiseId?: number | null;
  storeId?: number | null;
  employeeInfoId: number;
  content: string;
};

export type TodoCreateRequest = TodoCreateBase &
  (
    | { hasPeriod: true; startDate: string; endDate: string }
    | { hasPeriod: false; startDate: string; endDate?: never }
  );

export interface EmployeeOption {
  employeeInfoId: number;
  employeeNumber: string;
  employeeName: string;
  headOfficeName: string;
  franchiseName: string | null;
  storeName: string | null;
}
