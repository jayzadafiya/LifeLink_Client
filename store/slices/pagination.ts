import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { BASE_URL } from "../../utils/config";
import { DonorForm } from "../../interfaces/Forms";
import { User } from "../../interfaces/User";
import { Doctor } from "../../interfaces/Doctor";

interface RequestData {
  latlng?: string;
  formData?: DonorForm | string;
}

interface PaginationState {
  data: DonorForm[] | Doctor[] | User[];
  loading: boolean;
  currentPage: number;
  prevData: DonorForm[] | Doctor[] | User[];
  requestData: RequestData;
}

const initialState: PaginationState = {
  data: [],
  loading: false,
  prevData: [],
  requestData: {},
  currentPage: 1,
};

export const fetchData: any = createAsyncThunk(
  "pagination/fetchData",
  async ({
    latlng,
    formData,
    page,
    type,
  }: {
    latlng?: string;
    formData?: any;
    page: number;
    type: string;
  }) => {
    let data;
    try {
      if (type === "admin") {
        const token = Cookies.get("token");

        if (token) {
          const url = `${BASE_URL}/admin/profile?page=${page}&limit=2`;

          const res = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          data = res.data.doctors;
        }
      } else if (type === "donor") {
        let url = `${BASE_URL}/donor?page=${page}&limit=2`;

        if (latlng) {
          url += `&latlog=${latlng}`;
        }

        if (formData) {
          url += `&city=${formData.city}&bloodType=${encodeURIComponent(
            formData.bloodType
          )}&address=${formData.address}`;
        }

        const res = await axios.get(url);

        data = res.data;
      } else if (type === "doctor") {
        let url = `${BASE_URL}/doctors?page=${page}&limit=1`;
        if (formData) {
          url += `&search=${formData}`;
        }
        const res = await axios.get(url);

        data = res.data;
      }

      return { data, requestData: { latlng, formData }, page };
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      throw new Error(err);
    }
  }
);

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    getData: (state, action) => {
      state.currentPage = action.payload.page;
      state.data = action.payload.data;
    },
    setData: (state, action) => {
      state.currentPage = action.payload.page;
      state.data = action.payload.data;
      state.prevData[action.payload.page - 1] = action.payload.data;
    },
    setPrevData: (state) => {
      state.prevData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.requestData = action.payload.requestData;
        state.prevData[action.payload.page - 1] = action.payload.data;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });
  },
});

export const { getData, setData, setPrevData } = paginationSlice.actions;
export default paginationSlice.reducer;
