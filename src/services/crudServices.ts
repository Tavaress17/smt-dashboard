import api from '@/api/axios';
import type {
  User,
  Professor,
  Course,
  Discipline,
  Classroom,
  APIError,
  EventAggregated,
} from '@/types';

// ==================== USERS ====================
export const usersService = {
  async getAll(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/admin/users');
      // console.log(response)
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  },

  async create(data: {
    fullName: string;
    email: string;
    enrollment: string;
    isAdmin: boolean;
  }): Promise<void> {
    try {
      await api.post('/admin/users', data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async update(
    id: string,
    data: {
      fullName: string;
      email: string;
      enrollment: string;
      isAdmin: boolean;
    }
  ): Promise<void> {
    try {
      await api.put(`/admin/users/${id}`, data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async delete(id: string): Promise<string> {
    try {
      const response = await api.delete<{ message: string }>(`/admin/users/${id}`);
      return response.data.message;
    } catch (error) {
      throw error as APIError;
    }
  },
};

// ==================== PROFESSORS ====================
export const professorsService = {
  async getAll(): Promise<Professor[]> {
    try {
      const response = await api.get<Professor[]>('/admin/professors');
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  },

  async create(data: { name: string; email: string }): Promise<void> {
    try {
      await api.post('/admin/professors', data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async update(id: string, data: { name: string; email: string }): Promise<void> {
    try {
      await api.put(`/admin/professors/${id}`, data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async delete(id: string): Promise<string> {
    try {
      const response = await api.delete<{ message: string }>(`/admin/professors/${id}`);
      return response.data.message;
    } catch (error) {
      throw error as APIError;
    }
  },
};

// ==================== COURSES ====================
export const coursesService = {
  async getAll(): Promise<Course[]> {
    try {
      const response = await api.get<Course[]>('/admin/courses');
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  },

  async create(data: { name: string; abbreviation: string }): Promise<void> {
    try {
      await api.post('/admin/courses', data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async update(id: string, data: { name: string; abbreviation: string }): Promise<void> {
    try {
      await api.put(`/admin/courses/${id}`, data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async delete(id: string): Promise<string> {
    try {
      const response = await api.delete<{ message: string }>(`/admin/courses/${id}`);
      return response.data.message;
    } catch (error) {
      throw error as APIError;
    }
  },
};

// ==================== DISCIPLINES ====================
export const disciplinesService = {
  async getAll(): Promise<Discipline[]> {
    try {
      const response = await api.get<Discipline[]>('/admin/disciplines');
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  },

  async create(data: {
    name: string;
    abbreviation: string;
    courseId: string;
  }): Promise<void> {
    try {
      await api.post('/admin/disciplines', data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async update(
    id: string,
    data: { name: string; abbreviation: string; courseId: string }
  ): Promise<void> {
    try {
      await api.put(`/admin/disciplines/${id}`, data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async delete(id: string): Promise<string> {
    try {
      const response = await api.delete<{ message: string }>(`/admin/disciplines/${id}`);
      return response.data.message;
    } catch (error) {
      throw error as APIError;
    }
  },
};

// ==================== CLASSROOMS ====================
export const classroomsService = {
  async getAll(): Promise<Classroom[]> {
    try {
      const response = await api.get<Classroom[]>('/admin/classrooms');
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  },

  async create(data: {
    description: string;
    block: string;
    floor: string;
    capacity: string;
    observation: string;
  }): Promise<void> {
    try {
      await api.post('/admin/classrooms', data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async update(
    id: string,
    data: {
      description: string;
      block: string;
      floor: string;
      capacity: string;
      observation: string;
    }
  ): Promise<void> {
    try {
      await api.put(`/admin/classrooms/${id}`, data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async delete(id: string): Promise<string> {
    try {
      const response = await api.delete<{ message: string }>(`/admin/classrooms/${id}`);
      return response.data.message;
    } catch (error) {
      throw error as APIError;
    }
  },
};

// ==================== EVENTS ====================
export const eventsService = {
  async getAll(): Promise<EventAggregated[]> {
    try {
      const response = await api.get<EventAggregated[]>('/dashboard/events');
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  },

  async create(data: {
    description: string;
    weekday: string;
    startTime: string;
    endTime: string;
    classroomId: string;
    professorId: string;
    courseId: string;
    disciplineId: string;
  }): Promise<void> {
    try {
      await api.post('/admin/events', data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async update(
    id: string,
    data: {
      description: string;
      weekday: string;
      startTime: string;
      endTime: string;
      classroomId: string;
      professorId: string;
      courseId: string;
      disciplineId: string;
    }
  ): Promise<void> {
    try {
      await api.put(`/admin/events/${id}`, data);
    } catch (error) {
      throw error as APIError;
    }
  },

  async delete(id: string): Promise<string> {
    try {
      const response = await api.delete<{ message: string }>(`/admin/events/${id}`);
      return response.data.message;
    } catch (error) {
      throw error as APIError;
    }
  },
};

// ==================== DASHBOARD STATS ====================
export const dashboardService = {
  async getStats(): Promise<any> {
    try {
      // Este endpoint deve ser criado no backend para retornar estatísticas
      // Por enquanto, vamos simular com contagens das entidades
      const [users, professors, courses, disciplines, classrooms, events] = await Promise.all([
        usersService.getAll(),
        professorsService.getAll(),
        coursesService.getAll(),
        disciplinesService.getAll(),
        classroomsService.getAll(),
        eventsService.getAll(),
      ]);

      return {
        totalUsers: users.length,
        totalProfessors: professors.length,
        totalCourses: courses.length,
        totalDisciplines: disciplines.length,
        totalClassrooms: classrooms.length,
        totalEvents: events.length,
      };
    } catch (error) {
      throw error as APIError;
    }
  },
};