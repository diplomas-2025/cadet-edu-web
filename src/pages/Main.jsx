import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    Grid,
    Chip,
    Card,
    CardContent,
    CardActionArea,
    Divider,
    IconButton,
    CircularProgress,
    Avatar,
    Badge
} from '@mui/material';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import { getAllCourses, isTeacher } from '../data/Api';
import { useNavigate } from 'react-router-dom';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import {StyledButton} from "./AssignmentDetails";

// Современная тема с градиентами и стеком
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
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: '"Inter", "Arial", sans-serif',
        h4: {
            fontWeight: 800,
            letterSpacing: '-0.5px',
        },
        h5: {
            fontWeight: 700,
            letterSpacing: '-0.3px',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 20px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
    },
});

// Стилизованные компоненты
const GradientCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },
}));

const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 10,
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
        '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
    },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 10,
        top: 10,
        padding: '0 4px',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
    },
}));

const Main = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('subject');
    const [filterByGroup, setFilterByGroup] = useState('');
    const [filterByInstructor, setFilterByInstructor] = useState('');
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setLoading(true);
        getAllCourses()
            .then((response) => {
                setCourses(response.data);
                setFilteredCourses(response.data);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let filtered = [...courses];

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter((course) =>
                course.subject.name.toLowerCase().includes(searchLower) ||
                course.group.name.toLowerCase().includes(searchLower) ||
                course.instructor.fullName.toLowerCase().includes(searchLower))
        }

        if (filterByGroup) {
            filtered = filtered.filter((course) => course.group.name === filterByGroup);
        }

        if (filterByInstructor) {
            filtered = filtered.filter((course) => course.instructor.fullName === filterByInstructor);
        }

        filtered.sort((a, b) => {
            if (sortBy === 'subject') return a.subject.name.localeCompare(b.subject.name);
            if (sortBy === 'group') return a.group.name.localeCompare(b.group.name);
            if (sortBy === 'instructor') return a.instructor.fullName.localeCompare(b.instructor.fullName);
            return 0;
        });

        setFilteredCourses(filtered);
    }, [searchQuery, sortBy, filterByGroup, filterByInstructor, courses]);

    const uniqueGroups = [...new Set(courses.map((course) => course.group.name))];
    const uniqueInstructors = [...new Set(courses.map((course) => course.instructor.fullName))];

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Заголовок и кнопка создания */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: 'primary.main',
                            width: 56,
                            height: 56,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}>
                            <MilitaryTechIcon sx={{ fontSize: 30 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="h1">
                                Дополнительное образование
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Самарский кадетский корпус МВД РФ
                            </Typography>
                        </Box>
                    </Box>

                    {isTeacher() && (
                        <StyledButton
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => navigate('/add-assignment')}
                        >
                            Создать курс
                        </StyledButton>
                    )}
                </Box>

                {/* Поиск и фильтры */}
                <Paper sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}>
                    <SearchField
                        fullWidth
                        variant="outlined"
                        placeholder="Поиск курсов по названию, группе или преподавателю..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        }}
                    />

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 2,
                    }}>
                        <Button
                            startIcon={<FilterListIcon />}
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                color: showFilters ? 'primary.main' : 'text.secondary',
                            }}
                        >
                            Фильтры
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SortIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                Сортировка:
                            </Typography>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                variant="standard"
                                disableUnderline
                                sx={{
                                    fontWeight: 500,
                                    '& .MuiSelect-select': { paddingRight: '24px' }
                                }}
                            >
                                <MenuItem value="subject">По названию</MenuItem>
                                <MenuItem value="group">По группе</MenuItem>
                                <MenuItem value="instructor">По преподавателю</MenuItem>
                            </Select>
                        </Box>
                    </Box>

                    {showFilters && (
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Группа</InputLabel>
                                    <Select
                                        value={filterByGroup}
                                        onChange={(e) => setFilterByGroup(e.target.value)}
                                        label="Группа"
                                        startAdornment={<GroupsIcon color="action" sx={{ mr: 1 }} />}
                                    >
                                        <MenuItem value="">Все группы</MenuItem>
                                        {uniqueGroups.map((group) => (
                                            <MenuItem key={group} value={group}>
                                                {group}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Преподаватель</InputLabel>
                                    <Select
                                        value={filterByInstructor}
                                        onChange={(e) => setFilterByInstructor(e.target.value)}
                                        label="Преподаватель"
                                        startAdornment={<PersonIcon color="action" sx={{ mr: 1 }} />}
                                    >
                                        <MenuItem value="">Все преподаватели</MenuItem>
                                        {uniqueInstructors.map((instructor) => (
                                            <MenuItem key={instructor} value={instructor}>
                                                {instructor}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </Paper>

                {/* Активные фильтры */}
                {(filterByGroup || filterByInstructor) && (
                    <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {filterByGroup && (
                            <Chip
                                label={`Группа: ${filterByGroup}`}
                                onDelete={() => setFilterByGroup('')}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        )}
                        {filterByInstructor && (
                            <Chip
                                label={`Преподаватель: ${filterByInstructor}`}
                                onDelete={() => setFilterByInstructor('')}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        )}
                    </Box>
                )}

                {/* Список курсов */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress color="primary" size={60} thickness={4} />
                    </Box>
                ) : filteredCourses.length === 0 ? (
                    <Paper sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}>
                        <SearchIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Ничего не найдено
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Попробуйте изменить параметры поиска или фильтры
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredCourses.map((course) => (
                            <Grid item key={course.id}>
                                <StyledBadge
                                    badgeContent="Новый"
                                    invisible={!course.isNew}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <GradientCard>
                                        <CardActionArea onClick={() => navigate(`/assignments/${course.id}`)}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    gap: 1.5
                                                }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: 'primary.main',
                                                            width: 40,
                                                            height: 40
                                                        }}
                                                    >
                                                        {course.subject.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" component="h3" sx={{
                                                            fontWeight: 700,
                                                            lineHeight: 1.3
                                                        }}>
                                                            {course.subject.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {course.instructor.fullName}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    mb: 2,
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <Chip
                                                        label={course.group.name}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ borderRadius: 1 }}
                                                    />
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'text.secondary'
                                                    }}>
                                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                        <Typography variant="caption">
                                                            {course.lessonsCount} занятий
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Divider sx={{
                                                    my: 2,
                                                    borderColor: alpha(theme.palette.primary.main, 0.1)
                                                }} />

                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        borderWidth: 1.5,
                                                        '&:hover': {
                                                            borderWidth: 1.5,
                                                        }
                                                    }}
                                                >
                                                    Подробнее о курсе
                                                </Button>
                                            </CardContent>
                                        </CardActionArea>
                                    </GradientCard>
                                </StyledBadge>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </ThemeProvider>
    );
};

export default Main;