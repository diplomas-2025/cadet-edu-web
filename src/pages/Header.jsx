import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
    Badge,
    styled
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../data/Api';
import {
    Menu as MenuIcon,
    ExitToApp as LogoutIcon,
    AccountCircle as ProfileIcon,
    Notifications as NotificationsIcon,
    School as AcademyIcon,
    Home as HomeIcon,
    Book as CoursesIcon,
    MilitaryTech as RankIcon
} from '@mui/icons-material';

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
        background: {
            default: '#f8f9fa',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Arial", sans-serif',
        h6: {
            fontWeight: 700,
        },
    },
});

// Стилизованные компоненты
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Новый тест по тактике', time: '10 мин назад', read: false },
        { id: 2, text: 'Обновление материалов по праву', time: '2 часа назад', read: true },
        { id: 3, text: 'Завтра построение в 8:00', time: 'Вчера', read: true },
    ]);

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

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsOpen = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
    };

    const handleNotificationRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? {...n, read: true} : n
        ));
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
    };

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;
    const roleInRussian = user?.role === 'INSTRUCTOR' ? 'Преподаватель' : 'Студент';

    return (
        <ThemeProvider theme={theme}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #1a3e72 0%, #0d2b4e 100%)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Логотип и навигация */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => navigate('/')}
                        >
                            <RankIcon fontSize="large" />
                        </IconButton>

                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: { xs: 'none', md: 'block' }
                            }}
                            onClick={() => navigate('/')}
                        >
                            Самарский кадетский корпус МВД РФ
                        </Typography>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                            <Button
                                color="inherit"
                                startIcon={<CoursesIcon />}
                                onClick={() => navigate('/courses')}
                                sx={{ mx: 1 }}
                            >
                                Курсы
                            </Button>
                        </Box>
                    </Box>

                    {/* Уведомления и профиль */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                ml: 2
                            }}
                            onClick={handleMenuOpen}
                        >
                            <Avatar
                                src={user?.avatarUrl || '/default-avatar.jpg'}
                                alt={user?.fullName}
                                sx={{ width: 40, height: 40, mr: 1 }}
                            />
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
                                <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                                    {user?.fullName}
                                </Typography>
                                <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                                    {roleInRussian}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>

                {/* Меню профиля */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                        <ListItemIcon>
                            <ProfileIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Мой профиль</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>Выйти</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Меню уведомлений */}
                <Menu
                    anchorEl={notificationsAnchorEl}
                    open={Boolean(notificationsAnchorEl)}
                    onClose={handleNotificationsClose}
                    PaperProps={{
                        sx: {
                            width: 350,
                            maxHeight: 400,
                            py: 0,
                        }
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Уведомления ({unreadNotificationsCount})
                        </Typography>
                    </Box>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                sx={{
                                    bgcolor: notification.read ? 'inherit' : 'action.hover',
                                    borderLeft: notification.read ? 'none' : '3px solid ' + theme.palette.primary.main
                                }}
                                onClick={() => {
                                    handleNotificationRead(notification.id);
                                    handleNotificationsClose();
                                }}
                            >
                                <ListItemText
                                    primary={notification.text}
                                    secondary={notification.time}
                                    primaryTypographyProps={{
                                        fontWeight: notification.read ? 'normal' : 'bold'
                                    }}
                                />
                            </MenuItem>
                        ))
                    ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary">
                                Нет новых уведомлений
                            </Typography>
                        </Box>
                    )}
                    <Divider />
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Button size="small" onClick={handleNotificationsClose}>
                            Закрыть
                        </Button>
                    </Box>
                </Menu>
            </AppBar>
            {/* Отступ для контента под фиксированной шапкой */}
            <Toolbar />
        </ThemeProvider>
    );
};

export default Header;