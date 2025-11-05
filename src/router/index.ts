import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/authService';

// Importação dos componentes (lazy loading)
const Login = () => import('@/views/Login.vue');
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue');
const Home = () => import('@/views/Home.vue');
const Users = () => import('@/views/Users.vue');
const Professors = () => import('@/views/Professors.vue');
const Courses = () => import('@/views/Courses.vue');
const Disciplines = () => import('@/views/Disciplines.vue');
const Classrooms = () => import('@/views/Classrooms.vue');
const Events = () => import('@/views/Events.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: '/home',
        name: 'Home',
        component: Home,
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: { requiresAdmin: true },
      },
      {
        path: '/professors',
        name: 'Professors',
        component: Professors,
        meta: { requiresAdmin: true },
      },
      {
        path: '/courses',
        name: 'Courses',
        component: Courses,
        meta: { requiresAdmin: true },
      },
      {
        path: '/disciplines',
        name: 'Disciplines',
        component: Disciplines,
        meta: { requiresAdmin: true },
      },
      {
        path: '/classrooms',
        name: 'Classrooms',
        component: Classrooms,
        meta: { requiresAdmin: true },
      },
      {
        path: '/events',
        name: 'Events',
        component: Events,
        meta: { requiresAdmin: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard - Proteção de Rotas
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authService.isAuthenticated();

  // Verifica autenticação
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  // Se está autenticado mas não tem dados do usuário, busca
  if (isAuthenticated && !authStore.user) {
    try {
      await authStore.checkAuth();
    } catch {
      return next('/login');
    }
  }

  // Verifica se a rota requer admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/home');
  }

  // Redireciona para home se já está logado e tenta acessar login
  if (to.path === '/login' && isAuthenticated) {
    return next('/home');
  }

  next();
});

export default router;