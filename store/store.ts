import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import doctorReducer from "./slices/doctorSlice";
import adminReducer from "./slices/adminSlice";
import paginationReducer from "./slices/pagination";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    user: userReducer,
    doctor: doctorReducer,
    pagination: paginationReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
