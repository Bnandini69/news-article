import { createSlice } from "@reduxjs/toolkit";

const newsSlice = createSlice({
  name: "news",
  initialState: {
    data: null,
    filters:{categories:[],sources:[],keyword:"tesla"},
    loading: false,
    error: null,
    authors:[],
    sources:[],
  },
  reducers: {
    fetchDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.data=[];
    },
    saveFilter: (state, action) => {
      state.filters = action.payload;
    },
    saveSources:(state, action) => {
      state.sources = action.payload;
    },
    saveAuthors:(state, action) => {
      state.authors = action.payload;
    },
  },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure,saveFilter,saveSources,saveAuthors } =
  newsSlice.actions;

export default newsSlice.reducer;