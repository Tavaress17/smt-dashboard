// ==================== AUTH ====================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    authorities: string[];
    authoritiesList?: string[];
    token: string;
    expirationTime: number;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  enrollment: string;
  profilePhoto?: string;
  authoritiesList: string[];
  enabled: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}

// ==================== API RESPONSE ====================
export interface APIError {
  status: string;
  error: string;
  message: string;
}

export interface APIResponse<T> {
  status: string;
  message: string;
  data: T;
}

// ==================== ENTITIES ====================
export interface Professor {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Discipline {
  id: string;
  name: string;
  abbreviation: string;
  courseId: string;
}

export interface Classroom {
  id: string;
  description: string;
  block: string;
  floor: string;
  capacity: number;
  observation: string;
}

export type DaysEnum = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface Event {
  id: string;
  description: string;
  weekday: DaysEnum;
  startTime: string;
  endTime: string;
  classroomId: string;
  professorId: string;
  disciplineId: string;
  courseId: string;
}

// ==================== STATISTICS ====================
export interface DashboardStats {
  totalUsers: number;
  totalProfessors: number;
  totalCourses: number;
  totalDisciplines: number;
  totalClassrooms: number;
  totalEvents: number;
}