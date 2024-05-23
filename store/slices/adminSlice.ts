import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginForm } from "../../interfaces/Forms";
import { Admin } from "../../interfaces/User";
import { BASE_URL } from "../../utils/config";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Interface for the state of the user slice
interface AdminState {
  admin: Admin | null;
  accessToken: string | null;
  isLogging: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admin: null,
  accessToken: null,
  isLogging: false,
  loading: false,
  error: null,
};

export const adminLogin: any = createAsyncThunk(
  "admin/adminLogin",
  async (formData: LoginForm) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/admin-login`,
        formData
      );
      return data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.admin = action.payload.data;
        state.accessToken = action.payload.token;
        state.isLogging = true;
        state.loading = false;
        state.error = null;

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
        state.isLogging = false;
        state.loading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});

export default adminSlice.reducer;
