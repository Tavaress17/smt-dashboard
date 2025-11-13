<template>
  <div class="home-view">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando dados...</p>
    </div>

    <div v-else-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: #e3f2fd;">
          <span><UsersIcon class="svg-icon" style="color: #1976d2 !important; fill: #1976d2 !important;"/></span>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalUsers }}</h3>
          <p>Usuários Cadastrados</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #f3e5f5;">
          <span><ProfessorsIcon class="svg-icon" style="color: #7b1fa2 !important; fill: #7b1fa2 !important;"/></span>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalProfessors }}</h3>
          <p>Professores Ativos</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #e8f5e9;">
          <span><CoursesIcon class="svg-icon" style="color: #388e3c !important; fill: #388e3c !important;"/></span>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalCourses }}</h3>
          <p>Cursos Disponíveis</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #fff3e0;">
          <span><DisciplinesIcon class="svg-icon" style="color: #f57c00 !important; fill: #f57c00 !important;"/></span>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalDisciplines }}</h3>
          <p>Disciplinas Cadastradas</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #fce4ec;">
          <span><ClassroomsIcon class="svg-icon" style="color: #c2185b !important; fill: #c2185b !important;"/></span>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalClassrooms }}</h3>
          <p>Salas Disponíveis</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #e0f2f1;">
          <span><EventsIcon class="svg-icon" style="color: #00796b !important; fill: #00796b !important;"/></span>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalEvents }}</h3>
          <p>Eventos Agendados</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dashboardService } from '@/services/crudServices';
import type { DashboardStats } from '@/types';
import UsersIcon from '@/assets/icons/users_icon.svg';
import ProfessorsIcon from '@/assets/icons/professors_icon.svg';
import CoursesIcon from '@/assets/icons/courses_icon.svg';
import DisciplinesIcon from '@/assets/icons/disciplines_icon.svg';
import ClassroomsIcon from '@/assets/icons/classrooms_icon.svg';
import EventsIcon from '@/assets/icons/events_icon.svg';

const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalProfessors: 0,
  totalCourses: 0,
  totalDisciplines: 0,
  totalClassrooms: 0,
  totalEvents: 0,
});

const loading = ref(false);
const error = ref('');

const loadStats = async () => {
  loading.value = true;
  error.value = '';

  try {
    const data = await dashboardService.getStats();
    stats.value = data;
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar estatísticas';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.home-view {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  transition: all var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.stat-content p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>