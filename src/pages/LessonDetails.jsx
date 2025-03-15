import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {getLessonById} from "../data/Api";

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

export const LessonDetails = () => {
    const { lessonId } = useParams();
    const [lessonData, setLessonData] = useState(null);

    // Загрузка данных (замените на реальный запрос к API)
    useEffect(() => {
        // Здесь должен быть запрос к API для получения данных по lessonId
        // Например:
        // fetchLessonDetails(lessonId).then(data => setLessonData(data));

        // Используем пример данных
        getLessonById(lessonId).then((response) => {
            setLessonData(response.data);
        });
    }, [lessonId]);

    if (!lessonData) {
        return <Typography>Загрузка...</Typography>;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4 }}>
                    {lessonData.title}
                </Typography>

                {/* Контент урока */}
                <Paper elevation={6} sx={{ p: 3, mt: 2, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Box
                        sx={{
                            '& h2': { fontSize: '1.5rem', fontWeight: 'bold', color: '#6a1b9a', mt: 2 },
                            '& h3': { fontSize: '1.25rem', fontWeight: 'bold', color: '#6a1b9a', mt: 2 },
                            '& p': { fontSize: '1rem', color: '#333', mt: 1 },
                            '& ul': { pl: 2, mt: 1 },
                            '& li': { fontSize: '1rem', color: '#333' },
                        }}
                        dangerouslySetInnerHTML={{ __html: lessonData.content }}
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
};