// src/services/modules/authService.ts
import { ref } from 'vue';
import axios from "axios";
import { axiosService, updateAxiosServiceToken } from "@/services/axios";
import type { LoginUserDataType } from "@/types/UserDataType";
import type { APIError } from "@/types/APIError";

export function useLogin() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<LoginUserDataType | null>(null);

  const executeLogin = async (email: string, password: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const response = await axiosService.post<LoginUserDataType>("/login", { 
        email, 
        password 
      });
      
      data.value = response.data;
      
      if (response.data.status === 'success' && response.data.data.token) {
        updateAxiosServiceToken(response.data.data.token);
        

        localStorage.setItem('token', response.data.data.token);
      }
      
      return response.data.status === 'success';

    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.data) {
          const apiError = e.response.data as APIError;
          error.value = apiError.message || "Credenciais inválidas";
        } else if (e.code === 'ERR_NETWORK') {
          error.value = "Erro de conexão com o servidor";
        } else {
          error.value = e.message || "Erro de autenticação";
        }
      } else {
        console.error(e);
        error.value = "Ocorreu um erro inesperado.";
      }
      return false;

    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    data,
    executeLogin,
  };
}