<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  // Verifica autenticação ao iniciar a aplicação
  authStore.checkAuth();
});
</script>