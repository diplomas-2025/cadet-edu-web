import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Button,
    Link,
    Dialog,
    DialogTitle,
    Avatar,
    IconButton,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    CardActionArea,
    Divider,
    Chip,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
    getAllTests,
    getCourseById,
    getLessons,
    getMaterials,
    getTestResults,
    getTestResultsById,
    isTeacher
} from '../data/Api';
import {
    Quiz as TestIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Book as BookIcon,
    School as LessonIcon,
    Assignment as AssignmentIcon,
    Email as EmailIcon,
    Group as GroupIcon,
    Person as TeacherIcon,
    Download as DownloadIcon,
    BarChart as ResultsIcon
} from '@mui/icons-material';

// Используем единую тему
const theme = createTheme({
    palette: {
        primary: {
            main: '#1a3e72',
            light: '#4d6ea8',
        },
        secondary: {
            main: '#d32f2f',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
    },
    shape: {
        borderRadius: 12,
    },
});

// Стилизованные компоненты
const StyledCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6],
    },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.5px',
    padding: '10px 20px',
    borderRadius: theme.shape.borderRadius,
}));

const SectionHeader = ({ title, icon, action }) => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        borderBottom: '2px solid',
        borderColor: 'divider',
        pb: 2
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {React.createElement(icon, { color: 'primary' })}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
        </Box>
        {action}
    </Box>
);

