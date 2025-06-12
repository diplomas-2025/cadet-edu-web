import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createLesson } from '../data/Api';

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

const AddLessonScreen = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await createLesson({ title, content, assignmentId });
            alert('Лекция успешно добавлена!');
            navigate(`/assignments/${assignmentId}`);
        } catch (err) {
            setError('Ошибка при добавлении лекции');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                    Добавление лекции
                </Typography>

                <Paper
                    elevation={6}
                    sx={{
                        mt: 4,
                        p: { xs: 3, sm: 4 },
                        borderRadius: 4,
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                    >
                        <TextField
                            fullWidth
                            label="Название лекции"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="outlined"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Содержание лекции"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            rows={6}
                            variant="outlined"
                            required
                        />

                        {error && (
                            <Typography color="error" align="center">
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                mt: 1,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                py: 1.5,
                            }}
                        >
                            Добавить лекцию
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default AddLessonScreen;
