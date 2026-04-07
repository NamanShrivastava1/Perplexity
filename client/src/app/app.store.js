import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice.js";
import chatReducers from "../features/chat/chat.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducers,
  },
});
