import { select } from "@material-tailwind/react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawings: [],
  selectedDrawing: {
    drawingId: null,
    name: null,
    jsonData: {},
  },
  loading: false,
  error: null,
};

const drawingSlice = createSlice({
  name: "userDrawings",
  initialState,
  reducers: {
    setDrawings(state, action) {
      state.drawings = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSelectedDrawing(state, action) {
      state.selectedDrawing = action.payload;
    },
  },
});

export const { setDrawings, setLoading, setError, setSelectedDrawing } = drawingSlice.actions;

export default drawingSlice.reducer;
