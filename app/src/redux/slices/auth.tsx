import { createSlice } from "@reduxjs/toolkit";
import { IAuth, ILoginReponse, IUser } from "../types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL, ROLE_USER } from "../../constants/api";
import {
  login as LoginUtils,
  getJwt,
  logout as logoutUtils,
  setUser,
} from "../../utils/auth";
import { IRootState } from "../store";
const initialUserState: IUser = {
  _id: "",
  username: "",
  rolls: [],
  role: ROLE_USER,
};

const initialState: IAuth = {
  user: initialUserState,
  isAuthenticated: false,
  loading: false,
  error: "",
  jwt: getJwt() || "",
};

const checkAuth = createAsyncThunk<
  IUser,
  void,
  {
    rejectValue: { message: string };
    state: IRootState;
  }
>("auth/checkAuth", async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    const state = getState();
    const jwt: string = state.auth.jwt;
    const response = await axios.get(`${API_URL}/auth/check`, {
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
        return rejectWithValue({
          message: "An error occurred while trying to get event.",
        });
      }
    } else {
      throw new Error("different error than axios");
    }
  }
});

const login = createAsyncThunk<
  ILoginReponse,
  { username: string; password: string },
  { rejectValue: { message: string } }
>(
  "auth/login",
  async (
    formData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          return rejectWithValue({ message: error.response.data.message });
        } else {
          return rejectWithValue({
            message: "An error occurred while trying to log in.",
          });
        }
      } else {
        throw new Error("different error than axios");
      }
    }
  }
);

const register = createAsyncThunk<
  ILoginReponse,
  { username: string; password: string },
  { rejectValue: { message: string } }
>(
  "auth/register",
  async (
    formData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          return rejectWithValue({ message: error.response.data.message });
        } else {
          return rejectWithValue({
            message: "An error occurred while trying to register.",
          });
        }
      } else {
        throw new Error("different error than axios");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = initialUserState;
      state.jwt = "";
      logoutUtils();
    },
    addRoll: (state, action) => {
      state.user.rolls.push(action.payload);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.jwt = action.payload.token;
      LoginUtils(action.payload.token, action.payload.user);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload?.message as string) || "";
    });
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.jwt = action.payload.token;
      LoginUtils(action.payload.token, action.payload.user);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload?.message as string) || "";
    });
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      setUser(action.payload);
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload?.message as string) || "";
    });
  },
});

export const { logout, addRoll, updateUser } = authSlice.actions;
export { login, register, checkAuth };
export default authSlice.reducer;
