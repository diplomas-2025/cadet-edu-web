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
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { TestResultCard } from './TestResultCard';
import { getCurrentUser, getTestResults } from '../data/Api';
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
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

const ProfileScreen = () => {
    const [user, setUser] = useState({
        id: 0,
        fullName: '',
        email: '',
        role: '',
    });
    const [testResults, setTestResults] = useState([]); // Состояние для результатов тестов

    // Загрузка данных профиля и результатов тестов
    useEffect(() => {
        getCurrentUser().then((response) => {
            setUser(response.data);
        });
        getTestResults().then((response) => {
            setTestResults(response.data);
        });
    }, []);

    // Обработчик выхода из аккаунта
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                {/* Заголовок профиля */}
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Профиль пользователя
                </Typography>

                {/* Информация о пользователе */}
                <Paper elevation={6} sx={{ p: 3, mb: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                            {user.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                                {user.fullName}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {user.email}
                            </Typography>
                            <Chip
                                label={user.role === 'INSTRUCTOR' ? 'Преподаватель' : 'Студент'}
                                color={user.role === 'INSTRUCTOR' ? 'primary' : 'default'}
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* Кнопка выхода */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                    >
                        Выйти из аккаунта
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Список результатов тестов */}
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Результаты тестов
                </Typography>
                {testResults.length > 0 ? (
                    <Box>
                        {testResults.map((result) => (
                            <TestResultCard key={result.id} result={result} />
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1" align="center" color="textSecondary">
                        Нет результатов тестов.
                    </Typography>
                )}
            </Container>
        </ThemeProvider>
    );
};

export default ProfileScreen;