export const AssignmentDetails = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignmentData, setAssignmentData] = useState(null);
    const [materialsData, setMaterialsData] = useState([]);
    const [lessonsData, setLessonsData] = useState([]);
    const [testsData, setTestsData] = useState([]);
    const [test, setTest] = useState(null);
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [course, materials, lessons, tests] = await Promise.all([
                    getCourseById(assignmentId),
                    getMaterials(assignmentId),
                    getLessons(assignmentId),
                    getAllTests(assignmentId)
                ]);

                setAssignmentData(course.data);
                setMaterialsData(materials.data);
                setLessonsData(lessons.data);
                setTestsData(tests.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [assignmentId]);

    const handleClose = () => {
        setTest(null);
        setTestResult(null);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!assignmentData) {
        return <Typography>Курс не найден</Typography>;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Информация о курсе */}
                <StyledCard sx={{ mb: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <BookIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                {assignmentData.subject.name}
                            </Typography>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <GroupIcon color="primary" />
                                    <Typography variant="body1">
                                        <Box component="span" sx={{ fontWeight: 600 }}>Группа:</Box> {assignmentData.group.name}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <TeacherIcon color="primary" />
                                    <Typography variant="body1">
                                        <Box component="span" sx={{ fontWeight: 600 }}>Преподаватель:</Box> {assignmentData.instructor.fullName}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <EmailIcon color="primary" />
                                    <Typography variant="body1">
                                        <Box component="span" sx={{ fontWeight: 600 }}>Email:</Box> {assignmentData.instructor.email}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </StyledCard>

                {/* Табы для разделов */}
                <Paper sx={{ mb: 3, borderRadius: theme.shape.borderRadius }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Материалы" icon={<AssignmentIcon />} iconPosition="start" />
                        <Tab label="Уроки" icon={<LessonIcon />} iconPosition="start" />
                        <Tab label="Тесты" icon={<TestIcon />} iconPosition="start" />
                    </Tabs>
                </Paper>

                {/* Содержимое табов */}
                <Box sx={{ mb: 6 }}>
                    {/* Материалы */}
                    {activeTab === 0 && (
                        <>
                            <SectionHeader
                                title="Материалы курса"
                                icon={AssignmentIcon}
                                action={isTeacher() && (
                                    <StyledButton
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate(`/assignments/${assignmentId}/add-material`)}
                                    >
                                        Добавить материал
                                    </StyledButton>
                                )}
                            />

                            {materialsData.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: theme.shape.borderRadius }}>
                                    <Typography variant="body1" color="textSecondary">
                                        Материалы не добавлены
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {materialsData.map((material) => (
                                        <Grid item xs={12} sm={6} md={4} key={material.id}>
                                            <StyledCard>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                                                        {material.title}
                                                    </Typography>

                                                    <Chip
                                                        label={new Date(material.createdAt).toLocaleDateString()}
                                                        size="small"
                                                        sx={{ mb: 2 }}
                                                    />

                                                    <Divider sx={{ my: 2 }} />

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Link href={material.fileUrl} target="_blank" rel="noopener" underline="none">
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                startIcon={<DownloadIcon />}
                                                                size="small"
                                                            >
                                                                Скачать
                                                            </Button>
                                                        </Link>
                                                    </Box>
                                                </CardContent>
                                            </StyledCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}

                    {/* Уроки */}
                    {activeTab === 1 && (
                        <>
                            <SectionHeader
                                title="Уроки курса"
                                icon={LessonIcon}
                                action={isTeacher() && (
                                    <StyledButton
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate(`/assignments/${assignmentId}/add-lesson`)}
                                    >
                                        Добавить урок
                                    </StyledButton>
                                )}
                            />

                            {lessonsData.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: theme.shape.borderRadius }}>
                                    <Typography variant="body1" color="textSecondary">
                                        Уроки не добавлены
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {lessonsData.map((lesson) => (
                                        <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                                            <StyledCard onClick={() => navigate(`/assignments/${assignmentId}/lessons/${lesson.id}`)}>
                                                <CardActionArea>
                                                    <CardContent sx={{ p: 3, height: '100%' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <LessonIcon color="primary" sx={{ mr: 1 }} />
                                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                                                                {lesson.title}
                                                            </Typography>
                                                        </Box>

                                                        {lesson.description && (
                                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                                                {lesson.description.length > 100
                                                                    ? `${lesson.description.substring(0, 100)}...`
                                                                    : lesson.description}
                                                            </Typography>
                                                        )}

                                                        <Divider sx={{ my: 2 }} />

                                                        <Typography variant="caption" color="textSecondary">
                                                            Нажмите для просмотра
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </StyledCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}

                    {/* Тесты */}
                    {activeTab === 2 && (
                        <>
                            <SectionHeader
                                title="Тесты курса"
                                icon={TestIcon}
                                action={isTeacher() && (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <StyledButton
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<ResultsIcon />}
                                            onClick={() => navigate(`/assignments/${assignmentId}/result`)}
                                        >
                                            Результаты
                                        </StyledButton>
                                        <StyledButton
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            onClick={() => navigate(`/assignments/${assignmentId}/add-test`)}
                                        >
                                            Добавить тест
                                        </StyledButton>
                                    </Box>
                                )}
                            />

                            {testsData.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: theme.shape.borderRadius }}>
                                    <Typography variant="body1" color="textSecondary">
                                        Тесты не добавлены
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {testsData.map((testItem) => (
                                        <Grid item xs={12} sm={6} md={4} key={testItem.id}>
                                            <StyledCard>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <TestIcon color="primary" sx={{ mr: 1 }} />
                                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                                                            {testItem.title}
                                                        </Typography>
                                                    </Box>

                                                    {testItem.description && (
                                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                                            {testItem.description.length > 100
                                                                ? `${testItem.description.substring(0, 100)}...`
                                                                : testItem.description}
                                                        </Typography>
                                                    )}

                                                    <Divider sx={{ my: 2 }} />

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => {
                                                                getTestResultsById(testItem.id)
                                                                    .then((response) => {
                                                                        setTestResult(response.data);
                                                                        setTest(testItem);
                                                                    })
                                                                    .catch(() => {
                                                                        setTest(testItem);
                                                                    });
                                                            }}
                                                        >
                                                            {testResult ? 'Посмотреть' : 'Начать тест'}
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </StyledCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}
                </Box>

                {/* Диалог для теста */}
                <Dialog
                    open={test != null}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: 5,
                            boxShadow: theme.shadows[10],
                        },
                    }}
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <TestIcon />
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold">
                                    {test?.title}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Typography variant="body1" paragraph>
                            {test?.description}
                        </Typography>

                        {testResult && (
                            <Box
                                sx={{
                                    bgcolor: 'primary.light',
                                    p: 3,
                                    borderRadius: theme.shape.borderRadius,
                                    textAlign: 'center',
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold" color="primary.contrastText">
                                    Ваш результат: {testResult.score}%
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={handleClose}
                            color="secondary"
                            variant="outlined"
                            sx={{ borderRadius: theme.shape.borderRadius }}
                        >
                            Закрыть
                        </Button>
                        <Button
                            onClick={() => navigate(`/test/${test?.id}`)}
                            color="primary"
                            variant="contained"
                            sx={{ borderRadius: theme.shape.borderRadius }}
                            disabled={!!testResult}
                        >
                            {testResult ? 'Тест пройден' : 'Начать тест'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};