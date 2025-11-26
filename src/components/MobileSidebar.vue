<template>
  <!-- Overlay -->
  <div 
    v-if="isOpen" 
    class="sidebar-overlay"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <aside class="mobile-sidebar" :class="{ 'is-open': isOpen }">
    <!-- Perfil do Usuário -->
    <div class="sidebar-profile">
      <button 
        class="profile-photo-mobile"
        @click="openProfile"
        :title="`Clique para ver o perfil de ${user?.fullName}`"
      >
        <img 
          v-if="user?.profilePhoto" 
          :src="user.profilePhoto" 
          :alt="`Foto de perfil de ${user?.fullName}`"
          class="profile-photo-img"
        />
        <div v-else class="profile-photo-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </button>

      <div class="profile-info">
        <h3 class="profile-name">{{ user?.fullName }}</h3>
        <span class="profile-badge" :class="{ 'is-admin': isAdmin }">
          {{ isAdmin ? 'Admin' : 'Usuário' }}
        </span>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="sidebar-nav">
      <router-link 
        to="/home" 
        class="nav-item" 
        active-class="active"
        @click="closeSidebar"
      >
        <span class="nav-icon"><HomeIcon class="svg-icon"/></span>
        <span class="nav-text">Início</span>
      </router-link>

      <div v-if="isAdmin" class="nav-section">
        <p class="nav-section-title">Gerenciamento</p>

        <router-link 
          to="/users" 
          class="nav-item" 
          active-class="active"
          @click="closeSidebar"
        >
          <span class="nav-icon"><UsersIcon class="svg-icon"/></span>
          <span class="nav-text">Usuários</span>
        </router-link>

        <router-link 
          to="/professors" 
          class="nav-item" 
          active-class="active"
          @click="closeSidebar"
        >
          <span class="nav-icon"><ProfessorsIcon class="svg-icon"/></span>
          <span class="nav-text">Professores</span>
        </router-link>

        <router-link 
          to="/courses" 
          class="nav-item" 
          active-class="active"
          @click="closeSidebar"
        >
          <span class="nav-icon"><CoursesIcon class="svg-icon"/></span>
          <span class="nav-text">Cursos</span>
        </router-link>

        <router-link 
          to="/disciplines" 
          class="nav-item" 
          active-class="active"
          @click="closeSidebar"
        >
          <span class="nav-icon"><DisciplinesIcon class="svg-icon"/></span>
          <span class="nav-text">Disciplinas</span>
        </router-link>

        <router-link 
          to="/classrooms" 
          class="nav-item" 
          active-class="active"
          @click="closeSidebar"
        >
          <span class="nav-icon"><ClassroomsIcon class="svg-icon"/></span>
          <span class="nav-text">Salas</span>
        </router-link>

        <router-link 
          to="/events" 
          class="nav-item" 
          active-class="active"
          @click="closeSidebar"
        >
          <span class="nav-icon"><EventsIcon class="svg-icon"/></span>
          <span class="nav-text">Eventos</span>
        </router-link>
      </div>
    </nav>

    <!-- Botão de Logout -->
    <div class="sidebar-footer">
      <button @click="handleLogout" class="btn-logout">
        <span class="nav-icon"><LogoutIcon class="svg-icon"/></span>
        <span class="nav-text">Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import HomeIcon from '@/assets/icons/home_icon.svg';
import UsersIcon from '@/assets/icons/users_icon.svg';
import ProfessorsIcon from '@/assets/icons/professors_icon.svg';
import CoursesIcon from '@/assets/icons/courses_icon.svg';
import DisciplinesIcon from '@/assets/icons/disciplines_icon.svg';
import ClassroomsIcon from '@/assets/icons/classrooms_icon.svg';
import EventsIcon from '@/assets/icons/events_icon.svg';
import LogoutIcon from '@/assets/icons/logout_icon.svg';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'open-profile'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const isAdmin = computed(() => authStore.isAdmin);

const closeSidebar = () => {
  emit('close');
};

const openProfile = () => {
  emit('open-profile');
  closeSidebar();
};

const handleLogout = () => {
  authStore.logout();
  closeSidebar();
  router.push('/login');
};
</script>

<style scoped>
/* Overlay */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Sidebar */
.mobile-sidebar {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mobile-sidebar.is-open {
  transform: translateX(0);
}

/* Perfil */
.sidebar-profile {
  padding: var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.profile-photo-mobile {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.profile-photo-mobile:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.profile-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-photo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-disabled);
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.profile-name {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-align: center;
}

.profile-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.profile-badge.is-admin {
  background: rgba(255, 255, 255, 0.3);
}

/* Navegação */
.sidebar-nav {
  flex: 1;
  padding: var(--spacing-lg) 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: var(--spacing-lg);
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  padding: var(--spacing-sm) var(--spacing-lg);
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.nav-item.active {
  background: var(--color-background);
  border-left-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-item .svg-icon {
  fill: currentColor;
  color: currentColor;
}

.nav-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.nav-text {
  font-size: 0.9375rem;
}

/* Footer */
.sidebar-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);
  background: transparent;
  color: var(--color-error);
  border: 1px solid var(--color-error);
  border-radius: var(--border-radius-sm);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn-logout:hover {
  background: var(--color-error);
  color: white;
}

.btn-logout .svg-icon {
  fill: currentColor;
  color: currentColor;
}

/* Responsividade */
@media (max-width: 768px) {
  .mobile-sidebar {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
}
</style>