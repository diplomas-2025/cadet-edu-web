import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Avatar,
    Button,
    Divider,
    Box,
    Chip,
    Paper,
    Grid,
    Tabs,
    Tab,
    CircularProgress,
    Badge,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Card,
    CardContent,
    LinearProgress
} from '@mui/material';
import {
    Logout as LogoutIcon,
    School as AcademyIcon,
    MilitaryTech as RankIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Assignment as TestIcon,
    Star as AchievementIcon,
    Edit as EditIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { getCurrentUser, getTestResults } from '../data/Api';
import { useNavigate } from 'react-router-dom';

// Создаем кастомную тему
const theme = createTheme({
    palette: {
        primary: {
            main: '#1a3e72',
            light: '#4d6ea8',
        },
        secondary: {
            main: '#d32f2f',
        },
        success: {
            main: '#2e7d32',
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
    },
});

// Стилизованные компоненты
const ProgressCard = styled(Card)(({ theme }) => ({
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));

const AchievementBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 10,
        top: 10,
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },
}));

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Загрузка данных профиля
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userData, resultsData] = await Promise.all([
                    getCurrentUser(),
                    getTestResults()
                ]);

                setUser(userData.data);
                setTestResults(resultsData.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
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

    if (!user) {
        return <Typography>Ошибка загрузки профиля</Typography>;
    }

    const roleInRussian = user.role === 'INSTRUCTOR' ? 'Преподаватель' : 'Студент';
    const completedTests = testResults.filter(t => t.score >= 70).length;
    const averageScore = testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length || 0;

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Основная информация профиля */}
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ p: 4, position: 'relative' }}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <RankIcon color="primary" />
                                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                            {user.fullName}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={roleInRussian}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ mt: 1, mb: 2 }}
                                    />
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <EmailIcon color="primary" />
                                            <Typography variant="body1">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                </Grid>

                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<LogoutIcon />}
                                        onClick={handleLogout}
                                        sx={{ borderRadius: theme.shape.borderRadius }}
                                    >
                                        Выйти из системы
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Статистика */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <ProgressCard>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    Пройдено тестов
                                </Typography>
                                <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                                    {completedTests}
                                    <Typography variant="body2" color="textSecondary" component="span">
                                        /{testResults.length}
                                    </Typography>
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={(completedTests / testResults.length) * 100 || 0}
                                    sx={{ height: 8, mt: 2, borderRadius: 4 }}
                                />
                            </CardContent>
                        </ProgressCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <ProgressCard>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    Средний балл
                                </Typography>
                                <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                                    {averageScore.toFixed(1)}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={averageScore || 0}
                                    sx={{ height: 8, mt: 2, borderRadius: 4 }}
                                    color={averageScore >= 70 ? 'success' : 'secondary'}
                                />
                            </CardContent>
                        </ProgressCard>
                    </Grid>

                </Grid>

                {/* Табы с контентом */}
                <Paper sx={{ mb: 3, borderRadius: theme.shape.borderRadius }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Результаты тестов" icon={<TestIcon />} iconPosition="start" />
                    </Tabs>
                </Paper>

                {/* Содержимое табов */}
                <Box sx={{ mb: 4 }}>
                    {activeTab === 0 && (
                        <>
                            {testResults.length > 0 ? (
                                <List sx={{ width: '100%' }}>
                                    {testResults.map((result) => (
                                        <Card key={result.id} sx={{ mb: 2 }}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar sx={{
                                                        bgcolor: result.score >= 70 ? 'success.main' : 'secondary.main',
                                                        width: 56,
                                                        height: 56
                                                    }}>
                                                        {result.score}%
                                                    </Avatar>
                                                </ListItemAvatar>

                                                <ListItemText
                                                    primary={result.test.title}
                                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                                    sx={{
                                                        paddingLeft: 4,
                                                    }}
                                                />
                                                <Button
                                                    size="small"
                                                    onClick={() => navigate(`/assignments/${result.test.assignmentId}`)}
                                                >
                                                    Подробнее
                                                </Button>
                                            </ListItem>
                                        </Card>
                                    ))}
                                </List>
                            ) : (
                                <Paper sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="body1" color="textSecondary">
                                        Нет результатов тестов
                                    </Typography>
                                </Paper>
                            )}
                        </>
                    )}

                    {activeTab === 2 && (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="textSecondary">
                                График активности и история действий будут отображаться здесь
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/activity')}
                            >
                                Просмотреть полную активность
                            </Button>
                        </Paper>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ProfileScreen;