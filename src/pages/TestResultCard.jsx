import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Chip,
    Divider,
    Button,
    Container,
    Box,
    Paper,
    Tabs,
    Tab,
    LinearProgress,
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material';
import {
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    ArrowForward as ArrowForwardIcon,
    BarChart as StatsIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
    Close as CloseIcon,
    MilitaryTech as RankIcon,
    School as CourseIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getTestResultsByAssignmentId,
} from '../data/Api';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

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
        warning: {
            main: '#ed6c02',
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
const ResultCard = styled(Card)(({ theme }) => ({
    transition: 'all 0.3s ease',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
    },
}));

const ScoreBadge = styled(Chip)(({ score, theme }) => ({
    fontWeight: 'bold',
    backgroundColor: score >= 80 ? theme.palette.success.light :
        score >= 60 ? theme.palette.warning.light :
            theme.palette.secondary.light,
    color: score >= 80 ? theme.palette.success.dark :
        score >= 60 ? theme.palette.warning.dark :
            theme.palette.secondary.dark,
}));

const TestResultsList = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [filter, setFilter] = useState('all');
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState('pdf');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [results] = await Promise.all([
                    getTestResultsByAssignmentId(assignmentId),
                ]);
                setTestResults(results.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [assignmentId]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const filteredResults = testResults.filter(result => {
        if (filter === 'passed') return result.score >= 70;
        if (filter === 'failed') return result.score < 70;
        return true;
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Заголовок и статистика */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <RankIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                            Результаты тестирования
                        </Typography>
                    </Box>
                </Box>

                {/* Фильтры и табы */}
                <Paper sx={{ mb: 3, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Все результаты" />
                    </Tabs>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterIcon color="action" />
                        <Chip
                            label="Все"
                            variant={filter === 'all' ? 'filled' : 'outlined'}
                            onClick={() => setFilter('all')}
                            color="primary"
                        />
                        <Chip
                            label="Сдали"
                            variant={filter === 'passed' ? 'filled' : 'outlined'}
                            onClick={() => setFilter('passed')}
                            color="success"
                        />
                        <Chip
                            label="Не сдали"
                            variant={filter === 'failed' ? 'filled' : 'outlined'}
                            onClick={() => setFilter('failed')}
                            color="secondary"
                        />
                    </Box>
                </Paper>

                {/* Содержимое табов */}
                {activeTab === 0 ? (
                    <Grid container spacing={3}>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((result) => (
                                <Grid item xs={12} key={result.id}>
                                    <TestResultCard result={result} />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="body1" color="textSecondary">
                                        Нет результатов, соответствующих выбранному фильтру
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                ) : (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Детализированные результаты
                        </Typography>
                        <List>
                            {filteredResults.map((result) => (
                                <ListItem key={result.id} divider>
                                    <ListItemAvatar>
                                        <Avatar src={result.user.avatarUrl}>
                                            {result.user.fullName.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={result.user.fullName}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {result.test.title}
                                                </Typography>
                                                {` — ${new Date(result.createdAt).toLocaleDateString()}`}
                                            </>
                                        }
                                    />
                                    <ScoreBadge
                                        score={result.score}
                                        label={`${result.score}%`}
                                        size="medium"
                                    />
                                    <IconButton onClick={() => navigate(`/test-result/${result.id}`)}>
                                        <ArrowForwardIcon color="primary" />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}

                {/* Диалог экспорта */}
                <Dialog
                    open={exportDialogOpen}
                    onClose={() => setExportDialogOpen(false)}
                    maxWidth="xs"
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">Экспорт результатов</Typography>
                            <IconButton onClick={() => setExportDialogOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" gutterBottom>
                            Выберите формат для экспорта:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                variant={exportFormat === 'pdf' ? 'contained' : 'outlined'}
                                onClick={() => setExportFormat('pdf')}
                                fullWidth
                            >
                                PDF
                            </Button>
                            <Button
                                variant={exportFormat === 'excel' ? 'contained' : 'outlined'}
                                onClick={() => setExportFormat('excel')}
                                fullWidth
                            >
                                Excel
                            </Button>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setExportDialogOpen(false)}>Отмена</Button>

                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

const TestResultCard = ({ result }) => {
    const { user, test, score, createdAt } = result;
    const navigate = useNavigate();

    return (
        <ResultCard>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar src={user.avatarUrl} sx={{ width: 56, height: 56 }}>
                            {user.fullName.charAt(0)}
                        </Avatar>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {user.fullName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user.email}
                        </Typography>
                        <Chip
                            label={user.role === 'INSTRUCTOR' ? 'Преподаватель' : 'Студент'}
                            size="small"
                            color={user.role === 'INSTRUCTOR' ? 'primary' : 'default'}
                            sx={{ mt: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CourseIcon color="action" />
                            <Typography variant="body2">
                                {test.title}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2} sx={{ textAlign: 'center' }}>
                        <ScoreBadge
                            score={score}
                            label={`${score}%`}
                            size="medium"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'right' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate(`/assignments/${result.test.assignmentId}`)}
                            sx={{ borderRadius: 2 }}
                        >
                            Подробнее
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </ResultCard>
    );
};

export default TestResultsList;