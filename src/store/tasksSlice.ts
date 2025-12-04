import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabase-client'; 

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Completed';
  user_id: string;
  goal_id: number | null; 
  goals?: {
    title: string;
  };
}

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          goals (
            title
          )
        `)
        .order('id', { ascending: false }); 

      if (error) throw error;
      
      return data as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (newTask: Partial<Task>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select(`
          *,
          goals (
            title
          )
        `)
        .single();

      if (error) throw error;
      return data as Task;
    } catch (error: any) {
      console.error("Supabase Add Task Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearTasks } = tasksSlice.actions;

export default tasksSlice.reducer;