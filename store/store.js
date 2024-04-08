import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import doctorReducer from "./slices/doctorSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    doctor: doctorReducer,
  },
});

export default store;
