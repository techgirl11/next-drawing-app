import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawings: [],
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
  },
});

export const { setDrawings, setLoading, setError } = drawingSlice.actions;

export default drawingSlice.reducer;
