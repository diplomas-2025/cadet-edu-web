import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    CircularProgress,
    Radio,
    RadioGroup,
    FormControlLabel,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    IconButton, Grid
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { getTestQuestions, submitTest } from '../data/Api';
import {
    Quiz as QuizIcon,
    CheckCircle as CheckIcon,
    ArrowBack as BackIcon,
    Timer as TimerIcon,
    Help as HelpIcon,
    Close as CloseIcon
} from '@mui/icons-material';

// Тема приложения
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
            paper: '#ffffff',
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
        body1: {
            fontSize: '1rem',
        },
    },
    shape: {
        borderRadius: 12,
    },
});

// Стилизованные компоненты
const QuestionCard = styled(Card)(({ theme }) => ({
    transition: 'all 0.3s ease',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const AnswerOption = styled(FormControlLabel)(({ theme }) => ({
    margin: 0,
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.light,
    },
}));

const TestScreen = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 минут в секундах
    const [showConfirm, setShowConfirm] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    // Загрузка вопросов теста
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await getTestQuestions(testId);
                setQuestions(response.data);
                // Инициализируем массив отвеченных вопросов
                setAnsweredQuestions(new Array(response.data.length).fill(false));
            } catch (err) {
                setError('Не удалось загрузить вопросы теста');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [testId]);

    // Таймер теста
    useEffect(() => {
        if (timeLeft <= 0 || result) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, result]);

    // Обработка выбора ответа
    const handleAnswerChange = (questionId, answerId) => {
        const newAnswers = {
            ...answers,
            [questionId]: answerId,
        };
        setAnswers(newAnswers);

        // Отмечаем вопрос как отвеченный
        const newAnswered = [...answeredQuestions];
        newAnswered[currentQuestion] = true;
        setAnsweredQuestions(newAnswered);
    };

    // Навигация по вопросам
    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // Отправка ответов на сервер
    const handleSubmitTest = async () => {
        try {
            const formattedAnswers = Object.keys(answers).map((questionId) => ({
                questionId: parseInt(questionId),
                answerId: answers[questionId],
            }));

            const response = await submitTest(testId, { answers: formattedAnswers });
            setResult(response);
        } catch (err) {
            setError('Ошибка при отправке ответов');
        } finally {
            setShowConfirm(false);
        }
    };

    // Форматирование времени
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (result) {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Avatar sx={{
                                bgcolor: result.score >= 70 ? 'success.main' : 'secondary.main',
                                width: 80,
                                height: 80,
                                margin: '0 auto 20px'
                            }}>
                                <Typography variant="h4" component="div">
                                    {result.score}%
                                </Typography>
                            </Avatar>

                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                                {result.score >= 70 ? 'Тест пройден!' : 'Тест не пройден'}
                            </Typography>

                            <Typography variant="body1" color="textSecondary" paragraph>
                                Вы завершили тест "{result.test.title}" с результатом {result.score}%
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                mt: 4
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<BackIcon />}
                                    onClick={() => navigate(`/course/${result.test.courseId}`)}
                                    size="large"
                                >
                                    Вернуться к курсу
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                        Детали результатов
                    </Typography>

                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Статистика
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Проходной балл:</Typography>
                                    <Typography fontWeight="bold">70%</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>Время прохождения:</Typography>
                                    <Typography fontWeight="bold">
                                        {formatTime(1800 - timeLeft)}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                {/* Шапка теста */}
                <Paper sx={{
                    p: 3,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <QuizIcon />
                            </Avatar>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                Тестирование
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                                icon={<TimerIcon />}
                                label={formatTime(timeLeft)}
                                color={timeLeft < 300 ? 'secondary' : 'primary'}
                                variant="outlined"
                            />
                            <Chip
                                label={`${currentQuestion + 1}/${questions.length}`}
                                color="primary"
                            />
                        </Box>
                    </Box>

                    {/* Прогресс-бар таймера */}
                    <LinearProgress
                        variant="determinate"
                        value={(timeLeft / 1800) * 100}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 4
                        }}
                    />
                </Paper>

                {/* Степпер вопросов */}
                <Stepper
                    activeStep={currentQuestion}
                    alternativeLabel
                    sx={{ mb: 4, p: 2, backgroundColor: 'transparent' }}
                >
                    {questions.map((question, index) => (
                        <Step key={question.id}>
                            <StepLabel
                                onClick={() => setCurrentQuestion(index)}
                                sx={{ cursor: 'pointer' }}
                                StepIconComponent={() => (
                                    <Avatar sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: answeredQuestions[index] ? 'primary.main' : 'action.disabledBackground',
                                        color: answeredQuestions[index] ? 'primary.contrastText' : 'text.secondary'
                                    }}>
                                        {index + 1}
                                    </Avatar>
                                )}
                            />
                        </Step>
                    ))}
                </Stepper>

                {/* Текущий вопрос */}
                {questions.length > 0 && (
                    <QuestionCard>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                                <Box component="span" color="primary.main">Вопрос {currentQuestion + 1}: </Box>
                                {questions[currentQuestion].text}
                            </Typography>

                            <RadioGroup
                                value={answers[questions[currentQuestion].id] || ''}
                                onChange={(e) => handleAnswerChange(
                                    questions[currentQuestion].id,
                                    parseInt(e.target.value)
                                )}
                            >
                                {questions[currentQuestion].answers.map((answer) => (
                                    <AnswerOption
                                        key={answer.id}
                                        value={answer.id}
                                        control={<Radio color="primary" />}
                                        label={answer.text}
                                        sx={{
                                            mb: 1,
                                            ...(answers[questions[currentQuestion].id] === answer.id && {
                                                backgroundColor: 'primary.light',
                                                color: 'primary.contrastText',
                                            })
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </QuestionCard>
                )}

                {/* Навигация по вопросам */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 4,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<BackIcon />}
                        onClick={handlePrevQuestion}
                        disabled={currentQuestion === 0}
                    >
                        Предыдущий вопрос
                    </Button>

                    {currentQuestion < questions.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<CheckIcon />}
                            onClick={handleNextQuestion}
                        >
                            Следующий вопрос
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="secondary"
                            endIcon={<CheckIcon />}
                            onClick={() => setShowConfirm(true)}
                            disabled={Object.keys(answers).length !== questions.length}
                        >
                            Завершить тест
                        </Button>
                    )}
                </Box>

                {/* Диалог подтверждения отправки */}
                <Dialog
                    open={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            p: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                        <HelpIcon color="primary" sx={{ mr: 2 }} />
                        <Typography variant="h6" component="div">
                            Подтверждение отправки
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={() => setShowConfirm(false)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent>
                        <Typography>
                            Вы уверены, что хотите завершить тест? После отправки изменить ответы будет невозможно.
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimerIcon color="secondary" />
                            <Typography variant="body2" color="textSecondary">
                                Оставшееся время: {formatTime(timeLeft)}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QuizIcon color="secondary" />
                            <Typography variant="body2" color="textSecondary">
                                Отвечено: {Object.keys(answers).length}/{questions.length} вопросов
                            </Typography>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => setShowConfirm(false)}
                            variant="outlined"
                            color="primary"
                        >
                            Вернуться к тесту
                        </Button>
                        <Button
                            onClick={handleSubmitTest}
                            variant="contained"
                            color="secondary"
                            autoFocus
                        >
                            Подтвердить отправку
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default TestScreen;