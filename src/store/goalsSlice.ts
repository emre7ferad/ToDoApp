import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabase-client";

export interface Goal {
    id: number;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    user_id: string;
}

interface GoalsState {
    items: Goal[];
    loading: boolean;
    error: string | null;
}

const initialState: GoalsState = {
    items: [],
    loading: false,
    error: null,
}

// fetch goals
export const fetchGoals = createAsyncThunk(
    'goals/fetchGoals',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            return data as Goal[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// add goal
export const addGoal = createAsyncThunk(
    'goals/addGoal',
    async (newGoal: Partial<Goal>, { rejectWithValue}) => {
        try {
            const { data, error } = await supabase
                .from('goals')
                .insert([newGoal])
                .select()
                .single();

            if (error) throw error;
            return data as Goal;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const goalSlice = createSlice({
    name: 'goals',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGoals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addGoal.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default goalSlice.reducer;