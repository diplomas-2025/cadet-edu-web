import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {getAllSubjects, getAllGroups, createCourse} from '../data/Api';

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

const AddAssignmentScreen = () => {
    const [subjects, setSubjects] = useState([]); // Список предметов
    const [groups, setGroups] = useState([]); // Список групп
    const [selectedSubjectId, setSelectedSubjectId] = useState(''); // Выбранный предмет
    const [selectedGroupId, setSelectedGroupId] = useState(''); // Выбранная группа
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [error, setError] = useState(''); // Сообщение об ошибке

    // Загрузка списка предметов и групп
    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectsResponse = await getAllSubjects();
                const groupsResponse = await getAllGroups();
                setSubjects(subjectsResponse.data);
                setGroups(groupsResponse.data);
            } catch (err) {
                setError('Ошибка при загрузке данных');
            }
        };

        fetchData();
    }, []);

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubjectId || !selectedGroupId) {
            setError('Пожалуйста, выберите предмет и группу');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await createCourse({
                subjectId: parseInt(selectedSubjectId),
                groupId: parseInt(selectedGroupId),
            });
            alert('Предмет успешно добавлен!');
            setSelectedSubjectId('');
            setSelectedGroupId('');
        } catch (err) {
            setError('Ошибка при добавлении предмета');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Добавить предмет
                </Typography>

                <Paper elevation={6} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Выбор предмета */}
                        <FormControl fullWidth>
                            <InputLabel>Предмет</InputLabel>
                            <Select
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                label="Предмет"
                                required
                            >
                                {subjects.map((subject) => (
                                    <MenuItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Выбор группы */}
                        <FormControl fullWidth>
                            <InputLabel>Группа</InputLabel>
                            <Select
                                value={selectedGroupId}
                                onChange={(e) => setSelectedGroupId(e.target.value)}
                                label="Группа"
                                required
                            >
                                {groups.map((group) => (
                                    <MenuItem key={group.id} value={group.id}>
                                        {group.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Кнопка отправки */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ borderRadius: '8px', fontWeight: 'bold', padding: '12px' }}
                        >
                            {loading ? 'Добавление...' : 'Добавить'}
                        </Button>

                        {/* Сообщение об ошибке */}
                        {error && (
                            <Typography color="error" align="center">
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default AddAssignmentScreen;