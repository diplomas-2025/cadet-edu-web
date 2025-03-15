import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getTestQuestions, submitTest } from '../data/Api';

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

const TestScreen = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: answerId }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Загрузка вопросов теста
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getTestQuestions(testId);
                setQuestions(response.data);
            } catch (err) {
                setError('Ошибка при загрузке вопросов теста');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [testId]);

    // Обработка выбора ответа
    const handleAnswerChange = (questionId, answerId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    // Отправка ответов на сервер
    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.keys(answers).map((questionId) => ({
                questionId: parseInt(questionId),
                answerId: answers[questionId],
            }));
            const result = await submitTest(testId, { answers: formattedAnswers });
            setResult(result);
        } catch (err) {
            setError('Ошибка при отправке ответов');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" mt={4}>
                {error}
            </Typography>
        );
    }

    if (result) {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                        Результат теста
                    </Typography>
                    <Paper elevation={6} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                            Тест: {result.test.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: '#333' }}>
                            Пользователь: {result.user.fullName}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: '#333' }}>
                            Оценка: {result.score}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/course/${result.test.courseId}`)}
                            sx={{ mt: 2, borderRadius: '8px', fontWeight: 'bold' }}
                        >
                            Вернуться
                        </Button>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Прохождение теста
                </Typography>
                <List>
                    {questions.map((question) => (
                        <Paper
                            key={question.id}
                            elevation={6}
                            sx={{ mb: 3, p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}
                        >
                            <ListItem>
                                <ListItemText
                                    primary={question.text}
                                    primaryTypographyProps={{ fontWeight: 'bold', color: '#6a1b9a' }}
                                />
                            </ListItem>
                            <RadioGroup
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                            >
                                {question.answers.map((answer) => (
                                    <FormControlLabel
                                        key={answer.id}
                                        value={answer.id}
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="body1" sx={{ color: '#333' }}>
                                                {answer.text}
                                            </Typography>
                                        }
                                    />
                                ))}
                            </RadioGroup>
                        </Paper>
                    ))}
                </List>
                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== questions.length}
                        sx={{ borderRadius: '8px', fontWeight: 'bold', padding: '12px 24px' }}
                    >
                        Завершить тест
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default TestScreen;