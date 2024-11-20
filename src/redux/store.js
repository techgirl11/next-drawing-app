import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import drawingReducer from "./slices/drawingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userDrawings: drawingReducer,
  },
});
