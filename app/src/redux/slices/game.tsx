import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { IEvent, IGame } from "../types";
import { logout } from "./auth";
import { IRootState } from "../store";

const initialEventState: IEvent = {
  _id: "",
  name: "",
  open: false,
  createdAt: new Date().toISOString(),
  closedAt: null,
};
const initialState: IGame = {
  event: initialEventState,
  loading: false,
  error: "",
};

const getEvent = createAsyncThunk<
  IEvent,
  string,
  { rejectValue: { message: string } | string; state: IRootState }
>("event", async (eventId: string, { rejectWithValue, dispatch, getState }) => {
  try {
    const state = getState();
    const jwt: string = state.auth.jwt;
    const response = await axios.get(`${API_URL}/event/${eventId}`, {
      headers: {
        Authorization: jwt,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        dispatch(logout());
      }
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue({ message: error.response.data.message });
      } else {
        return rejectWithValue("An error occurred while trying to get event.");
      }
    } else {
      throw new Error("different error than axios");
    }
  }
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetGame: (state) => {
      state.event = initialEventState;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEvent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getEvent.fulfilled, (state, action) => {
      const newEvent = {
        _id: action.payload._id,
        name: action.payload.name,
        open: action.payload.open,
        createdAt: action.payload.createdAt,
        closedAt: action.payload.closedAt ? action.payload.closedAt : null,
      };
      state.event = newEvent;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(getEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetGame } = gameSlice.actions;
export { getEvent };
export default gameSlice.reducer;
