import { useState, useEffect } from 'react';
// 1. Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask } from '../store/tasksSlice'; // Import addTask
import { fetchGoals } from '../store/goalsSlice'; // Import fetchGoals for the dropdown
import type { RootState, AppDispatch } from '../store/store';

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
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export const AllTasks = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { items: tasks, loading, error } = useSelector((state: RootState) => state.tasks);
    const { items: goals } = useSelector((state: RootState) => state.goals);

    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: '',
        status: '',
        goal_id: ''
    });

    const [formErrors, setFormErrors] = useState({
        title: false,
        priority: false,
        goal_id: false
    });

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchGoals());
    }, [dispatch]);

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatusFilter(event.target.value as string);
    };

    const handlePriorityChange = (event: SelectChangeEvent) => {
        setPriorityFilter(event.target.value as string);
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormErrors({ title: false, priority: false, goal_id: false });
        setNewTask({ title: '', description: '', due_date: '', priority: '', status: '', goal_id: '' });
    };

    const handleCreateTask = async () => {
        const errors = {
            title: !newTask.title.trim(),
            priority: !newTask.priority,
            goal_id: !newTask.goal_id
        };

        setFormErrors(errors);

        if (errors.title || errors.priority || errors.goal_id) {
            return; 
        }

        const taskData: any = {
            title: newTask.title,
            description: newTask.description,
            due_date: newTask.due_date || null,
            priority: newTask.priority,
            status: newTask.status,
            goal_id: Number(newTask.goal_id)
        };

        await dispatch(addTask(taskData));
        handleClose();
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    if (loading && tasks.length === 0) {
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
                    onClick={handleClickOpen}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    New Task
                </Button>
            </Box>

            {/* Filters Bar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }} elevation={0}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select 
                        value={statusFilter} 
                        onChange={handleStatusChange}
                        displayEmpty
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <em style={{ color: "gray", fontStyle: "normal" }}>Status</em>;
                            }
                            return selected;
                        }}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="To Do">To Do</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select 
                        value={priorityFilter} 
                        onChange={handlePriorityChange}
                        displayEmpty
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <em style={{ color: "gray", fontStyle: "normal" }}>Priority</em>;
                            }
                            return selected;
                        }}
                    >
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

            {/* Create Task Modal */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField 
                            label="Title" 
                            fullWidth 
                            variant="outlined" 
                            required
                            error={formErrors.title}
                            helperText={formErrors.title ? "Title is required" : ""}
                            value={newTask.title} 
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                        />
                        <TextField 
                            label="Description" 
                            fullWidth 
                            multiline 
                            rows={2} 
                            variant="outlined" 
                            value={newTask.description} 
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                        />
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField 
                                label="Due Date" 
                                type="date" 
                                fullWidth 
                                InputLabelProps={{ shrink: true }} 
                                value={newTask.due_date} 
                                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} 
                            />
                            
                            <FormControl fullWidth error={formErrors.priority}>
                                <Select 
                                    value={newTask.priority} 
                                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em style={{ color: "gray", fontStyle: "normal" }}>Priority *</em>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                                {formErrors.priority && <FormHelperText>Priority is required</FormHelperText>}
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <Select 
                                    value={newTask.status} 
                                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em style={{ color: "gray", fontStyle: "normal" }}>Status</em>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem value="To Do">To Do</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth error={formErrors.goal_id}>
                                <Select 
                                    value={newTask.goal_id} 
                                    onChange={(e) => setNewTask({...newTask, goal_id: e.target.value})}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected === '' || selected === undefined) {
                                            return <em style={{ color: "gray", fontStyle: "normal" }}>Linked Goal *</em>;
                                        }
                                        const selectedGoal = goals.find(g => g.id === Number(selected));
                                        return selectedGoal ? selectedGoal.title : <em>Linked Goal *</em>;
                                    }}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {goals.map((goal) => (
                                        <MenuItem key={goal.id} value={goal.id}>
                                            {goal.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.goal_id && <FormHelperText>Linked Goal is required</FormHelperText>}
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateTask} variant="contained">Create Task</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};