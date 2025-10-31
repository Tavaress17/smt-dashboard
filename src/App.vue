<template>
  <div id="app">
    <!-- Mostra login se não estiver autenticado -->
    <LoginView v-if="!isAuthenticated" @login-success="handleLoginSuccess" />

    <!-- Mostra dashboard se autenticado -->
    <div v-else class="dashboard">
      <!-- Menu lateral -->
      <nav class="sidebar">
        <div class="sidebar-header">
          <h2>SMT Dashboard</h2>
        </div>

        <div class="user-info">
          <p class="user-name">{{ currentUser?.username }}</p>
          <p class="user-email">{{ currentUser?.email }}</p>
        </div>

        <ul class="menu">
          <li :class="{ active: currentView === 'professors' }">
            <a @click="changeView('professors')">👨‍🏫 Professores</a>
          </li>
          <li :class="{ active: currentView === 'classrooms' }">
            <a @click="changeView('classrooms')">🏫 Salas</a>
          </li>
          <li :class="{ active: currentView === 'courses' }">
            <a @click="changeView('courses')">📚 Cursos</a>
          </li>
          <li :class="{ active: currentView === 'disciplines' }">
            <a @click="changeView('disciplines')">📖 Disciplinas</a>
          </li>
          <li :class="{ active: currentView === 'events' }">
            <a @click="changeView('events')">📅 Eventos</a>
          </li>
          <li :class="{ active: currentView === 'users' }">
            <a @click="changeView('users')">👥 Usuários</a>
          </li>
        </ul>

        <button @click="handleLogout" class="btn-logout">Sair</button>
      </nav>

      <!-- Conteúdo principal -->
      <main class="main-content">
        <ProfessorsView v-if="currentView === 'professors'" />
        <ClassroomsView v-else-if="currentView === 'classrooms'" />
        <CoursesView v-else-if="currentView === 'courses'" />
        <DisciplinesView v-else-if="currentView === 'disciplines'" />
        <EventsView v-else-if="currentView === 'events'" />
        <UsersView v-else-if="currentView === 'users'" />
        
        <div v-else class="welcome">
          <h1>Bem-vindo ao Dashboard SMT</h1>
          <p>Selecione uma opção no menu lateral para começar.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LoginView from './views/Login/LoginView.vue';
// import ProfessorsView from './views/ProfessorsView.vue';
// Importar outros views quando criar
// import ClassroomsView from './views/ClassroomsView.vue';
// import CoursesView from './views/CoursesView.vue';
// import DisciplinesView from './views/DisciplinesView.vue';
// import EventsView from './views/EventsView.vue';
// import UsersView from './views/UsersView.vue';

// Componentes temporários (remover quando criar os reais)
const ClassroomsView = { template: '<div class="temp-view"><h2>Salas (em desenvolvimento)</h2></div>' };
const CoursesView = { template: '<div class="temp-view"><h2>Cursos (em desenvolvimento)</h2></div>' };
const DisciplinesView = { template: '<div class="temp-view"><h2>Disciplinas (em desenvolvimento)</h2></div>' };
const EventsView = { template: '<div class="temp-view"><h2>Eventos (em desenvolvimento)</h2></div>' };
const UsersView = { template: '<div class="temp-view"><h2>Usuários (em desenvolvimento)</h2></div>' };

const isAuthenticated = ref(false);
const currentView = ref<string>('');
const currentUser = ref<any>(null);

// Verifica se já está autenticado ao carregar
onMounted(() => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    isAuthenticated.value = true;
    currentUser.value = JSON.parse(user);
    currentView.value = 'professors'; // View inicial
  }
});

function handleLoginSuccess() {
  isAuthenticated.value = true;
  const user = localStorage.getItem('user');
  if (user) {
    currentUser.value = JSON.parse(user);
  }
  currentView.value = 'professors';
}

function changeView(view: string) {
  currentView.value = view;
}

function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    isAuthenticated.value = false;
    currentUser.value = null;
    currentView.value = '';
  }
}
</script>

<style>
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px 20px;
  background-color: #1a252f;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.user-info {
  padding: 16px 20px;
  border-bottom: 1px solid #34495e;
}

.user-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.user-email {
  font-size: 12px;
  color: #95a5a6;
}

.menu {
  list-style: none;
  flex: 1;
  padding: 8px 0;
}

.menu li {
  margin: 2px 0;
}

.menu li a {
  display: block;
  padding: 12px 20px;
  color: #ecf0f1;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu li a:hover {
  background-color: #34495e;
}

.menu li.active a {
  background-color: #3498db;
  font-weight: 600;
}

.btn-logout {
  margin: 20px;
  padding: 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #c0392b;
}

.main-content {
  margin-left: 260px;
  flex: 1;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.welcome {
  padding: 40px;
  text-align: center;
  color: #666;
}

.welcome h1 {
  margin-bottom: 16px;
  color: #333;
}

.temp-view {
  padding: 40px;
  text-align: center;
  color: #666;
}

.temp-view h2 {
  color: #333;
}
</style>