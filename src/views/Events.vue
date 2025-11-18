<template>
    <div class="events-view">
        <!-- Cabeçalho com botão de adicionar -->
        <div class="view-header">
            <button @click="openCreateModal" class="btn btn-primary">
                <span><PlusIcon class="svg-icon"/></span> Novo Evento
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Carregando eventos...</p>
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
                        <th>Dia da Semana</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Sala</th>
                        <th>Professor</th>
                        <th>Curso</th>
                        <th>Disciplina</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in events" :key="event.id">
                        <td>{{ event.description }}</td>
                        <td>{{ getDayLabel(event.weekday as DaysEnum) }}</td>
                        <td>{{ event.startTime }}</td>
                        <td>{{ event.endTime }}</td>
                        <td>{{ event.classroom?.description }}</td>
                        <td>{{ event.professor?.description }}</td>
                        <td>{{ event.course?.description }}</td>
                        <td>{{ event.discipline?.description }}</td>
                        <td>
                            <div class="action-buttons">
                                <button @click="openEditModal(event)" class="btn-action btn-edit" title="Editar">
                                    <EditIcon class="svg-icon svg-edit"/>
                                </button>
                                <button @click="openDeleteModal(event)" class="btn-action btn-delete" title="Excluir">
                                    <DeleteIcon class="svg-icon svg-delete"/>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="events.length === 0">
                        <td colspan="9" style="text-align: center; padding: 2rem;">
                            Nenhum evento cadastrado
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Criar/Editar -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>{{ isEditing ? 'Editar' : 'Novo' }} Evento</h2>
                    <button @click="closeModal" class="btn-close">✕</button>
                </div>

                <form @submit.prevent="handleSubmit" class="modal-form">
                    <div class="input-group">
                        <label for="description" class="input-label">Descrição *</label>
                        <input id="description" v-model="formData.description" type="text" class="input-field"
                            required />
                    </div>

                    <div class="input-group">
                        <label for="weekday" class="input-label">Dia da Semana *</label>
                        <select id="weekday" v-model="formData.weekday" class="input-field" required>
                            <option value="" disabled>Selecione o dia</option>
                            <option v-for="day in weekdays" :key="day.value" :value="day.value">
                                {{ day.label }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="startTime" class="input-label">Início do Evento *</label>
                        <input id="startTime" v-model="formData.startTime" type="time" class="input-field" required />
                    </div>

                    <div class="input-group">
                        <label for="endTime" class="input-label">Fim do Evento *</label>
                        <input id="endTime" v-model="formData.endTime" type="time" class="input-field" required />
                    </div>

                    <div class="input-group">
                        <label for="classroomId" class="input-label">Sala *</label>
                        <select id="classroomId" v-model="formData.classroomId" class="input-field" required>
                            <option value="" disabled>Selecione uma sala</option>
                            <option v-for="classroom in classrooms" :key="classroom.id" :value="classroom.id">
                                {{ classroom.description }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="professorId" class="input-label">Professor *</label>
                        <select id="professorId" v-model="formData.professorId" class="input-field" required>
                            <option value="" disabled>Selecione um professor</option>
                            <option v-for="professor in professors" :key="professor.id" :value="professor.id">
                                {{ professor.name }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="courseId" class="input-label">Curso *</label>
                        <select id="courseId" v-model="formData.courseId" class="input-field" required>
                            <option value="" disabled>Selecione um curso</option>
                            <option v-for="course in courses" :key="course.id" :value="course.id">
                                {{ course.name }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="disciplineId" class="input-label">Disciplina *</label>
                        <select id="disciplineId" v-model="formData.disciplineId" class="input-field" required>
                            <option value="" disabled>Selecione uma disciplina</option>
                            <option v-for="discipline in disciplines" :key="discipline.id" :value="discipline.id">
                                {{ discipline.name }}
                            </option>
                        </select>
                    </div>

                    <div v-if="loadingOptions" class="alert alert-info">
                        Carregando opções...
                    </div>

                    <div v-if="formError" class="alert alert-error">
                        {{ formError }}
                    </div>

                    <div class="modal-actions">
                        <button type="button" @click="closeModal" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="saving || loadingOptions">
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
                    Tem certeza que deseja excluir o evento
                    <strong>{{ selectedEvent?.description }}</strong>?
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
import { eventsService, classroomsService, professorsService, coursesService, disciplinesService } from '@/services/crudServices';
import type { Event, EventAggregated, Classroom, Professor, Course, Discipline, DaysEnum } from '@/types';
import PlusIcon from '@/assets/icons/plus_icon.svg';
import EditIcon from '@/assets/icons/edit_icon.svg';
import DeleteIcon from '@/assets/icons/delete_icon.svg';

// Mapeamento de dias da semana (inglês -> português)
const weekdays = [
    { value: 'Monday' as DaysEnum, label: 'Segunda-feira' },
    { value: 'Tuesday' as DaysEnum, label: 'Terça-feira' },
    { value: 'Wednesday' as DaysEnum, label: 'Quarta-feira' },
    { value: 'Thursday' as DaysEnum, label: 'Quinta-feira' },
    { value: 'Friday' as DaysEnum, label: 'Sexta-feira' },
    { value: 'Saturday' as DaysEnum, label: 'Sábado' },
];

// Função auxiliar para converter dia em inglês para português
const getDayLabel = (dayValue: DaysEnum): string => {
    const day = weekdays.find(d => d.value === dayValue);
    return day ? day.label : dayValue;
};

const events = ref<EventAggregated[]>([]);
const loading = ref(false);
const error = ref('');

// Dados dos dropdowns
const classrooms = ref<Classroom[]>([]);
const professors = ref<Professor[]>([]);
const courses = ref<Course[]>([]);
const disciplines = ref<Discipline[]>([]);
const loadingOptions = ref(false);

const showModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const formError = ref('');

const showDeleteModal = ref(false);
const deleting = ref(false);
const selectedEvent = ref<Event | null>(null);

const formData = reactive({
    id: '',
    description: '',
    weekday: '',
    startTime: '',
    endTime: '',
    classroomId: '',
    professorId: '',
    courseId: '',
    disciplineId: '',
});

const loadEvents = async () => {
    loading.value = true;
    error.value = '';

    try {
        const data = await eventsService.getAll();
        events.value = data;
    } catch (err: any) {
        error.value = err.message || 'Erro ao carregar eventos';
    } finally {
        loading.value = false;
    }
};

// Carregar dados para os dropdowns
const loadDropdownOptions = async () => {
    loadingOptions.value = true;
    
    try {
        const [classroomsData, professorsData, coursesData, disciplinesData] = await Promise.all([
            classroomsService.getAll(),
            professorsService.getAll(),
            coursesService.getAll(),
            disciplinesService.getAll()
        ]);

        classrooms.value = classroomsData;
        professors.value = professorsData;
        courses.value = coursesData;
        disciplines.value = disciplinesData;
    } catch (err: any) {
        formError.value = 'Erro ao carregar opções do formulário';
        console.error('Erro ao carregar dropdowns:', err);
    } finally {
        loadingOptions.value = false;
    }
};

const openCreateModal = async () => {
    isEditing.value = false;
    resetForm();
    showModal.value = true;
    
    // Carregar opções dos dropdowns se ainda não foram carregadas
    if (classrooms.value.length === 0) {
        await loadDropdownOptions();
    }
};

const openEditModal = async (event: EventAggregated) => {
    isEditing.value = true;
    formData.id = event.id;
    formData.description = event.description;
    formData.weekday = event.weekday;
    formData.startTime = event.startTime;
    formData.endTime = event.endTime;
    formData.classroomId = event.classroom.id;
    formData.professorId = event.professor.id;
    formData.courseId = event.course.id;
    formData.disciplineId = event.discipline.id;
    
    showModal.value = true;
    
    // Carregar opções dos dropdowns se ainda não foram carregadas
    if (classrooms.value.length === 0) {
        await loadDropdownOptions();
    }
};

const closeModal = () => {
    showModal.value = false;
    formError.value = '';
    resetForm();
};

const resetForm = () => {
    formData.id = '';
    formData.description = '';
    formData.weekday = '';
    formData.startTime = '';
    formData.endTime = '';
    formData.classroomId = '';
    formData.professorId = '';
    formData.courseId = '';
    formData.disciplineId = '';
};

const handleSubmit = async () => {
    saving.value = true;
    formError.value = '';

    try {
        const data = {
            description: formData.description,
            weekday: formData.weekday,
            startTime: formData.startTime,
            endTime: formData.endTime,
            classroomId: formData.classroomId,
            professorId: formData.professorId,
            courseId: formData.courseId,
            disciplineId: formData.disciplineId,
        };

        if (isEditing.value) {
            await eventsService.update(formData.id, data);
        } else {
            await eventsService.create(data);
        }

        await loadEvents();
        closeModal();
    } catch (err: any) {
        formError.value = err.message || 'Erro ao salvar evento';
    } finally {
        saving.value = false;
    }
};

const openDeleteModal = (event: EventAggregated) => {
    selectedEvent.value = { 
        id: event.id, 
        description: event.description,
        weekday: event.weekday,
        startTime: event.startTime,
        endTime: event.endTime,
        classroomId: event.classroom.id,
        professorId: event.professor.id,
        courseId: event.course.id,
        disciplineId: event.discipline.id,
    } as Event;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    selectedEvent.value = null;
};

const handleDelete = async () => {
    if (!selectedEvent.value) return;

    deleting.value = true;

    try {
        await eventsService.delete(selectedEvent.value.id);
        await loadEvents();
        closeDeleteModal();
    } catch (err: any) {
        alert(err.message || 'Erro ao excluir evento');
    } finally {
        deleting.value = false;
    }
};

onMounted(() => {
    loadEvents();
});
</script>

<style scoped>
.events-view {
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

.badge-event {
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

/* Estilo para select */
select.input-field {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
}

select.input-field:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.alert-info {
    background: #e3f2fd;
    color: #1565c0;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-md);
}
</style>