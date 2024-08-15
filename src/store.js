import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./slices/newsReducer"; 

const store = configureStore({
  reducer: {
    news: newsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };