import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import gameReducer from "./slices/game";
import { IAuth, IGame } from "./types";
export interface IRootState {
  auth: IAuth;
  game: IGame;
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
