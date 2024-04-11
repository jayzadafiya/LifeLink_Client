import { BASE_URL } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const initialState = {
  user: null,
  role: null,
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
    let data = null;

    if (decodedToken.role === "patient") {
      const res = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      data = res.data;
    } else if (decodedToken.role === "doctor") {
      const res = await axios.get(
        `${BASE_URL}/doctors/${decodedToken.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      data = res.data.doctor;
    }
    return { data: data, token };
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateUser = createAsyncThunk("user/updateUser", async (data) => {
  try {
    const token = Cookies.get("token");

    const decodedToken = jwt.decode(token);
    let res = null;

    if (decodedToken.role === "patient") {
      res = await axios.put(`${BASE_URL}/users/${decodedToken.userId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (decodedToken.role === "doctor") {
      res = await axios.put(
        `${BASE_URL}/doctors/${decodedToken.userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    return { data: res.data };
  } catch (error) {
    const err = error?.response?.data?.message || error?.message;
    throw new Error(err);
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
        Cookies.set("token", state.accessToken, {
          expires: new Date(
            Date.now() +
              process.env.NEXT_PUBLIC_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
          ),
          secure: true,
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLogging = false;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.accessToken = action.payload.token;
        state.role = action.payload.data.role;
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
      });
  },
});

export const { setUserState, logout } = userSlice.actions;

export default userSlice.reducer;
