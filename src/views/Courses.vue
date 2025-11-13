<template>
    <div class="courses-view">
        <!-- Cabeçalho com botão de adicionar -->
        <div class="view-header">
            <button @click="openCreateModal" class="btn btn-primary">
                <span><PlusIcon class="svg-icon"/></span> Novo Curso
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Carregando cursos...</p>
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="alert alert-error">
            {{ error }}
        </div>

        <!-- Tabela -->
        <div v-else class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Abreviação</th>
                        <th>Curso</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in courses" :key="course.id">
                        <td>{{ course.name }}</td>
                        <td>{{ course.abbreviation }}</td>
                        <td>
                            <div class="action-buttons">
                                <button @click="openEditModal(course)" class="btn-action btn-edit" title="Editar">
                                    <EditIcon class="svg-icon svg-edit"/>
                                </button>
                                <button @click="openDeleteModal(course)" class="btn-action btn-delete" title="Excluir">
                                    <DeleteIcon class="svg-icon svg-delete"/>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="courses.length === 0">
                        <td colspan="5" style="text-align: center; padding: 2rem;">
                            Nenhuma curso cadastrado
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Criar/Editar -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>{{ isEditing ? 'Editar' : 'Novo' }} Sala</h2>
                    <button @click="closeModal" class="btn-close">✕</button>
                </div>

                <form @submit.prcourse="handleSubmit" class="modal-form">
                    <div class="input-group">
                        <label for="name" class="input-label">Nome *</label>
                        <input id="name" v-model="formData.name" type="text" class="input-field"
                            required />
                    </div>

                    <div class="input-group">
                        <label for="abbreviation" class="input-label">Abreviação *</label>
                        <input id="abbreviation" v-model="formData.abbreviation" type="text" class="input-field" required />
                    </div>

                    <div v-if="formError" class="alert alert-error">
                        {{ formError }}
                    </div>

                    <div class="modal-actions">
                        <button type="button" @click="closeModal" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="saving">
                            {{ saving ? 'Salvando...' : 'Salvar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Confirmar Exclusão -->
        <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
            <div class="modal-content modal-small" @click.stop>
                <div class="modal-header">
                    <h2>Confirmar Exclusão</h2>
                    <button @click="closeDeleteModal" class="btn-close">✕</button>
                </div>

                <p class="modal-text">
                    Tem certeza que deseja excluir a curso
                    <strong>{{ selectedCourse?.name }}</strong>?
                    Esta ação não pode ser desfeita.
                </p>

                <div class="modal-actions">
                    <button @click="closeDeleteModal" class="btn btn-secondary">
                        Cancelar
                    </button>
                    <button @click="handleDelete" class="btn btn-danger" :disabled="deleting">
                        {{ deleting ? 'Excluindo...' : 'Excluir' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { coursesService } from '@/services/crudServices';
import type { Course } from '@/types';
import PlusIcon from '@/assets/icons/plus_icon.svg';
import EditIcon from '@/assets/icons/edit_icon.svg';
import DeleteIcon from '@/assets/icons/delete_icon.svg';

const courses = ref<Course[]>([]);
const loading = ref(false);
const error = ref('');

const showModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const formError = ref('');

const showDeleteModal = ref(false);
const deleting = ref(false);
const selectedCourse = ref<Course | null>(null);

const formData = reactive({
    id: '',
    name: '',
    abbreviation: '',
});

const loadCourses = async () => {
    loading.value = true;
    error.value = '';

    try {
        const data = await coursesService.getAll();
        courses.value = data;
    } catch (err: any) {
        error.value = err.message || 'Erro ao carregar cursos';
    } finally {
        loading.value = false;
    }
};

const openCreateModal = () => {
    isEditing.value = false;
    resetForm();
    showModal.value = true;
};

const openEditModal = (course: Course) => {
    isEditing.value = true;
    formData.name = course.name;
    formData.abbreviation = course.abbreviation;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    formError.value = '';
    resetForm();
};

const resetForm = () => {
    formData.name = '';
    formData.abbreviation = '';
};

const handleSubmit = async () => {
    saving.value = true;
    formError.value = '';

    try {
        const data = {
            name: formData.name,
            abbreviation: formData.abbreviation,
        };

        if (isEditing.value) {
            await coursesService.update(formData.id, data);
        } else {
            await coursesService.create(data);
        }

        await loadCourses();
        closeModal();
    } catch (err: any) {
        formError.value = err.message || 'Erro ao salvar curso';
    } finally {
        saving.value = false;
    }
};

const openDeleteModal = (course: Course) => {
    selectedCourse.value = course;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    selectedCourse.value = null;
};

const handleDelete = async () => {
    if (!selectedCourse.value) return;

    deleting.value = true;

    try {
        await coursesService.delete(selectedCourse.value.id);
        await loadCourses();
        closeDeleteModal();
    } catch (err: any) {
        alert(err.message || 'Erro ao excluir curso');
    } finally {
        deleting.value = false;
    }
};

onMounted(() => {
    loadCourses();
});
</script>

<style scoped>
.courses-view {
    width: 100%;
}

.view-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--spacing-lg);
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

/* Badges */
.badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
}

.badge-admin {
    background: #e8f5e9;
    color: #2e7d32;
}

.badge-course {
    background: #e3f2fd;
    color: #1565c0;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: var(--spacing-sm);
}

.btn-action {
    padding: 6px 10px;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 1rem;
    background: var(--color-background);
}

.btn-action:hover {
    transform: scale(1.1);
}

.btn-edit:hover {
    background: #e3f2fd;
}

.btn-delete:hover {
    background: #ffebee;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-lg);
}

.modal-content {
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-small {
    max-width: 400px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-text-primary);
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all var(--transition-fast);
}

.btn-close:hover {
    background: var(--color-background);
}

.modal-form {
    padding: var(--spacing-lg);
}

.modal-text {
    padding: var(--spacing-lg);
    color: var(--color-text-secondary);
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    font-weight: 600;
    color: var(--color-text-secondary);
}

.checkbox-input {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
}
</style>