import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../data/Api';

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

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Загрузка данных текущего пользователя
    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.error('Ошибка при загрузке данных пользователя:', err);
            });
    }, []);

    // Преобразуем роль на русский язык
    const roleInRussian = user?.role === 'INSTRUCTOR' ? 'Преподаватель' : 'Студент';

    // Функция для выхода из аккаунта
    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Удаляем токен из localStorage
        window.location.reload()
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{ backgroundColor: '#6a1b9a' }}>
                <Toolbar>
                    {/* Логотип и название компании */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }} onClick={() => navigate('/')}>
                            Ташлинский политехнический техникум
                        </Typography>
                    </Box>

                    {/* Имя пользователя и роль */}
                    {user && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, cursor: "pointer" }} onClick={() => {
                            navigate('/profile');
                        }}>
                            <Avatar
                                src="/logo.png" // Укажите путь к вашему логотипу
                                alt={user?.fullName}
                                sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                {user.fullName}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                ({roleInRussian})
                            </Typography>
                        </Box>
                    )}

                    {/* Кнопка выхода */}
                    {user && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleLogout}
                            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                        >
                            Выйти
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Header;