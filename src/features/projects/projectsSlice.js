import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api/client";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => apiRequest("/api/v1/projects"),
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (payload, thunkAPI) => {
    const response = await apiRequest("/api/v1/projects", {
      method: "POST",
      body: payload,
    });
    await thunkAPI.dispatch(fetchProjects());
    return response;
  },
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, updates }, thunkAPI) => {
    const response = await apiRequest(`/api/v1/projects/${projectId}`, {
      method: "PUT",
      body: updates,
    });
    await thunkAPI.dispatch(fetchProjects());
    return response;
  },
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, thunkAPI) => {
    const response = await apiRequest(`/api/v1/projects/${projectId}`, {
      method: "DELETE",
    });
    await thunkAPI.dispatch(fetchProjects());
    return response;
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    lastUpdated: null,
    saveStatus: "idle",
    saveError: null,
  },
  reducers: {
    clearProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload;
        state.items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.projects)
            ? payload.projects
            : [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Request failed.";
        state.items = [];
      })
      .addCase(createProject.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.saveError = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.error?.message || "Unable to create project.";
      })
      .addCase(updateProject.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.saveError = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.error?.message || "Unable to update project.";
      })
      .addCase(deleteProject.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.saveError = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.error?.message || "Unable to delete project.";
      });
  },
});

export const { clearProjectError } = projectsSlice.actions;
export default projectsSlice.reducer;
