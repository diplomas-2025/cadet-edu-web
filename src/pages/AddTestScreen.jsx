import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Box,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    CircularProgress, ListItemText, ListItem, List
} from '@mui/material';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    DeleteOutline as DeleteOutlineIcon,
    CheckCircle as CheckIcon,
    HelpOutline as HelpIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    ArrowBack as BackIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { createTest } from "../data/Api";

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

// Стилизованные компоненты
const QuestionCard = styled(Card)(({ theme }) => ({
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: theme.shadows[6],
    },
}));

const AnswerItem = styled(Box)(({ iscorrect, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: iscorrect === 'true' ? theme.palette.success.light : 'transparent',
    border: iscorrect === 'true' ? `1px solid ${theme.palette.success.main}` : '1px solid rgba(0,0,0,0.12)',
    marginBottom: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: iscorrect === 'true' ? theme.palette.success.light : theme.palette.action.hover,
    },
}));

const AddTestScreen = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            answers: [{ answerText: '', isCorrect: false }],
        },
    ]);
    const [activeStep, setActiveStep] = useState(0);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const steps = ['Основная информация', 'Создание вопросов', 'Просмотр и сохранение'];

    // Обработчики изменений
    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleQuestionTextChange = (index, e) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = e.target.value;
        setQuestions(newQuestions);
    };

    const handleAnswerTextChange = (questionIndex, answerIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].answerText = e.target.value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.forEach((answer, idx) => {
            answer.isCorrect = idx === answerIndex;
        });
        setQuestions(newQuestions);
    };

    // Управление вопросами и ответами
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                answers: [{ answerText: '', isCorrect: false }],
            },
        ]);
    };

    const addAnswer = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.push({ answerText: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    const removeAnswer = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.splice(answerIndex, 1);
        setQuestions(newQuestions);
    };

    const removeQuestion = (questionIndex) => {
        const newQuestions = questions.filter((_, idx) => idx !== questionIndex);
        setQuestions(newQuestions);
    };

    // Навигация по шагам
    const handleNext = () => {
        if (activeStep === 0 && (!title)) {
            setError('Заполните все обязательные поля');
            return;
        }
        setError('');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setError('');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Отправка формы
    const handleSubmit = async () => {
        try {
            setLoading(true);
            await createTest(assignmentId, title, questions);
            navigate(`/assignments/${assignmentId}`);
        } catch (err) {
            setError('Ошибка при сохранении теста');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Проверка валидности формы
    const isFormValid = () => {
        if (!title) return false;
        if (questions.some(q => !q.questionText || q.answers.length < 2 || q.answers.some(a => !a.answerText))) return false;
        if (questions.some(q => !q.answers.some(a => a.isCorrect))) return false;
        return true;
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <BackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        Создание нового теста
                    </Typography>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Paper elevation={0} sx={{
                        p: 2,
                        mb: 3,
                        backgroundColor: 'error.light',
                        color: 'error.contrastText'
                    }}>
                        <Typography>{error}</Typography>
                    </Paper>
                )}

                {activeStep === 0 && (
                    <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            Основные параметры теста
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Название теста"
                                    value={title}
                                    onChange={handleTitleChange}
                                    required
                                    sx={{ mb: 3 }}
                                />

                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {activeStep === 1 && (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            Вопросы теста ({questions.length})
                        </Typography>

                        {questions.map((question, questionIndex) => (
                            <QuestionCard key={questionIndex} sx={{ mb: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Вопрос {questionIndex + 1}
                                        </Typography>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeQuestion(questionIndex)}
                                            disabled={questions.length <= 1}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Box>

                                    <TextField
                                        fullWidth
                                        label="Текст вопроса"
                                        value={question.questionText}
                                        onChange={(e) => handleQuestionTextChange(questionIndex, e)}
                                        required
                                        sx={{ mb: 3 }}
                                    />

                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Варианты ответов:
                                    </Typography>

                                    {question.answers.map((answer, answerIndex) => (
                                        <AnswerItem
                                            key={answerIndex}
                                            iscorrect={answer.isCorrect.toString()}
                                        >
                                            <Checkbox
                                                checked={answer.isCorrect}
                                                onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                                                color="primary"
                                                sx={{ mr: 1 }}
                                            />
                                            <TextField
                                                fullWidth
                                                variant="standard"
                                                placeholder={`Ответ ${answerIndex + 1}`}
                                                value={answer.answerText}
                                                onChange={(e) => handleAnswerTextChange(questionIndex, answerIndex, e)}
                                                required
                                            />
                                            <IconButton
                                                onClick={() => removeAnswer(questionIndex, answerIndex)}
                                                disabled={question.answers.length <= 1}
                                                sx={{ ml: 1 }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </AnswerItem>
                                    ))}

                                    <Button
                                        variant="outlined"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => addAnswer(questionIndex)}
                                        sx={{ mt: 2 }}
                                        disabled={question.answers.length >= 5}
                                    >
                                        Добавить вариант ответа
                                    </Button>
                                </CardContent>
                            </QuestionCard>
                        ))}

                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={addQuestion}
                            sx={{ mb: 3 }}
                            disabled={questions.length >= 20}
                        >
                            Добавить вопрос
                        </Button>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            Просмотр теста перед сохранением
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Основная информация
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="textSecondary">Название:</Typography>
                                    <Typography variant="body1">{title}</Typography>
                                </Box>

                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Параметры тестирования
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="textSecondary">Количество вопросов:</Typography>
                                    <Typography variant="body1">{questions.length}</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Вопросы
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {questions.length > 0 ? (
                            <Box>
                                { questions.map((question) => (
                                    <>
                                        <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                                            {question.questionText}
                                        </Typography>

                                        {question.answers.map((answer, idx) => (
                                            <Box key={idx} sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 1,
                                                p: 1,
                                                backgroundColor: answer.isCorrect ? 'success.light' : 'transparent',
                                                borderRadius: 1
                                            }}>
                                                <Checkbox
                                                    checked={answer.isCorrect}
                                                    disabled
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Typography>{answer.answerText}</Typography>
                                            </Box>
                                        ))}
                                    </>
                                ))}

                            </Box>
                        ) : (
                            <Typography color="textSecondary">Нет вопросов</Typography>
                        )}
                    </Paper>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={activeStep === 0 ? () => navigate(-1) : handleBack}
                        disabled={activeStep === 0}
                        startIcon={<BackIcon />}
                    >
                        Назад
                    </Button>

                    {activeStep < steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={
                                activeStep === 0 && (!title) ||
                                activeStep === 1 && questions.some(q => !q.questionText || q.answers.length < 2 || q.answers.some(a => !a.answerText))
                            }
                        >
                            Продолжить
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => setConfirmDialogOpen(true)}
                            disabled={!isFormValid()}
                            startIcon={<SaveIcon />}
                        >
                            Сохранить тест
                        </Button>
                    )}
                </Box>

                {/* Диалог подтверждения */}
                <Dialog
                    open={confirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center">
                            <CheckIcon color="primary" sx={{ mr: 2 }} />
                            <Typography variant="h6">Подтверждение создания теста</Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Вы уверены, что хотите создать тест со следующими параметрами?
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="Название" secondary={title} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Количество вопросов" secondary={questions.length} />
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)} startIcon={<CloseIcon />}>
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="success"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            disabled={loading}
                        >
                            Подтвердить
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default AddTestScreen;