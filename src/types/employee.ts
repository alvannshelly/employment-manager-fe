export enum EmployeePosition {
  CEO = "CEO",
  CTO = "CTO",
  CPO = "CPO",
  HR = "HR",
  ACCOUNTANT = "Accountant",
  ENGINEER = "Engineer",
}

export interface Employee {
  id: number;
  name: string;
  position: EmployeePosition;
  active: boolean;
  directReports: number[];
  hireDate: string;
}

export interface EmployeeWithReports {
  employee: Employee;
  directReportNames: string[];
}

export interface NewEmployee {
  id: number;
  name: string;
  position: string;
  active: boolean;
  directReports: number[];
  hireDate: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface SearchParams {
  name?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  page?: number;
  size?: number;
}
