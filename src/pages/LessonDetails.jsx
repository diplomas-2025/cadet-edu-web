import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getLessonById } from '../data/Api';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a3e72',
        },
        secondary: {
            main: '#ffab40',
        },
        background: {
            default: '#f8f9fa',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h4: {
            fontWeight: 700,
        },
    },
});

export const LessonDetails = () => {
    const { lessonId } = useParams();
    const [lessonData, setLessonData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLessonById(lessonId)
            .then((response) => {
                setLessonData(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [lessonId]);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 6 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={6}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : lessonData ? (
                    <>
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{ fontWeight: 'bold', color: 'primary.main' }}
                        >
                            {lessonData.title}
                        </Typography>

                        <Paper
                            elevation={6}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                mt: 4,
                                borderRadius: 4,
                                backgroundColor: '#f5f5f5',
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <Box
                                sx={{
                                    fontSize: '1rem',
                                    color: '#333',
                                    lineHeight: 1.7,
                                    '& h1, h2, h3, h4': {
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        marginTop: 2,
                                    },
                                    '& p': {
                                        marginTop: 1,
                                        marginBottom: 1,
                                    },
                                    '& ul': {
                                        paddingLeft: '1.5rem',
                                        marginTop: 1,
                                    },
                                    '& li': {
                                        marginBottom: '0.5rem',
                                    },
                                }}
                                dangerouslySetInnerHTML={{ __html: lessonData.content }}
                            />
                        </Paper>
                    </>
                ) : (
                    <Typography color="error" align="center">
                        Не удалось загрузить лекцию
                    </Typography>
                )}
            </Container>
        </ThemeProvider>
    );
};
