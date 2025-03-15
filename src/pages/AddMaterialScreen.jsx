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
import {addMaterials} from "../data/Api";

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

const AddMaterialScreen = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !fileUrl) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await addMaterials(assignmentId, { title, fileUrl });
            alert('Материал успешно добавлен!');
            navigate(`/assignments/${assignmentId}`);
        } catch (err) {
            setError('Ошибка при добавлении материала');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                    Добавить материал
                </Typography>
                <Paper elevation={6} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Название материала"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Ссылка на файл"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
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
                            sx={{ borderRadius: '8px', fontWeight: 'bold', padding: '12px' }}
                        >
                            Добавить
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default AddMaterialScreen;