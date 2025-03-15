import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Avatar } from '@mui/material';
import { signIn } from '../data/Api';
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
        h3: {
            fontWeight: 'bold',
            fontSize: '2.5rem',
            color: '#6a1b9a',
        },
        h4: {
            fontWeight: 'bold',
            fontSize: '1.8rem',
            color: '#6a1b9a',
        },
    },
});

export const SignIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signIn({ email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role);
            window.location.reload();
            setError('');
        } catch (err) {
            setError('Ошибка при входе. Проверьте email и пароль.');
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                {/* Логотип и название техникума */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Ташлинский политехнический техникум
                    </Typography>
                </Box>

                {/* Форма входа */}
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        mt: 2,
                        borderRadius: '16px',
                        backgroundColor: '#f5f5f5', // Однотонный светло-серый цвет
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Вход
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                sx: { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="Пароль"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                sx: { borderRadius: '8px' },
                            }}
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    borderRadius: '8px',
                                    padding: '12px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                Войти
                            </Button>
                        </Box>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Нет аккаунта?{' '}
                                <Button
                                    color="secondary"
                                    onClick={() => navigate('/signup')}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#ff6f00',
                                        },
                                    }}
                                >
                                    Зарегистрироваться
                                </Button>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};