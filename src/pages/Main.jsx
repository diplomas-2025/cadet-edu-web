import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {getAllCourses, isTeacher} from '../data/Api';
import { useNavigate } from 'react-router-dom';

// Создаем кастомную тему
const theme = createTheme({
    palette: {
        primary: {
            main: '#6a1b9a', // Фиолетовый
        },
        secondary: {
            main: '#ffab40', // Оранжевый
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

const Main = () => {
    const navigate = useNavigate();
    const [assignmentsList, setAssignmentsList] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('subject');
    const [filterByGroup, setFilterByGroup] = useState('');
    const [filterByInstructor, setFilterByInstructor] = useState('');

    // Загрузка данных
    useEffect(() => {
        getAllCourses().then((response) => {
            setAssignmentsList(response.data);
            setFilteredAssignments(response.data);
        });
    }, []);

    // Обработка поиска, сортировки и фильтрации
    useEffect(() => {
        let filtered = assignmentsList;

        // Поиск
        if (searchQuery) {
            filtered = filtered.filter((assignment) => {
                const searchLower = searchQuery.toLowerCase();
                return (
                    assignment.subject.name.toLowerCase().includes(searchLower) ||
                    assignment.group.name.toLowerCase().includes(searchLower) ||
                    assignment.instructor.fullName.toLowerCase().includes(searchLower)
                );
            });
        }

        // Фильтрация по группе
        if (filterByGroup) {
            filtered = filtered.filter((assignment) => assignment.group.name === filterByGroup);
        }

        // Фильтрация по преподавателю
        if (filterByInstructor) {
            filtered = filtered.filter((assignment) => assignment.instructor.fullName === filterByInstructor);
        }

        // Сортировка
        if (sortBy === 'subject') {
            filtered.sort((a, b) => a.subject.name.localeCompare(b.subject.name));
        } else if (sortBy === 'group') {
            filtered.sort((a, b) => a.group.name.localeCompare(b.group.name));
        } else if (sortBy === 'instructor') {
            filtered.sort((a, b) => a.instructor.fullName.localeCompare(b.instructor.fullName));
        }

        setFilteredAssignments(filtered);
    }, [searchQuery, sortBy, filterByGroup, filterByInstructor, assignmentsList]);

    // Получаем уникальные группы и преподавателей для фильтров
    const uniqueGroups = [...new Set(assignmentsList.map((assignment) => assignment.group.name))];
    const uniqueInstructors = [...new Set(assignmentsList.map((assignment) => assignment.instructor.fullName))];

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                {/* Заголовок и кнопка добавления */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                        Список предметов
                    </Typography>
                    { isTeacher() &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/add-assignment')} // Перенаправление на страницу добавления
                            sx={{ borderRadius: '8px', fontWeight: 'bold', padding: '10px 20px' }}
                        >
                            Добавить предмет
                        </Button>
                    }
                </Box>

                {/* Поиск */}
                <TextField
                    fullWidth
                    label="Поиск"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {/* Фильтры и сортировка */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Сортировать по</InputLabel>
                        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Сортировать по">
                            <MenuItem value="subject">Предмет</MenuItem>
                            <MenuItem value="group">Группа</MenuItem>
                            <MenuItem value="instructor">Преподаватель</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Фильтровать по группе</InputLabel>
                        <Select
                            value={filterByGroup}
                            onChange={(e) => setFilterByGroup(e.target.value)}
                            label="Фильтровать по группе"
                        >
                            <MenuItem value="">Все группы</MenuItem>
                            {uniqueGroups.map((group) => (
                                <MenuItem key={group} value={group}>
                                    {group}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Фильтровать по преподавателю</InputLabel>
                        <Select
                            value={filterByInstructor}
                            onChange={(e) => setFilterByInstructor(e.target.value)}
                            label="Фильтровать по преподавателю"
                        >
                            <MenuItem value="">Все преподаватели</MenuItem>
                            {uniqueInstructors.map((instructor) => (
                                <MenuItem key={instructor} value={instructor}>
                                    {instructor}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Список предметов */}
                <Paper elevation={6} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <List>
                        {filteredAssignments.map((assignment) => (
                            <ListItem
                                key={assignment.id}
                                sx={{
                                    mb: 2,
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                                onClick={() => navigate(`/assignments/${assignment.id}`)}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                                            {assignment.subject.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body1" sx={{ color: '#333' }}>
                                                Группа: {assignment.group.name}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#333' }}>
                                                Преподаватель: {assignment.instructor.fullName}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Main;