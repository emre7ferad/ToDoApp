import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals } from '../store/goalsSlice';
import { fetchTasks } from '../store/tasksSlice';
import type { RootState, AppDispatch } from '../store/store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export const Goals = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { items: goals, loading: goalsLoading } = useSelector((state: RootState) => state.goals);
    const { items: tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);

    const [sortBy, setSortBy] = useState('newest');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    useEffect(() => {
        dispatch(fetchGoals());
        dispatch(fetchTasks()); 
    }, [dispatch]);

    const processedGoals = useMemo(() => {
        let result = [...goals];

        if (filterStartDate) {
            result = result.filter(g => g.start_date && g.start_date >= filterStartDate);
        }
        if (filterEndDate) {
            result = result.filter(g => g.end_date && g.end_date <= filterEndDate);
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'start_asc':
                    return (a.start_date || '').localeCompare(b.start_date || '');
                case 'start_desc':
                    return (b.start_date || '').localeCompare(a.start_date || '');
                case 'end_asc':
                    return (a.end_date || '').localeCompare(b.end_date || '');
                case 'end_desc':
                    return (b.end_date || '').localeCompare(a.end_date || '');
                case 'newest':
                    return b.id - a.id; 
                case 'oldest':
                    return a.id - b.id;
                default:
                    return 0;
            }
        });

        return result;
    }, [goals, sortBy, filterStartDate, filterEndDate]);

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    if (goalsLoading || tasksLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ p: 4, backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
            
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Your Goals
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Track your progress across different categories.
                </Typography>
            </Box>

            {/* Filter & Sort Bar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }} elevation={0}>
                {/* Sort Dropdown */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                        <MenuItem value="newest">Newest Created</MenuItem>
                        <MenuItem value="oldest">Oldest Created</MenuItem>
                        <MenuItem value="start_asc">Start Date (Earliest First)</MenuItem>
                        <MenuItem value="start_desc">Start Date (Latest First)</MenuItem>
                        <MenuItem value="end_asc">End Date (Earliest First)</MenuItem>
                        <MenuItem value="end_desc">End Date (Latest First)</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ flexGrow: 1 }} />

                {/* Date Filters */}
                <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>Filter:</Typography>
                <TextField
                    label="From Start Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                />
                <TextField
                    label="To End Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                />
            </Paper>

            {/* Goals Table */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="goals table">
                    <TableHead sx={{ backgroundColor: '#F8F9FA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Goal Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Linked Tasks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processedGoals.length > 0 ? (
                            processedGoals.map((goal) => {
                                const linkedTaskCount = tasks.filter(t => t.goal_id === goal.id).length;

                                return (
                                    <TableRow key={goal.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                            {goal.title}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {goal.description || "No description provided."}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                                <CalendarTodayIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {goal.start_date || 'No information'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                                <CalendarTodayIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {goal.end_date || 'No information'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ 
                                                display: 'inline-block', 
                                                p: 0.5, 
                                                px: 1.5, 
                                                borderRadius: 1, 
                                                backgroundColor: '#f0f0f0', 
                                                fontSize: '0.875rem', 
                                                color: '#555',
                                                fontWeight: 500
                                            }}>
                                                {linkedTaskCount} tasks
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No goals found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};