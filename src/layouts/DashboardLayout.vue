<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>SMT</h2>
        <p>Dashboard</p>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/home" class="nav-item" active-class="active">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Home</span>
        </router-link>

        <div v-if="authStore.isAdmin" class="nav-section">
          <p class="nav-section-title">Gerenciamento</p>

          <router-link to="/users" class="nav-item" active-class="active">
            <span class="nav-icon">👥</span>
            <span class="nav-text">Usuários</span>
          </router-link>

          <router-link to="/professors" class="nav-item" active-class="active">
            <span class="nav-icon">👨‍🏫</span>
            <span class="nav-text">Professores</span>
          </router-link>

          <router-link to="/courses" class="nav-item" active-class="active">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Cursos</span>
          </router-link>

          <router-link to="/disciplines" class="nav-item" active-class="active">
            <span class="nav-icon">📖</span>
            <span class="nav-text">Disciplinas</span>
          </router-link>

          <router-link to="/classrooms" class="nav-item" active-class="active">
            <span class="nav-icon">🏫</span>
            <span class="nav-text">Salas</span>
          </router-link>

          <router-link to="/events" class="nav-item" active-class="active">
            <span class="nav-icon">📅</span>
            <span class="nav-text">Eventos</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <span class="nav-icon">🚪</span>
          <span class="nav-text">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="main-header">
        <h1>{{ pageTitle }}</h1>
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.fullName }}</span>
          <span class="user-badge" v-if="authStore.isAdmin">Admin</span>
        </div>
      </header>

      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

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

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
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

.user-name {
  font-weight: 600;
  color: var(--color-text-secondary);
}

.user-badge {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.content-wrapper {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .nav-text,
  .sidebar-header p,
  .nav-section-title {
    display: none;
  }

  .main-content {
    margin-left: 70px;
  }
}
</style>