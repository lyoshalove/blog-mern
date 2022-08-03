import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

export const fetchLogin = createAsyncThunk("/auth/fetchLogin", async (params) => {
  const { data } = await axios.post("/login", params);

  return data;
});

export const fetchLoginMe = createAsyncThunk('/auth/fetchLoginMe', async () => {
  const { data } = await axios.get('/auth/me');

  return data;
});

export const fetchRegister = createAsyncThunk('/auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/register', params);

  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchLogin.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchLogin.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchLoginMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchLoginMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchLoginMe.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchRegister.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchRegister.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;