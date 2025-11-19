<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="modal-body">
        <!-- Foto de Perfil -->
        <div class="profile-photo-container">
          <div 
            class="profile-photo-wrapper"
            @click="triggerFileInput"
            :class="{ 'has-photo': profilePhoto, 'cursor-pointer': true }"
          >
            <img 
              v-if="profilePhoto" 
              :src="profilePhoto" 
              alt="Foto de Perfil"
              class="profile-photo"
            />
            <div v-else class="profile-photo-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="photo-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              <span>Clique para alterar</span>
            </div>
          </div>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            style="display: none"
            @change="handleFileSelected"
          />
        </div>

        <!-- Informações do Usuário -->
        <div class="profile-info">
          <h2 class="profile-name">{{ user?.fullName }}</h2>
          <div class="profile-role">
            <span v-if="isAdmin" class="role-badge admin">Admin</span>
            <span v-else class="role-badge user">Usuário</span>
          </div>
        </div>

        <!-- Informações Adicionais -->
        <div class="profile-details">
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ user?.email }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Matrícula:</span>
            <span class="detail-value">{{ user?.enrollment }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Image Crop Modal -->
  <ImageCropModal ref="cropModalRef" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import ImageCropModal from './ImageCropModal.vue';

const authStore = useAuthStore();
const isOpen = ref(false);
const fileInput = ref<HTMLInputElement>();
const cropModalRef = ref<InstanceType<typeof ImageCropModal>>();

const user = computed(() => authStore.user);
const isAdmin = computed(() => authStore.isAdmin);
const profilePhoto = computed(() => authStore.user?.profilePhoto);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem válido.');
    return;
  }

  // Validar tamanho (máx 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 5MB.');
    return;
  }

  // Converter para Data URL e abrir crop modal
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string;
    cropModalRef.value?.openModal(dataUrl);
    // Limpar input
    input.value = '';
  };
  reader.onerror = () => {
    alert('Erro ao ler o arquivo. Tente novamente.');
  };
  reader.readAsDataURL(file);
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 150ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Content */
.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 90%;
  position: relative;
  animation: slideUp 250ms ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Botão Fechar */
.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
  z-index: 10;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--color-text-primary);
}

/* Modal Body */
.modal-body {
  padding: var(--spacing-xl);
  text-align: center;
}

/* Foto de Perfil */
.profile-photo-container {
  margin-bottom: var(--spacing-lg);
}

.profile-photo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-md);
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-background);
  border: 3px solid var(--color-border);
  transition: all var(--transition-base);
}

.profile-photo-wrapper.cursor-pointer {
  cursor: pointer;
}

.profile-photo-wrapper:hover {
  border-color: var(--color-primary);
}

.profile-photo-wrapper:hover .photo-overlay {
  opacity: 1;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-disabled);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: white;
  opacity: 0;
  transition: opacity var(--transition-base);
  cursor: pointer;
}

.photo-overlay svg {
  width: 20px;
  height: 20px;
  stroke: white;
}

.photo-overlay span {
  font-size: 0.75rem;
  font-weight: 600;
}

/* Informações do Usuário */
.profile-info {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.profile-role {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
}

.role-badge {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.role-badge.user {
  background-color: #e3f2fd;
  color: #1565c0;
}

/* Detalhes do Perfil */
.profile-details {
  text-align: left;
  margin-bottom: var(--spacing-lg);
}

.detail-item {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}

.detail-label {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.detail-value {
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  word-break: break-all;
}

/* Status de Upload */
.upload-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsividade */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    max-width: 100%;
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .profile-photo-wrapper {
    width: 100px;
    height: 100px;
  }
}
</style>
