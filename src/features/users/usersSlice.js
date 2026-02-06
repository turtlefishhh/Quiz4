import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/client";

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload) => apiRequest("/api/v1/users", { method: "POST", body: payload }),
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    createStatus: "idle",
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.error?.message || "Unable to create user.";
      });
  },
});

export default usersSlice.reducer;
