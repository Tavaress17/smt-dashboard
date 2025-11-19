<template>
  <div v-if="isOpen" class="crop-modal-overlay" @click="closeModal">
    <div class="crop-modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="crop-modal-body">
        <h2 class="crop-title">Recortar Imagem</h2>
        <p class="crop-subtitle">Ajuste a imagem para encaixar no círculo</p>

        <!-- Canvas para o crop -->
        <div class="crop-container">
          <div class="crop-preview-circle">
            <canvas
              ref="croppableCanvas"
              class="crop-canvas"
              @mousedown="startDrag"
              @touchstart="startDrag"
            ></canvas>
          </div>
        </div>

        <!-- Controles de zoom -->
        <div class="crop-controls">
          <div class="zoom-control">
            <label>Zoom:</label>
            <input
              v-model.number="scale"
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              @input="redrawCanvas"
              class="zoom-slider"
            />
            <span class="zoom-value">{{ (scale * 100).toFixed(0) }}%</span>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="crop-actions">
          <button @click="closeModal" class="btn-cancel">Cancelar</button>
          <button @click="confirmCrop" class="btn-confirm">Confirmar e Enviar</button>
        </div>

        <!-- Indicador de upload -->
        <div v-if="isUploading" class="upload-status">
          <div class="spinner-small"></div>
          <span>Enviando foto...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/authService';

interface CropState {
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
}

const authStore = useAuthStore();
const isOpen = ref(false);
const isUploading = ref(false);
const croppableCanvas = ref<HTMLCanvasElement>();

let originalImage: HTMLImageElement | null = null;
let cropState: CropState = {
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
};

const scale = ref(1);
const CIRCLE_RADIUS = 100; // Raio do círculo de preview

const openModal = (imageDataUrl: string) => {
  isOpen.value = true;
  
  nextTick(() => {
    originalImage = new Image();
    originalImage.onload = () => {
      redrawCanvas();
    };
    originalImage.src = imageDataUrl;
  });
};

const closeModal = () => {
  isOpen.value = false;
  originalImage = null;
  cropState = {
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
  };
};

const redrawCanvas = () => {
  if (!croppableCanvas.value || !originalImage) return;

  const canvas = croppableCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Define tamanho do canvas (diâmetro do círculo)
  const size = CIRCLE_RADIUS * 2;
  canvas.width = size;
  canvas.height = size;

  // Limpa canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, size, size);

  // Draw círculo branco como máscara
  ctx.save();
  ctx.beginPath();
  ctx.arc(CIRCLE_RADIUS, CIRCLE_RADIUS, CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.clip();

  // Calcula dimensões escaladas
  const scaledWidth = originalImage.width * scale.value;
  const scaledHeight = originalImage.height * scale.value;

  // Centraliza a imagem
  const x = CIRCLE_RADIUS - scaledWidth / 2 + cropState.offsetX;
  const y = CIRCLE_RADIUS - scaledHeight / 2 + cropState.offsetY;

  ctx.drawImage(originalImage, x, y, scaledWidth, scaledHeight);
  ctx.restore();

  // Draw border do círculo
  ctx.strokeStyle = '#2f9e41';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(CIRCLE_RADIUS, CIRCLE_RADIUS, CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  cropState.isDragging = true;

  if (event instanceof TouchEvent) {
    const touch = event.touches[0];
    if (touch) {
      cropState.startX = touch.clientX;
      cropState.startY = touch.clientY;
    }
  } else {
    cropState.startX = event.clientX;
    cropState.startY = event.clientY;
  }

  const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
    if (!cropState.isDragging) return;

    let currentX: number;
    let currentY: number;

    if (moveEvent instanceof TouchEvent) {
      const touch = moveEvent.touches[0];
      if (touch) {
        currentX = touch.clientX;
        currentY = touch.clientY;
      } else {
        return;
      }
    } else {
      currentX = moveEvent.clientX;
      currentY = moveEvent.clientY;
    }

    cropState.offsetX += currentX - cropState.startX;
    cropState.offsetY += currentY - cropState.startY;

    cropState.startX = currentX;
    cropState.startY = currentY;

    redrawCanvas();
  };

  const endHandler = () => {
    cropState.isDragging = false;
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', endHandler);
    document.removeEventListener('touchmove', moveHandler);
    document.removeEventListener('touchend', endHandler);
  };

  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('mouseup', endHandler);
  document.addEventListener('touchmove', moveHandler);
  document.addEventListener('touchend', endHandler);
};

const confirmCrop = async () => {
  if (!croppableCanvas.value) return;

  isUploading.value = true;

  try {
    // Converte canvas para Base64
    const dataUrl = croppableCanvas.value.toDataURL('image/jpeg', 0.95);

    // Envia para a API
    await authService.updateProfilePhoto(dataUrl);

    // Atualiza o perfil
    await authStore.fetchUserProfile();

    // Fecha modal
    closeModal();
  } catch (error: any) {
    console.error('Erro ao fazer upload da foto:', error);
    alert('Erro ao enviar a foto. Tente novamente.');
  } finally {
    isUploading.value = false;
  }
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style scoped>
/* Modal Overlay */
.crop-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
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
.crop-modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
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
.crop-modal-body {
  padding: var(--spacing-xl);
}

/* Título e Subtítulo */
.crop-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.crop-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-lg) 0;
}

/* Container do Crop */
.crop-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  background-color: var(--color-background);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
}

.crop-preview-circle {
  position: relative;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.crop-canvas {
  width: 100%;
  height: 100%;
  cursor: grab;
  display: block;
}

.crop-canvas:active {
  cursor: grabbing;
}

/* Controles de Zoom */
.crop-controls {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
}

.zoom-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.zoom-control label {
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 50px;
}

.zoom-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.zoom-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.zoom-value {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Botões de Ação */
.crop-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-cancel:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
}

.btn-confirm {
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-confirm:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

/* Status de Upload */
.upload-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
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
  .crop-modal-content {
    width: 95%;
  }

  .crop-modal-body {
    padding: var(--spacing-lg);
  }

  .crop-preview-circle {
    width: 180px;
    height: 180px;
  }

  .crop-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
