import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/tasksSlice";
import { fetchGoals } from "../store/goalsSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FlagIcon from "@mui/icons-material/Flag";
import WarningIcon from "@mui/icons-material/Warning";
import { Bar, Pie, Line } from "react-chartjs-2";
import type { AppDispatch, RootState } from "../store/store";

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: tasks, loading: tasksLoading } = useSelector(
    (state: RootState) => state.tasks
  );
  const { items: goals, loading: goalsLoading } = useSelector(
    (state: RootState) => state.goals
  );

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchGoals());
  }, [dispatch]);

  const totalProjects = goals.length;
  const totalTasks = tasks.length;

  const overdueTasksCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter(
      (t) =>
        t.due_date &&
        t.due_date < today &&
        t.status !== "Completed"
    ).length;
  }, [tasks]);

  const lineChartData = useMemo(() => {
    const labels: string[] = [];
    const dataPoints: number[] = [];
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      
      // Format label (e.g: Sep 10)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(label);

      // Count tasks completed on this due date
      const count = tasks.filter(
        (t) => t.status === "Completed" && t.due_date === dateString
      ).length;
      dataPoints.push(count);
    }

    return {
      labels,
      datasets: [
        {
          label: "Tasks Completed",
          data: dataPoints,
          borderColor: "#2196f3",
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [tasks]);

  const taskStatusData = useMemo(() => {
    const statusCounts = {
      "To Do": 0,
      "In Progress": 0,
      Completed: 0,
    };

    tasks.forEach((task) => {
      const statusKey = task.status || "To Do";
      if (statusKey in statusCounts) {
        statusCounts[statusKey as keyof typeof statusCounts]++;
      }
    });

    return {
      labels: ["To Do", "In Progress", "Completed"],
      datasets: [
        {
          label: "Number of Tasks",
          data: [
            statusCounts["To Do"],
            statusCounts["In Progress"],
            statusCounts["Completed"],
          ],
          backgroundColor: ["#ff9800", "#2196f3", "#4caf50"],
          borderRadius: 4,
        },
      ],
    };
  }, [tasks]);

  const tasksPriorityData = useMemo(() => {
    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    tasks.forEach((task) => {
      const priorityKey = task.priority || "Low";
      if (priorityKey in priorityCounts) {
        priorityCounts[priorityKey as keyof typeof priorityCounts]++;
      }
    });

    return {
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          data: [
            priorityCounts["Low"],
            priorityCounts["Medium"],
            priorityCounts["High"],
          ],
          backgroundColor: ["#81c784", "#ffb74d", "#e57373"],
          borderColor: ["#ffffff", "#ffffff", "#ffffff"],
          borderWidth: 2,
        },
      ],
    };
  }, [tasks]);

  if (tasksLoading || goalsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="text.primary"
        sx={{ mb: 4 }}
      >
        Dashboard
      </Typography>

      {/* Top Cards: Counts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              borderLeft: "6px solid #2196F3",
            }}
            elevation={0}
          >
            <Box>
              <Typography variant="subtitle1" color="text.secondary">
                Total Projects
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {totalProjects}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                backgroundColor: "#E3F2FD",
                color: "#2196F3",
              }}
            >
              <FlagIcon fontSize="large" />
            </Box>
          </Paper>
        </Grid>
        
        <Grid size={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              borderLeft: "6px solid #FF9800",
            }}
            elevation={0}
          >
            <Box>
              <Typography variant="subtitle1" color="text.secondary">
                Total Tasks
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {totalTasks}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                backgroundColor: "#FFF3E0",
                color: "#FF9800",
              }}
            >
              <AssignmentIcon fontSize="large" />
            </Box>
          </Paper>
        </Grid>

        <Grid size={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              borderLeft: "6px solid #f44336"
            }}
            elevation={0}
          >
            <Box>
              <Typography variant="subtitle1" color="error.main" fontWeight={600}>
                Overdue Tasks
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="error.main">
                {overdueTasksCount}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                backgroundColor: "#ffebee",
                color: "#f44336",
              }}
            >
              <WarningIcon fontSize="large" />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Vertical Bar Chart */}
        <Grid size={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
            elevation={0}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Task Status Distribution
            </Typography>
            <Box sx={{ flexGrow: 1, position: "relative" }}>
              <Bar
                data={taskStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" as const } },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid size={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
            elevation={0}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Tasks by Priority
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pie
                data={tasksPriorityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" as const } },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* NEW: Line Chart */}
        <Grid size={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
            elevation={0}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Task Completion (Last 7 Days)
            </Typography>
            <Box sx={{ flexGrow: 1, position: "relative" }}>
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};