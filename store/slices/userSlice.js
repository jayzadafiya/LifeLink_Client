import { BASE_URL } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

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

export const fetchUser = createAsyncThunk("user/fatchUser", async () => {
  try {
    const token = Cookies.get("token");

    const decodedToken = jwt.decode(token);

    let res = null;

    if (decodedToken.role === "patient") {
      res = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (decodedToken.role === "doctor") {
      res = await axios.get(`${BASE_URL}/doctors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return { data: res.data, token };
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ formData, userId }) => {
    try {
      console.log(userId);
      const token = Cookies.get("token");
      const res = await axios.put(`${BASE_URL}/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res);

      return { data: res.data };
    } catch (error) {
      const err = error?.response?.data?.message || error?.message;
      throw new Error(err);
    }
  }
);

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
    logout: (state) => {
      Cookies.remove("token");
      state.user = null;
      state.accessToken = null;
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
        Cookies.set("token", state.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLogging = false;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLogging = false;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.accessToken = action.payload.token;
        console.log(state.user);
      });
  },
});

export const { setUserState, logout } = userSlice.actions;

export default userSlice.reducer;
