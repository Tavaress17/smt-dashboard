<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>SMT Dashboard</h1>
        <p>Sistema de Monitoramento de Tutores</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email" class="input-label">Email</label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            class="input-field"
            :class="{ 'input-error': errors.email }"
            placeholder="Digite seu email"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="input-group">
          <label for="password" class="input-label">Senha</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            class="input-field"
            :class="{ 'input-error': errors.password }"
            placeholder="Digite sua senha"
            required
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div v-if="loginError" class="alert alert-error">
          {{ loginError }}
        </div>

        <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
          <span v-if="!isLoading">Entrar</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import type { LoginCredentials } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const credentials = reactive<LoginCredentials>({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

const isLoading = ref(false);
const loginError = ref('');

const validateForm = (): boolean => {
  errors.email = '';
  errors.password = '';
  
  if (!credentials.email) {
    errors.email = 'Email é obrigatório';
    return false;
  }
  
  if (!credentials.password) {
    errors.password = 'Senha é obrigatória';
    return false;
  }
  
  return true;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  loginError.value = '';
  
  try {
    await authStore.login({
      email: credentials.email.toLowerCase(),
      password: credentials.password,
    });
    
    router.push('/home');
  } catch (error: any) {
    loginError.value = error.message || 'Erro ao realizar login. Verifique suas credenciais.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: var(--spacing-lg);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-header h1 {
  color: var(--color-primary);
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.login-header p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.login-form button {
  width: 100%;
  margin-top: var(--spacing-md);
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-text-on-primary);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>