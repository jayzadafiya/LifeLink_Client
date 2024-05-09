import axios from "axios";
import toast from "react-hot-toast";
import { Doctor } from "../../interfaces/Doctor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/config";

interface DoctorSliceState {
  doctorList: Doctor[] | null;
  searchDoctorList: Doctor[] | null;
  loading: boolean;
}

const initialState: DoctorSliceState = {
  doctorList: null,
  searchDoctorList: null,
  loading: false,
};

export const searchDoctor: any = createAsyncThunk(
  "doctor/searchDoctor",
  async (query: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/doctors?query=${query}`);

      return { data: res.data };
    } catch (error: any) {
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
      })
      .addCase(searchDoctor.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });
  },
});

export const { setDocterList } = doctorSlice.actions;

export default doctorSlice.reducer;
