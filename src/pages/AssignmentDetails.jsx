import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    List,
    ListItem,
    ListItemText,
    Button,
    Link,
    DialogActions,
    Dialog,
    DialogTitle,
    Avatar,
    IconButton,
    DialogContent,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    getAllTests,
    getCourseById,
    getLessons,
    getMaterials,
    getTestResults,
    getTestResultsById, isTeacher,
} from '../data/Api';
import { Quiz as TestIcon, Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';

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

export const AssignmentDetails = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignmentData, setAssignmentData] = useState(null);
    const [materialsData, setMaterialsData] = useState([]);
    const [lessonsData, setLessonsData] = useState([]);
    const [testsData, setTestsData] = useState([]);
    const [test, setTest] = useState(null);
    const [testResult, setTestResult] = useState(null);

    // Загрузка данных
    useEffect(() => {
        getAllTests(assignmentId).then((response) => {
            setTestsData(response.data);
        });
        getLessons(assignmentId).then((response) => {
            setLessonsData(response.data);
        });
        getMaterials(assignmentId).then((response) => {
            setMaterialsData(response.data);
        });
        getCourseById(assignmentId).then((response) => {
            setAssignmentData(response.data);
        });
    }, [assignmentId]);

    if (!assignmentData) {
        return <Typography>Загрузка...</Typography>;
    }

    const handleClose = () => {
        setTest(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                {/* Информация о назначении */}
                <Paper elevation={6} sx={{ p: 3, mt: 2, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                        {assignmentData.subject.name}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333' }}>
                            Группа: {assignmentData.group.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#333' }}>
                            Преподаватель: {assignmentData.instructor.fullName}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#333' }}>
                            Email преподавателя: {assignmentData.instructor.email}
                        </Typography>
                    </Box>
                </Paper>

                {/* Материалы */}
                <Paper elevation={6} sx={{ p: 3, mt: 4, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                            Материалы
                        </Typography>
                        { isTeacher() &&
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => navigate(`/assignments/${assignmentId}/add-material`)}
                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                            >
                                Добавить материал
                            </Button>
                        }
                    </Box>
                    <List>
                        {materialsData.map((material) => (
                            <ListItem
                                key={material.id}
                                sx={{
                                    mb: 2,
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                                            {material.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body1" sx={{ color: '#333' }}>
                                                Дата создания: {new Date(material.createdAt).toLocaleDateString()}
                                            </Typography>
                                            <Link href={material.fileUrl} target="_blank" rel="noopener">
                                                <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                                                    Открыть
                                                </Button>
                                            </Link>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Уроки */}
                <Paper elevation={6} sx={{ p: 3, mt: 4, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                            Уроки
                        </Typography>
                        { isTeacher() &&
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => navigate(`/assignments/${assignmentId}/add-lesson`)}
                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                            >
                                Добавить урок
                            </Button>
                        }
                    </Box>
                    <List>
                        {lessonsData.map((lesson) => (
                            <ListItem
                                key={lesson.id}
                                sx={{
                                    mb: 2,
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                                onClick={() => navigate(`/assignments/${assignmentId}/lessons/${lesson.id}`)}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                                            {lesson.title}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Тесты */}
                <Paper elevation={6} sx={{ p: 3, mt: 4, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                            Тесты
                        </Typography>
                        { isTeacher() &&
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate(`/assignments/${assignmentId}/result`)}
                                    sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                >
                                    Результаты
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate(`/assignments/${assignmentId}/add-test`)}
                                    sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                >
                                    Добавить тест
                                </Button>
                            </>
                        }
                    </Box>
                    <List>
                        {testsData.map((test) => (
                            <ListItem
                                key={test.id}
                                sx={{
                                    mb: 2,
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                                            {test.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    getTestResultsById(test.id)
                                                        .then((response) => {
                                                            setTestResult(response.data);
                                                            setTest(test);
                                                        })
                                                        .catch(() => {
                                                            setTest(test);
                                                        });
                                                }}
                                            >
                                                Начать тест
                                            </Button>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Диалог для теста */}
                <Dialog
                    open={test != null}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: 6,
                            minWidth: '400px',
                        },
                    }}
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <TestIcon />
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold">
                                    {test != null ? test.title : ''}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleClose} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                            <Typography variant="body1" paragraph>
                                {test != null ? test.description : ''}
                            </Typography>
                            {testResult != null && (
                                <Box
                                    sx={{
                                        bgcolor: 'primary.light',
                                        p: 2,
                                        borderRadius: 2,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" color="primary.contrastText">
                                        Ваш результат: {testResult.score}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={handleClose}
                            color="secondary"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        >
                            Отмена
                        </Button>
                        <Button
                            disabled={testResult != null}
                            onClick={() => navigate(`/test/${test.id}`)}
                            color="primary"
                            variant="contained"
                            sx={{ borderRadius: 2 }}
                        >
                            Начать тест
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <div style={{ height: '100px' }} />
        </ThemeProvider>
    );
};