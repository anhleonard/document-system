import { configureStore } from "@reduxjs/toolkit";
import { modalReducer } from "./slices/modal-slice";
import { drawerReducer } from "./slices/drawer-slice";
import { confirmReducer } from "./slices/confirm-slice";
import { loadingReducer } from "./slices/loading-slice";
import { alertReducer } from "./slices/alert-slice";
export const store = configureStore({
  reducer: {
    modal: modalReducer,
    drawer: drawerReducer,
    confirm: confirmReducer,
    loading: loadingReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
