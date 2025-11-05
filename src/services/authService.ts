import api, { setAuthToken, clearAuthToken } from '@/api/axios';
import type { LoginCredentials, LoginResponse, User, APIError } from '@/types';

class AuthService {
  /**
   * Realiza o login do usuário
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/login', credentials);
      
      // Salva o token e o ID do usuário
      const { token, id } = response.data.data;
      setAuthToken(token);
      localStorage.setItem('userId', id);
      
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  }

  /**
   * Realiza o logout do usuário
   */
  logout(): void {
    clearAuthToken();
  }

  /**
   * Obtém o perfil do usuário logado
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/profile');
      return response.data;
    } catch (error) {
      throw error as APIError;
    }
  }

  /**
   * Atualiza a senha do usuário
   */
  async updatePassword(currentPassword: string, newPassword: string): Promise<string> {
    try {
      const response = await api.patch<{ message: string }>('/profile/password', {
        currentPassword,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      throw error as APIError;
    }
  }

  /**
   * Atualiza a foto do perfil
   */
  async updateProfilePhoto(encodedBase64Image: string): Promise<void> {
    try {
      await api.patch('/profile/photo', { encodedBase64Image });
    } catch (error) {
      throw error as APIError;
    }
  }

  /**
   * Obtém a foto do perfil
   */
  async getProfilePhoto(): Promise<string> {
    try {
      const response = await api.get<{ photo: string }>('/profile/photo');
      return response.data.photo;
    } catch (error) {
      throw error as APIError;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Obtém o token armazenado
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Obtém o ID do usuário armazenado
   */
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}

export default new AuthService();