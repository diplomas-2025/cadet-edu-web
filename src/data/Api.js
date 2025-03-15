// api.js
import axios from 'axios';

const API_BASE_URL = 'https://spotdiff.ru/polytech-api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем interceptor для автоматической подстановки токена в заголовки
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Регистрация нового пользователя
export const signUp = async (signUpParams) => {
    return api.post('/users/security/sign-up', signUpParams);
};

// Вход пользователя
export const signIn = async (signInParams) => {
    return api.post('/users/security/sign-in', signInParams);
};

// Получение всех тестов по assignmentId
export const getAllTests = async (assignmentId) => {
    return api.get('/api/tests', { params: { assignmentId } });
};

// Создание нового теста
export const createTest = async (assignmentId, title, questions) => {
    return api.post('/api/tests', questions, { params: { assignmentId, title } });
};

// Отправка ответов на тест
// export const submitTest = async (testId, answers) => {
//     return api.post(`/api/tests/${testId}/submit`, { answers });
// };
export async function submitTest(id, answers) {
    const response = await api.post(`/api/tests/${id}/submit`, answers);
    return response.data;
}


// Получение всех уроков по assignmentId
export const getLessons = async (assignmentId) => {
    return api.get('/api/lessons', { params: { assignmentId } });
};

// Создание нового урока
export const createLesson = async (lessonRequest) => {
    return api.post('/api/lessons', lessonRequest);
};

// Получение всех курсов
export const getAllCourses = async () => {
    return api.get('/api/assignments');
};

// Создание нового курса
export const createCourse = async (courseRequest) => {
    return api.post('/api/assignments', courseRequest);
};

// Получение материалов курса по ID
export const getMaterials = async (courseId) => {
    return api.get(`/api/assignments/${courseId}/materials`);
};

// Добавление материалов к курсу
export const addMaterials = async (courseId, createMaterialDto) => {
    return api.post(`/api/assignments/${courseId}/materials`, createMaterialDto);
};

// Получение информации о текущем пользователе
export const getCurrentUser = async () => {
    return api.get('/api/users/me');
};

// Получение вопросов теста по ID
export const getTestQuestions = async (testId) => {
    return api.get(`/api/tests/${testId}/questions`);
};

// Получение прогресса пользователя
export const getUserProgress = async () => {
    return api.get('/api/progress');
};

// Получение результатов тестов
export const getTestResults = async () => {
    return api.get('/api/progress/test-results');
};

// Получение результатов теста по ID
export const getTestResultsById = async (testId) => {
    return api.get(`/api/progress/test-results/by-test-id/${testId}`);
};

// Получение результатов тестов по assignmentId
export const getTestResultsByAssignmentId = async (assignmentId) => {
    return api.get('/api/progress/test-results/assignment', { params: { assignmentIdId: assignmentId } });
};

// Получение урока по ID
export const getLessonById = async (lessonId) => {
    return api.get(`/api/lessons/${lessonId}`);
};

// Получение курса по ID
export const getCourseById = async (courseId) => {
    return api.get(`/api/assignments/${courseId}`);
};

// Получение всех преподавателей
export const getAllTeachers = async () => {
    return api.get('/api/assignments/teachers');
};

// Получение всех групп
export const getAllGroups = async () => {
    return api.get('/api/assignments/groups');
};

export const getAllSubjects = async () => {
    return api.get('/api/assignments/subjects');
};

export const isTeacher = () => {
    return localStorage.getItem("role") === 'INSTRUCTOR'
}

export default api;