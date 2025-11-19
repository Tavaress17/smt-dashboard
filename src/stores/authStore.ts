import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '@/services/authService';
import type { User, LoginCredentials } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => 
    user.value?.authoritiesList?.includes('ROLE_ADMIN_USER') ?? false
  );

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      
      // Após login, busca o perfil completo do usuário
      await fetchUserProfile();
      
      return response;
    } catch (err: any) {
      error.value = err.message || 'Erro ao realizar login';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserProfile() {
    try {
      const profile = await authService.getUserProfile();

      // Try to fetch the separate photo endpoint (some APIs expose photo separately)
      try {
        const photo = await authService.getProfilePhoto();
        if (photo) {
          // Ensure we don't lose other fields and keep reactivity
          user.value = { ...profile, profilePhoto: photo } as any;
        } else {
          user.value = profile;
        }
      } catch (photoErr) {
        // If photo fetch fails, still set profile (non-fatal)
        user.value = profile;
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar perfil do usuário';
      throw err;
    }
  }

  function logout() {
    authService.logout();
    user.value = null;
  }

  async function checkAuth() {
    if (authService.isAuthenticated() && !user.value) {
      try {
        await fetchUserProfile();
      } catch {
        logout();
      }
    }
  }

  return {
    // State
    user,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    
    // Actions
    login,
    logout,
    fetchUserProfile,
    checkAuth,
  };
});