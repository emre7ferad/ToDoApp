import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import goalsReducer from "./goalsSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        goals: goalsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;