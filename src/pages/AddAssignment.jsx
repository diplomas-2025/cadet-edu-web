import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    Stack,
    Fade,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAllSubjects, getAllGroups, createCourse } from '../data/Api';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';

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

const AddAssignmentScreen = () => {
    const [subjects, setSubjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectsResponse = await getAllSubjects();
                const groupsResponse = await getAllGroups();
                setSubjects(subjectsResponse.data);
                setGroups(groupsResponse.data);
            } catch {
                setError('Ошибка при загрузке данных');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubjectId || !selectedGroupId) {
            setError('Пожалуйста, выберите предмет и группу');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await createCourse({
                subjectId: parseInt(selectedSubjectId),
                groupId: parseInt(selectedGroupId),
            });
            alert('Предмет успешно добавлен!');
            setSelectedSubjectId('');
            setSelectedGroupId('');
        } catch {
            setError('Ошибка при добавлении предмета');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Добавить курс
                </Typography>

                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: '24px',
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
                        transition: '0.3s',
                        '&:hover': {
                            boxShadow: '0px 12px 28px rgba(0, 0, 0, 0.12)',
                        },
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            {/* Предмет */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="subject-label">
                                    <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Предмет
                                </InputLabel>
                                <Select
                                    labelId="subject-label"
                                    value={selectedSubjectId}
                                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                                    label="Предмет"
                                    required
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Группа */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="group-label">
                                    <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Группа
                                </InputLabel>
                                <Select
                                    labelId="group-label"
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                    label="Группа"
                                    required
                                >
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group.id}>
                                            {group.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Кнопка */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                {loading ? 'Добавление...' : 'Добавить'}
                            </Button>

                            {/* Ошибка */}
                            <Fade in={!!error}>
                                <Typography color="error" align="center" fontSize="0.95rem">
                                    {error}
                                </Typography>
                            </Fade>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default AddAssignmentScreen;
