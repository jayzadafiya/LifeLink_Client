import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import toast from "react-hot-toast";
import { User } from "../../interfaces/User";
import { PayLoad } from "../../interfaces/User";
import { LoginForm } from "../../interfaces/Forms";
import { BASE_URL } from "../../utils/config";
import { TimeslotCreated } from "../../interfaces/Doctor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Interface for the state of the user slice
interface UserState {
  user: User | null;
  role: string | null;
  accessToken: string | null;
  isLogging: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  role: null,
  accessToken: null,
  isLogging: false,
  loading: false,
  error: null,
};

export const login: any = createAsyncThunk(
  "user/login",
  async (formData: LoginForm) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/login`, formData);
      return data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
);

// Function use to get login user(patient and doctor) data
export const fetchUser: any = createAsyncThunk("user/fatchUser", async () => {
  try {
    const token = Cookies.get("token");

    if (token) {
      const decodedToken = jwt.decode(token) as PayLoad;
      let data = null;

      if (decodedToken.role === "admin") {
        const res = await axios.get(`${BASE_URL}/admin/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        data = res.data;
      } else if (decodedToken.role === "patient") {
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
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error(error.response.data.message);
  }
});

// Function use update user data
export const updateUser: any = createAsyncThunk(
  "user/updateUser",
  async (data: { fromData: User; timeslot?: TimeslotCreated[] }) => {
    try {
      const token = Cookies.get("token");

      if (token) {
        const decodedToken = jwt.decode(token) as PayLoad;
        let res = null;

        if (decodedToken.role === "patient") {
          res = await axios.put(
            `${BASE_URL}/users/${decodedToken.userId}`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
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

        return { data: res?.data };
      }
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      throw new Error(err);
    }
  }
);

// Function use update password
export const updatePassword: any = createAsyncThunk(
  "/user/updatePassword",
  async (formData) => {
    try {
      const token = Cookies.get("token");

      if (token) {
        const { data } = await axios.patch(
          `${BASE_URL}/auth/update-password`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return { token: data };
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("token");
      state.user = null;
      state.accessToken = null;
      toast.success("Come back soon!!!");
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

        const expiresInString = process.env.NEXT_PUBLIC_COOKIE_EXPIRESIN;

        if (expiresInString) {
          const expiresIn = parseInt(expiresInString, 10);

          Cookies.set("token", action.payload.token, {
            expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
            secure: true,
          });
        }
        toast.success(
          `Welcome ${action.payload.data.role === "patient" ? "Mr. " : "Dr. "}${
            action.payload.data.name
          }`
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.isLogging = false;
        state.loading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.accessToken = action.payload.token;
        state.role = action.payload.data?.role;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
        state.error = null;
        toast.success(
          `${action.payload.data.role === "patient" ? "Mr. " : "Dr. "}${
            action.payload.data.name
          } data get updated succesfully`
        );
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.accessToken = action.payload.token;

        const expiresInString = process.env.NEXT_PUBLIC_COOKIE_EXPIRESIN;

        if (expiresInString) {
          const expiresIn = parseInt(expiresInString, 10);

          Cookies.set("token", action.payload.token, {
            expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
            secure: true,
          });
        }

        toast.success("Password get update succefully");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
