import { BASE_URL } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  donorData: null,
  loading: false,
  prevData: [],
  requestData: {},
  currentPage: 1,
};

export const fetchDonorData = createAsyncThunk(
  "DFL/fetchDonorData",
  async ({ latlng, formData, page }) => {
    try {
      let url = `${BASE_URL}/donor?page=${page}&limit=1&`;

      if (formData) {
        url += `&city=${formData.city}&bloodType=${encodeURIComponent(
          formData.bloodType
        )}&address=${formData.address}`;
      }

      const { data } = await axios.post(url, {
        latlng: latlng,
      });
      return { data, requestData: { latlng, formData }, page };
    } catch (error) {
      const err = error?.response?.data?.message || error?.message;
      throw new Error(err);
    }
  }
);
const DFLSlice = createSlice({
  name: "DFL",
  initialState,
  reducers: {
    getDonorData: (state, action) => {
      state.currentPage = action.payload.page;
      state.donorData = action.payload.data;
    },
    setPrevData: (state) => {
      state.prevData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonorData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchDonorData.fulfilled, (state, action) => {
        state.loading = false;

        state.donorData = action.payload.data;
        state.requestData = action.payload.requestData;
        state.prevData.push(action.payload.data);
        state.currentPage = action.payload.page;
      })
      .addCase(fetchDonorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});

export const { getDonorData, setPrevData } = DFLSlice.actions;

export default DFLSlice.reducer;
