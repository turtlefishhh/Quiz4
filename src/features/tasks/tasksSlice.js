import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/client";

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (payload) => apiRequest("/api/v1/tasks", { method: "POST", body: payload }),
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    createStatus: "idle",
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createTask.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.error?.message || "Unable to create task.";
      });
  },
});

export default tasksSlice.reducer;
