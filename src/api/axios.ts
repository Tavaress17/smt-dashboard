import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { APIError } from '@/types';

// IMPORTANTE: Altere este IP para o endereço do seu servidor
const API_BASE_URL = 'http://localhost/api/v1';

// Criação da instância do Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de Request - Adiciona o token automaticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Função auxiliar para converter snake_case em camelCase
const convertSnakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => convertSnakeToCamel(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Converter snake_case para camelCase
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        converted[camelKey] = convertSnakeToCamel(obj[key]);
      }
    }
    return converted;
  }
  
  return obj;
};

// Interceptador de Response - Tratamento global de erros
api.interceptors.response.use(
  (response) => {
    // Converter snake_case para camelCase na resposta
    if (response.data) {
      response.data = convertSnakeToCamel(response.data);
    }
    return response;
  },
  (error: AxiosError<APIError>) => {
    // Erro de autenticação - redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    
    // Tratamento de erros da API
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    
    // Erro de rede ou timeout
    return Promise.reject({
      status: 'error',
      error: 'Network Error',
      message: 'Falha na comunicação com o servidor. Verifique sua conexão.',
    } as APIError);
  }
);

// Função para atualizar o token após login
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Função para remover o token no logout
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  delete api.defaults.headers.common['Authorization'];
};

export default api;