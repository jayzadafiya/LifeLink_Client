import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import doctorReducer from "./slices/doctorSlice";
import DFLReducer from "./slices/DFLSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    doctor: doctorReducer,
    dfl: DFLReducer,
  },
});

export default store;
