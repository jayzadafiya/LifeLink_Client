import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import toast from "react-hot-toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginForm } from "../../interfaces/Forms";
import { Admin, PayLoad } from "../../interfaces/User";
import { BASE_URL } from "../../utils/config";

// Interface for the state of the user slice
interface AdminState {
  admin: Admin | null;
  accessToken: string | null;
  isAlreadyLogging: boolean;
  loading: boolean;
}

const initialState: AdminState = {
  admin: null,
  accessToken: null,
  isAlreadyLogging: false,
  loading: false,
};

export const adminLogin: any = createAsyncThunk(
  "admin/adminLogin",
  async (formData: LoginForm, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/admin-login`,
        formData
      );
      return data;
    } catch (error: any) {
      let customError = {
        message: error.response?.data?.message || "Something went wrong",
        isAlreadyLogging: false,
      };
      if (error.response && error.response.status === 409) {
        customError.isAlreadyLogging = true;
      }

      return rejectWithValue(customError);
    }
  }
);

export const adminLogout: any = createAsyncThunk(
  "admin/adminLogout",
  async (token: string) => {
    try {
      const { userId } = jwt.decode(token) as PayLoad;
      await axios.post(
        `${BASE_URL}/auth/${userId}/admin-logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setIsAlreadyLogging: (state) => {
      state.isAlreadyLogging = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.admin = action.payload.data;
        state.accessToken = action.payload.token;
        state.loading = false;
        state.isAlreadyLogging =  false;

        const expiresInString = process.env.NEXT_PUBLIC_COOKIE_EXPIRESIN;

        if (expiresInString) {
          const expiresIn = parseInt(expiresInString, 10);

          Cookies.set("token", action.payload.token, {
            expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
            secure: true,
          });
        }
        toast.success("Welcome Sir !!");
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAlreadyLogging = action.payload?.isAlreadyLogging || false;
        toast.error(action.payload?.message);
      })
      .addCase(adminLogout.fulfilled, (state) => {
        Cookies.remove("token");
        state.admin = null;
        state.accessToken = null;
        toast.success("Come back soon!!!");
      });
  },
});
export const { setIsAlreadyLogging } = adminSlice.actions;
export default adminSlice.reducer;
