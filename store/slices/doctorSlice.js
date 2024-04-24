import { BASE_URL } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  doctorList: null,
  searchDoctorList: null,
  loading: false,
};

export const searchDoctor = createAsyncThunk(
  "doctor/searchDoctor",
  async (query) => {
    try {
      const res = await axios.get(`${BASE_URL}/doctors?query=${query}`);

      return { data: res.data };
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDocterList: (state, { payload }) => {
      state.doctorList = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchDoctor.fulfilled, (state, action) => {
        state.searchDoctorList = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(searchDoctor.rejected, (state, action) => {
        state.isLogging = false;
        state.loading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});

export const { setDocterList } = doctorSlice.actions;

export default doctorSlice.reducer;
