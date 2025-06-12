import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Grid, CssBaseline, Avatar, Divider } from '@mui/material';
import { signIn } from '../data/Api';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Используем ту же тему, что и в SignUp для единообразия
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
    maxWidth: 500,
    margin: '0 auto',
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
            setIsAuthenticated(true);
            setError('');
        } catch (err) {
            setError('Неверные учетные данные. Пожалуйста, проверьте email и пароль.');
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Box textAlign="center" mb={6}>
                    <MilitaryTechIcon sx={{
                        fontSize: 60,
                        color: theme.palette.primary.main,
                        mb: 2
                    }} />
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                        }}
                    >
                        ФГКОУ "Самарский кадетский корпус МВД России"
                    </Typography>
                    <Typography variant="h5" color="textSecondary">
                        Система дополнительного образования
                    </Typography>
                </Box>

                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={8}>
                        <StyledPaper elevation={0}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar sx={{
                                    m: 1,
                                    bgcolor: theme.palette.secondary.main,
                                    width: 56,
                                    height: 56
                                }}>
                                    <LockOutlinedIcon fontSize="medium" />
                                </Avatar>

                                <Typography
                                    component="h2"
                                    variant="h4"
                                    sx={{
                                        mt: 2,
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
                                    Вход в систему
                                </Typography>
                            </Box>

                            <form onSubmit={handleSubmit}>
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

                                <StyledButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        mb: 3,
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[6],
                                        },
                                    }}
                                >
                                    Войти
                                </StyledButton>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        Еще не зарегистрированы?{' '}
                                        <Button
                                            color="secondary"
                                            onClick={() => navigate('/signup')}
                                            sx={{
                                                fontWeight: 600,
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Создать аккаунт
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