import { BASE_URL } from "../../utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { DonorForm } from "../../interfaces/Forms";

interface RequestData {
  latlng?: string;
  formData?: DonorForm; // Adjust this type as per the structure of your formData object
}

// Interface for the state of the DFL slice
interface DFLState {
  donorData: DonorForm[] | null;
  loading: boolean;
  currentPage: number;
  prevData: DonorForm[];
  requestData: RequestData;
}

const initialState: DFLState = {
  donorData: null,
  loading: false,
  prevData: [],
  requestData: {},
  currentPage: 1,
};

export const fetchDonorData: any = createAsyncThunk(
  "DFL/fetchDonorData",
  async ({
    latlng,
    formData,
    page,
  }: {
    latlng?: string;
    formData?: any;
    page: number;
  }) => {
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
    } catch (error: any) {
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
        toast.error(action.error.message);
      });
  },
});

export const { getDonorData, setPrevData } = DFLSlice.actions;

export default DFLSlice.reducer;
