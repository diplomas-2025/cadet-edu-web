import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Grid, CssBaseline } from '@mui/material';
import { signUp } from '../data/Api';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { styled } from '@mui/system';

// Создаем кастомную тему с цветами МВД
const theme = createTheme({
    palette: {
        primary: {
            main: '#1a3e72', // Темно-синий
            light: '#4d6ea8',
        },
        secondary: {
            main: '#d32f2f', // Красный
        },
        background: {
            default: '#f8f9fa',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: '1.8rem',
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
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: '12px 24px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.primary.light,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

export const SignUp = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signUp({ firstName, email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role);
            window.location.reload();
            setIsRegistered(true);
            setError('');
        } catch (err) {
            setError('Ошибка при регистрации. Проверьте введенные данные.');
        }
    };

    if (isRegistered) {
        return <Navigate to="/" />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Grid container spacing={4} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box textAlign="center" mb={4}>
                            <MilitaryTechIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                            <Typography
                                variant="h4"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    mt: 2,
                                }}
                            >
                                ФГКОУ "Самарский кадетский корпус МВД России"
                            </Typography>
                            <Typography variant="h5" color="textSecondary">
                                Система дополнительного образования
                            </Typography>
                        </Box>
                        <Box textAlign="center">
                            <img
                                src="https://static.mvd.ru/upload/site147/OxBRBa8YD9.jpg"
                                alt="Кадетский корпус"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: theme.shape.borderRadius * 2,
                                    boxShadow: theme.shadows[4],
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <StyledPaper elevation={0}>
                            <Typography
                                variant="h4"
                                component="h2"
                                align="center"
                                gutterBottom
                                sx={{
                                    mb: 4,
                                    color: theme.palette.primary.main,
                                    position: 'relative',
                                    '&:after': {
                                        content: '""',
                                        display: 'block',
                                        width: '60px',
                                        height: '4px',
                                        background: theme.palette.secondary.main,
                                        margin: '16px auto 0',
                                        borderRadius: '2px',
                                    }
                                }}
                            >
                                Регистрация
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <StyledTextField
                                    label="Фамилия Имя Отчество"
                                    fullWidth
                                    margin="normal"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        sx: { borderRadius: theme.shape.borderRadius },
                                    }}
                                />

                                <StyledTextField
                                    label="Электронная почта"
                                    fullWidth
                                    margin="normal"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        sx: { borderRadius: theme.shape.borderRadius },
                                    }}
                                />

                                <StyledTextField
                                    label="Пароль"
                                    fullWidth
                                    margin="normal"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        sx: { borderRadius: theme.shape.borderRadius },
                                    }}
                                />

                                {error && (
                                    <Typography
                                        color="error"
                                        align="center"
                                        sx={{
                                            mt: 2,
                                            mb: 2,
                                            padding: 1,
                                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                            borderRadius: theme.shape.borderRadius,
                                        }}
                                    >
                                        {error}
                                    </Typography>
                                )}

                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <StyledButton
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            mb: 2,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: theme.shadows[6],
                                            },
                                        }}
                                    >
                                        Зарегистрироваться
                                    </StyledButton>

                                    <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary' }}>
                                        Уже зарегистрированы?{' '}
                                        <Button
                                            color="secondary"
                                            onClick={() => navigate('/signin')}
                                            sx={{
                                                fontWeight: 600,
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Войти в систему
                                        </Button>
                                    </Typography>
                                </Box>
                            </form>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};