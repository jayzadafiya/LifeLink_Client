import { BASE_URL } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,

  accessToken: null,
  isLogging: false,
  loading: false,
  error: null,
};
export const login = createAsyncThunk("user/login", async (formData) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, formData);
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (state) => {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      state.user = userData ? JSON.parse(userData) : null;
      state.accessToken = token || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.accessToken = action.payload.token;
        state.isLogging = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", state.accessToken);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLogging = false;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUserState } = userSlice.actions;

export default userSlice.reducer;
