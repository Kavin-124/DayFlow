export type Role = "ADMIN" | "EMPLOYEE";

export interface User {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  profilePictureUrl?: string;
  jobTitle?: string;
  department?: string;
  joiningDate?: string;
  baseSalary?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Attendance {
  id: string;
  userId: string;
  user?: User;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  totalHours?: number;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE";
}

export interface LeaveRequest {
  id: string;
  userId: string;
  user?: User;
  leaveType: "PAID" | "SICK" | "UNPAID";
  startDate: string;
  endDate: string;
  totalDays: number;
  remarks?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComments?: string;
  reviewedBy?: string;
  createdAt?: string;
}

export interface Payroll {
  id: string;
  userId: string;
  user?: User;
  monthYear: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentStatus: "PAID" | "PENDING";
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyPayrollCost: number;
}
