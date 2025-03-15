import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Chip,
    Divider,
    Button,
    Container,
    Box,
    Paper,
} from '@mui/material';
import { Person as PersonIcon, Assignment as AssignmentIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestResultsByAssignmentId } from '../data/Api';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Создаем кастомную тему
const theme = createTheme({
    palette: {
        primary: {
            main: '#6a1b9a', // Фиолетовый
        },
        secondary: {
            main: '#ffab40', // Оранжевый
        },
        info: {
            main: '#2196f3', // Синий
        },
        success: {
            main: '#4caf50', // Зеленый
        },
        error: {
            main: '#f44336', // Красный
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export const TestResultCard = ({ result }) => {
    const { user, test, score } = result;
    const navigate = useNavigate();

    // Переход на страницу курса
    const handleGoToCourse = () => {
        navigate(`/assignments/${test.assignmentId}`);
    };

    return (
        <Paper
            elevation={6}
            sx={{
                mb: 3,
                borderRadius: '16px',
                backgroundColor: '#f5f5f5',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
            }}
        >
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    {/* Аватар пользователя */}
                    <Grid item>
                        <Avatar sx={{ bgcolor: user.role === 'INSTRUCTOR' ? 'primary.main' : 'secondary.main' }}>
                            <PersonIcon />
                        </Avatar>
                    </Grid>

                    {/* Информация о пользователе */}
                    <Grid item xs={8}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                            {user.fullName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user.email}
                        </Typography>
                        <Chip
                            label={user.role === 'INSTRUCTOR' ? 'Преподаватель' : 'Студент'}
                            size="small"
                            color={user.role === 'INSTRUCTOR' ? 'primary' : 'default'}
                            sx={{ mt: 1 }}
                        />
                    </Grid>

                    {/* Баллы */}
                    <Grid item xs={2}>
                        <Typography
                            variant="h5"
                            align="right"
                            sx={{
                                fontWeight: 'bold',
                                color: score >= 80 ? 'success.main' : 'error.main',
                            }}
                        >
                            {score}%
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Информация о тесте */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                            <AssignmentIcon />
                        </Avatar>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                            {test.title}
                        </Typography>   
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                            onClick={handleGoToCourse}
                            sx={{ borderRadius: '8px', fontWeight: 'bold', textTransform: 'none' }}
                        >
                            Перейти
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Paper>
    );
};

const TestResultsList = () => {
    const { assignmentId } = useParams();
    const [testResults, setTestResults] = useState([]);

    useEffect(() => {
        getTestResultsByAssignmentId(assignmentId).then((r) => setTestResults(r.data));
    }, [assignmentId]);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Результаты тестов
                </Typography>
                <Box>
                    {testResults.map((result) => (
                        <TestResultCard key={result.id} result={result} />
                    ))}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default TestResultsList;