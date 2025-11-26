<template>
  <header class="mobile-header">
    <div class="header-left">
      <div class="header-text">
        <h1 class="header-title">S.M.T.</h1>
        <p class="header-subtitle">Sistema de Monitoramento de Tutores</p>
      </div>
    </div>

    <button 
      class="hamburger-button" 
      @click="toggleMenu"
      :class="{ 'is-active': isMenuOpen }"
      aria-label="Menu"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  isMenuOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-menu'): void;
}>();

const toggleMenu = () => {
  emit('toggle-menu');
};
</script>

<style scoped>
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  padding: 0 var(--spacing-md);
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  line-height: 1;
}

.header-subtitle {
  font-size: 0.625rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1;
}

/* Hamburger Button */
.hamburger-button {
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-sm);
  transition: background var(--transition-fast);
}

.hamburger-button:hover {
  background: var(--color-background);
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Animação do X */
.hamburger-button.is-active .hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-button.is-active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-button.is-active .hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Responsividade */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }
}

@media (max-width: 380px) {
  .header-subtitle {
    font-size: 0.5625rem;
  }
  
  .header-logo {
    width: 36px;
    height: 36px;
  }
}
</style>