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
} from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon, DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import {createTest} from "../data/Api";

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

    // Обработчик изменения названия теста
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // Обработчик изменения текста вопроса
    const handleQuestionTextChange = (index, e) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = e.target.value;
        setQuestions(newQuestions);
    };

    // Обработчик изменения текста ответа
    const handleAnswerTextChange = (questionIndex, answerIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].answerText = e.target.value;
        setQuestions(newQuestions);
    };

    // Обработчик изменения правильного ответа
    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.forEach((answer, idx) => {
            answer.isCorrect = idx === answerIndex;
        });
        setQuestions(newQuestions);
    };

    // Добавление нового вопроса
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                answers: [{ answerText: '', isCorrect: false }],
            },
        ]);
    };

    // Добавление нового ответа к вопросу
    const addAnswer = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.push({ answerText: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    // Удаление ответа
    const removeAnswer = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.splice(answerIndex, 1);
        setQuestions(newQuestions);
    };

    // Удаление вопроса
    const removeQuestion = (questionIndex) => {
        const newQuestions = questions.filter((_, idx) => idx !== questionIndex);
        setQuestions(newQuestions);
    };

    // Отправка формы
    const handleSubmit = (e) => {
        e.preventDefault();
        createTest(assignmentId, title, questions).then(() => {
            navigate('/assignments/' + assignmentId);
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Добавление теста к курсу
                </Typography>

                <Paper elevation={6} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Название теста"
                            value={title}
                            onChange={handleTitleChange}
                            sx={{ mb: 3 }}
                        />

                        {questions.map((question, questionIndex) => (
                            <Card key={questionIndex} sx={{ mb: 3, borderRadius: '8px', boxShadow: 3 }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={10}>
                                            <TextField
                                                fullWidth
                                                label={`Вопрос ${questionIndex + 1}`}
                                                value={question.questionText}
                                                onChange={(e) => handleQuestionTextChange(questionIndex, e)}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeQuestion(questionIndex)}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>

                                    {question.answers.map((answer, answerIndex) => (
                                        <Grid container spacing={2} alignItems="center" key={answerIndex} sx={{ mt: 2 }}>
                                            <Grid item xs={8}>
                                                <TextField
                                                    fullWidth
                                                    label={`Ответ ${answerIndex + 1}`}
                                                    value={answer.answerText}
                                                    onChange={(e) => handleAnswerTextChange(questionIndex, answerIndex, e)}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={answer.isCorrect}
                                                            onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Правильный"
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeAnswer(questionIndex, answerIndex)}
                                                >
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}

                                    <Button
                                        variant="outlined"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => addAnswer(questionIndex)}
                                        sx={{ mt: 2, borderRadius: '8px' }}
                                    >
                                        Добавить ответ
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={addQuestion}
                            sx={{ mb: 3, borderRadius: '8px', fontWeight: 'bold' }}
                        >
                            Добавить вопрос
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ borderRadius: '8px', fontWeight: 'bold', padding: '12px' }}
                        >
                            Сохранить тест
                        </Button>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default AddTestScreen;