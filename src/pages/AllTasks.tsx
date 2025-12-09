import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../store/tasksSlice";
import { fetchGoals } from "../store/goalsSlice";
import type { RootState, AppDispatch } from "../store/store";
import type { Task } from "../store/tasksSlice";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// 1. Import Formik and Schema
import { useFormik } from "formik";
import { taskSchema } from "../schemas";

export const AllTasks = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    items: tasks,
    loading,
    error,
  } = useSelector((state: RootState) => state.tasks);
  const { items: goals } = useSelector((state: RootState) => state.goals);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchGoals());
  }, [dispatch]);

  // 2. Initialize Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      due_date: "",
      priority: "",
      status: "",
      goal_id: "",
    },
    validationSchema: taskSchema,
    onSubmit: async (values) => {
      const taskData: any = {
        title: values.title,
        description: values.description,
        due_date: values.due_date || null,
        priority: values.priority,
        status: values.status || "To Do",
        goal_id: Number(values.goal_id),
      };

      if (editingTaskId) {
        // Update Logic
        await dispatch(updateTask({ id: editingTaskId, updates: taskData }));
      } else {
        // Create Logic
        await dispatch(addTask(taskData));
      }
      handleClose();
    },
  });

  // --- Handlers ---

  const handleClose = () => {
    setOpen(false);
    formik.resetForm(); // Clear form when closing
    setEditingTaskId(null);
  };

  const handleClickOpen = () => {
    setEditingTaskId(null);
    formik.resetForm(); // Ensure clean form for new task
    setOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    // Populate form with task data
    formik.setValues({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date || "",
      priority: task.priority,
      status: task.status,
      goal_id: task.goal_id ? String(task.goal_id) : "",
    });
    setOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await dispatch(deleteTask(id));
    }
  };

  const handleStatusChange = (event: SelectChangeEvent) =>
    setStatusFilter(event.target.value as string);
  const handlePriorityChange = (event: SelectChangeEvent) =>
    setPriorityFilter(event.target.value as string);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4, mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, color: "error.main" }}>Error loading tasks: {error}</Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          All Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          New Task
        </Button>
      </Box>

      {/* Filters Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
        elevation={0}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            displayEmpty
            renderValue={(s) =>
              s.length === 0 ? (
                <em style={{ color: "gray", fontStyle: "normal" }}>Status</em>
              ) : (
                s
              )
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
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
            renderValue={(s) =>
              s.length === 0 ? (
                <em style={{ color: "gray", fontStyle: "normal" }}>Priority</em>
              ) : (
                s
              )
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
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
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Linked Goal</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  {task.title}
                </TableCell>
                <TableCell>{task.due_date || "No Date"}</TableCell>
                <TableCell>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority) as any}
                    size="small"
                    variant="filled"
                    sx={{ fontWeight: "bold", minWidth: "70px" }}
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      p: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#f0f0f0",
                      fontSize: "0.875rem",
                      color: "#555",
                    }}
                  >
                    {task.status}
                  </Box>
                </TableCell>
                <TableCell>
                  {task.goals?.title || (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      No Goal
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(task)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(task.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No tasks found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Dialog (Create & Edit) --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingTaskId ? "Edit Task" : "Add New Task"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            {/* Title */}
            <TextField
              label="Title"
              name="title"
              fullWidth
              variant="outlined"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Due Date */}
              <TextField
                label="Due Date"
                name="due_date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formik.values.due_date}
                onChange={formik.handleChange}
              />

              {/* Priority */}
              <FormControl
                fullWidth
                error={
                  formik.touched.priority && Boolean(formik.errors.priority)
                }
              >
                <Select
                  name="priority"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  displayEmpty
                  renderValue={(selected) =>
                    selected.length === 0 ? (
                      <em style={{ color: "gray", fontStyle: "normal" }}>
                        Priority *
                      </em>
                    ) : (
                      selected
                    )
                  }
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
                {formik.touched.priority && formik.errors.priority && (
                  <FormHelperText>{formik.errors.priority}</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Status */}
              <FormControl fullWidth>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected.length === 0 ? (
                      <em style={{ color: "gray", fontStyle: "normal" }}>
                        Status
                      </em>
                    ) : (
                      selected
                    )
                  }
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>

              {/* Linked Goal */}
              <FormControl
                fullWidth
                error={formik.touched.goal_id && Boolean(formik.errors.goal_id)}
              >
                <Select
                  name="goal_id"
                  value={formik.values.goal_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected === "" || selected === undefined)
                      return (
                        <em style={{ color: "gray", fontStyle: "normal" }}>
                          Linked Goal *
                        </em>
                      );
                    const selectedGoal = goals.find(
                      (g) => g.id === Number(selected)
                    );
                    return selectedGoal ? (
                      selectedGoal.title
                    ) : (
                      <em>Linked Goal *</em>
                    );
                  }}
                >
                  {goals.map((goal) => (
                    <MenuItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.goal_id && formik.errors.goal_id && (
                  <FormHelperText>{formik.errors.goal_id}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            {editingTaskId ? "Save Changes" : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
