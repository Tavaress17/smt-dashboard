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
                    <div class="password-wrapper">
                        <input 
                            id="password" 
                            :type="showPassword ? 'text' : 'password'" 
                            v-model="credentials.password"
                            class="input-field password-input"
                            :class="{ 'input-error': errors.password }"
                            placeholder="Digite sua senha" 
                            required 
                        />
                        <button 
                            type="button" 
                            class="password-toggle" 
                            @click="showPassword = !showPassword"
                            tabindex="-1"
                            aria-label="Mostrar ou ocultar senha"
                        >
                            <ShowPassword v-if="showPassword" class="password-icon" />
                            <HidePassword v-else class="password-icon" />
                        </button>
                    </div>
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
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import type { LoginCredentials } from "@/types";
import ShowPassword from '@/assets/icons/show_password_icon.svg';
import HidePassword from '@/assets/icons/hide_password_icon.svg';

const showPassword = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const credentials = reactive<LoginCredentials>({
    email: "",
    password: "",
});

const errors = reactive({
    email: "",
    password: "",
});

const isLoading = ref(false);
const loginError = ref("");

const validateForm = (): boolean => {
    errors.email = "";
    errors.password = "";

    if (!credentials.email) {
        errors.email = "Email é obrigatório";
        return false;
    }

    if (!credentials.password) {
        errors.password = "Senha é obrigatória";
        return false;
    }

    return true;
};

const handleLogin = async () => {
    if (!validateForm()) return;

    isLoading.value = true;
    loginError.value = "";

    try {
        await authStore.login({
            email: credentials.email.toLowerCase(),
            password: credentials.password,
        });

        router.push("/home");
    } catch (error: any) {
        loginError.value =
            error.message || "Erro ao realizar login. Verifique suas credenciais.";
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
    background: linear-gradient(135deg,
            var(--color-primary) 0%,
            var(--color-primary-dark) 100%);
    padding: var(--spacing-lg);
}

.login-card {
    width: 100%;
    max-width: 440px;
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-xl) var(--spacing-lg);
}

.login-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
}

.login-header h1 {
    color: var(--color-primary);
    font-size: 2rem;
    margin-bottom: var(--spacing-sm);
    font-weight: 700;
}

.login-header p {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.login-form .btn {
    width: 100%;
    margin-top: var(--spacing-md);
}

/* Password Input Wrapper */
.password-wrapper {
    position: relative;
    width: 100%;
}

.password-input {
    padding-right: 48px;
}

.password-toggle {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    height: 100%;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--color-text-secondary);
    transition: color var(--transition-base);
}

.password-toggle:hover {
    color: var(--color-primary);
}

.password-toggle:focus {
    outline: none;
}

.password-toggle:active {
    transform: translateY(-50%) scale(0.95);
}

/* Estilo para os ícones SVG */
.password-icon {
    height: 20px;
    display: block;
    flex-shrink: 0;
}

.password-icon :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
}

.password-icon :deep(path) {
    fill: currentColor;
}

/* Spinner customizado */
.spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--color-text-on-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsividade */
@media (max-width: 480px) {
    .login-card {
        padding: var(--spacing-lg) var(--spacing-md);
    }

    .login-header h1 {
        font-size: 1.75rem;
    }
}
</style>