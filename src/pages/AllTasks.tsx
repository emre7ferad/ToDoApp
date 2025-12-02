import { useState, useEffect } from 'react';
// 1. Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/tasksSlice';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';

export const AllTasks = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // 2. Select Real Data from Redux
    const { items: tasks, loading, error } = useSelector((state: RootState) => state.tasks);

    // Local UI state for filters
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // 3. Fetch Data on Mount
    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatusFilter(event.target.value as string);
    };

    const handlePriorityChange = (event: SelectChangeEvent) => {
        setPriorityFilter(event.target.value as string);
    };

    const getPriorityColor = (priority: string) => {
        // Safe check with optional chaining
        switch (priority?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    // 4. Handle Loading & Error States
    if (loading) {
        return (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, mt: 5 }}>
                <CircularProgress />
             </Box>
        );
    }

    if (error) {
        return <Box sx={{ p: 4, color: 'error.main' }}>Error loading tasks: {error}</Box>;
    }

    return (
        <Box sx={{ p: 4, backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
            
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                    All Tasks
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    New Task
                </Button>
            </Box>

            {/* Filters Bar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }} elevation={0}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} label="Status" onChange={handleStatusChange}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="To Do">To Do</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select value={priorityFilter} label="Priority" onChange={handlePriorityChange}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ flexGrow: 1 }} />

                <TextField
                    size="small"
                    placeholder="Search"
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
                    }}
                    sx={{ width: 300 }}
                />
            </Paper>

            {/* Data Table */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="tasks table">
                    <TableHead sx={{ backgroundColor: '#F8F9FA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Linked Goal</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 5. Render Real Data */}
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TableRow key={task.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                        {task.title}
                                    </TableCell>
                                    <TableCell>{task.due_date || 'No Date'}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={task.priority} 
                                            color={getPriorityColor(task.priority) as any} 
                                            size="small" 
                                            variant="filled"
                                            sx={{ fontWeight: 'bold', minWidth: '70px' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'inline-block', p: 0.5, px: 1.5, borderRadius: 1, backgroundColor: '#f0f0f0', fontSize: '0.875rem', color: '#555' }}>
                                            {task.status}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {/* Display Goal Title if available */}
                                        {task.goals?.title || <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>No Goal</Typography>}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No tasks found. Click "New Task" to create one.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};