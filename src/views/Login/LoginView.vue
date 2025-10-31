<template>
    <div class="login-container">
        <div class="login-card">
            <h1>SMT Server</h1>
            <p class="subtitle">Sistema de Monitoramento de Professores</p>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Email:</label>
                    <input v-model="email" type="email" placeholder="seu.email@exemplo.com" required />
                </div>

                <div class="form-group">
                    <label>Senha:</label>
                    <input v-model="password" type="password" placeholder="••••••••" required />
                </div>

                <button type="submit" class="btn-login" :disabled="loading">
                    {{ loading ? 'Entrando...' : 'Entrar' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLogin } from '@/services/modules/authService';

const {
    loading,
    error: errorMessage,
    data: loginData,
    executeLogin
} = useLogin();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
    const success = await executeLogin(email.value, password.value);

    if (success) {
        console.log('Login bem-sucedido!', loginData.value);
        // router.push('/dashboard');
    } else {
        console.error('Falha no login:', errorMessage.value);
    }
};
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
}

.login-card h1 {
    margin: 0 0 8px 0;
    color: #333;
    text-align: center;
    font-size: 28px;
}

.subtitle {
    text-align: center;
    color: #666;
    margin: 0 0 32px 0;
    font-size: 14px;
}

.error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
    font-size: 14px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #495057;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-login {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

.btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>