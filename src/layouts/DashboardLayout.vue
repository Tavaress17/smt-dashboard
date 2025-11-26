<template>
  <div class="dashboard-layout">
    <!-- Mobile Header -->
    <MobileHeader 
      :is-menu-open="isMobileMenuOpen"
      @toggle-menu="toggleMobileMenu"
    />

    <!-- Mobile Sidebar -->
    <MobileSidebar 
      :is-open="isMobileMenuOpen"
      @close="closeMobileMenu"
      @open-profile="openProfileModal"
    />

    <!-- Desktop Sidebar -->
    <aside class="sidebar desktop-only">
      <div class="sidebar-header">
        <h2>SMT</h2>
        <p>Dashboard</p>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/home" class="nav-item" active-class="active">
          <span class="nav-icon"><HomeIcon class="svg-icon"/></span>
          <span class="nav-text">Início</span>
        </router-link>

        <div v-if="authStore.isAdmin" class="nav-section">
          <p class="nav-section-title">Gerenciamento</p>

          <router-link to="/users" class="nav-item" active-class="active">
            <span class="nav-icon"><UsersIcon class="svg-icon"/></span>
            <span class="nav-text">Usuários</span>
          </router-link>

          <router-link to="/professors" class="nav-item" active-class="active">
            <span class="nav-icon"><ProfessorsIcon class="svg-icon"/></span>
            <span class="nav-text">Professores</span>
          </router-link>

          <router-link to="/courses" class="nav-item" active-class="active">
            <span class="nav-icon"><CoursesIcon class="svg-icon"/></span>
            <span class="nav-text">Cursos</span>
          </router-link>

          <router-link to="/disciplines" class="nav-item" active-class="active">
            <span class="nav-icon"><DisciplinesIcon class="svg-icon"/></span>
            <span class="nav-text">Disciplinas</span>
          </router-link>

          <router-link to="/classrooms" class="nav-item" active-class="active">
            <span class="nav-icon"><ClassroomsIcon class="svg-icon"/></span>
            <span class="nav-text">Salas</span>
          </router-link>

          <router-link to="/events" class="nav-item" active-class="active">
            <span class="nav-icon"><EventsIcon class="svg-icon"/></span>
            <span class="nav-text">Eventos</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <span class="nav-icon"><LogoutIcon class="svg-icon"/></span>
          <span class="nav-text">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="main-header desktop-only">
        <h1>{{ pageTitle }}</h1>
        <div class="user-info">
          <span class="user-badge" v-if="authStore.isAdmin">Admin</span>
          <span class="user-name">{{ authStore.user?.fullName }}</span>
          <button 
            class="profile-photo-button"
            @click="openProfileModal"
            :title="`Clique para ver o perfil de ${authStore.user?.fullName}`"
          >
            <img 
              v-if="authStore.user?.profilePhoto" 
              :src="authStore.user.profilePhoto" 
              :alt="`Foto de perfil de ${authStore.user?.fullName}`"
              class="profile-photo-img"
            />
            <div v-else class="profile-photo-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </button>
        </div>
      </header>

      <div class="content-wrapper">
        <router-view />
      </div>
    </main>

    <!-- Profile Modal -->
    <ProfileModal ref="profileModalRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import ProfileModal from '@/components/ProfileModal.vue';
import MobileHeader from '@/components/MobileHeader.vue';
import MobileSidebar from '@/components/MobileSidebar.vue';
import HomeIcon from '@/assets/icons/home_icon.svg';
import UsersIcon from '@/assets/icons/users_icon.svg';
import ProfessorsIcon from '@/assets/icons/professors_icon.svg';
import CoursesIcon from '@/assets/icons/courses_icon.svg';
import DisciplinesIcon from '@/assets/icons/disciplines_icon.svg';
import ClassroomsIcon from '@/assets/icons/classrooms_icon.svg';
import EventsIcon from '@/assets/icons/events_icon.svg';
import LogoutIcon from '@/assets/icons/logout_icon.svg';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const profileModalRef = ref<InstanceType<typeof ProfileModal>>();
const isMobileMenuOpen = ref(false);

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    Home: 'Dashboard',
    Users: 'Gerenciar Usuários',
    Professors: 'Gerenciar Professores',
    Courses: 'Gerenciar Cursos',
    Disciplines: 'Gerenciar Disciplinas',
    Classrooms: 'Gerenciar Salas',
    Events: 'Gerenciar Eventos',
  };
  return titles[route.name as string] || 'Dashboard';
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const openProfileModal = () => {
  profileModalRef.value?.openModal();
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* ==================== SIDEBAR ==================== */
.sidebar {
  width: 260px;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  position: fixed;
  z-index: 2147483647;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-on-primary);
}

.sidebar-header p {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-lg) 0;
}

.nav-section {
  margin-bottom: var(--spacing-lg);
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
  padding: var(--spacing-sm) var(--spacing-lg);
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text-on-primary);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  border-left-color: var(--color-text-on-primary);
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-text {
  font-size: 0.9375rem;
}

.sidebar-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);
  background: transparent;
  color: var(--color-text-on-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-sm);
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

/* ==================== MAIN CONTENT ==================== */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.main-header {
  background: var(--color-surface);
  padding: var(--spacing-lg) var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.main-header h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-text-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-badge {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.user-name {
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 120px;
  text-align: right;
}

.profile-photo-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background-color: var(--color-background);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.profile-photo-button:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
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

.content-wrapper {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

/* ==================== RESPONSIVIDADE ==================== */
@media (max-width: 768px) {
  /* Esconder sidebar e header desktop */
  .desktop-only {
    display: none !important;
  }

  /* Ajustar main content */
  .main-content {
    margin-left: 0;
    margin-top: 64px;
  }

  .content-wrapper {
    padding: var(--spacing-md);
  }

  /* Ajustar layout das views */
  .dashboard-layout :deep(.view-header) {
    margin-bottom: var(--spacing-md);
  }

  .dashboard-layout :deep(.stats-grid) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .dashboard-layout :deep(.table-container) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dashboard-layout :deep(.table) {
    min-width: 600px;
  }

  /* Melhorar modais em mobile */
  .dashboard-layout :deep(.modal-overlay) {
    padding: var(--spacing-sm);
  }

  .dashboard-layout :deep(.modal-content) {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: var(--spacing-sm);
  }

  .dashboard-layout :deep(.btn) {
    font-size: 0.875rem;
    padding: 8px 16px;
  }

  .dashboard-layout :deep(.table) {
    font-size: 0.8125rem;
  }

  .dashboard-layout :deep(.input-field) {
    font-size: 16px; /* Previne zoom no iOS */
  }
}
</style>