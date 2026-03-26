export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

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
  todos: TodoItem[];
}

export interface TodoItem {
  id: number;
  content: string;
  todoDate: string;
  isCompleted: boolean;
}
