import { createSlice, createAsyncThunk, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import { signIn, refreshToken, Credential, User } from '../../app/api';

export const signInAsync = createAsyncThunk(
  'signin',
  async (param: Credential, thunkAPI) => {
    const response = await signIn(param);
    return response;
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'refreshtoken',
  async (thunkAPI) => {
    const response = await refreshToken();
    return response;
  }
);

const initialState: User = {
  doesRefreshToken: false,
  username: null,
  accessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder: ActionReducerMapBuilder<User>) => {
    builder
      .addCase(signInAsync.pending, (state: User) => {
        state.username = null;
        state.accessToken = null;
      })
      .addCase(signInAsync.fulfilled, (state: User, action: PayloadAction<any>) => {
        state.username = action.payload.username;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(signInAsync.rejected, (state: User, action: PayloadAction<any>) => {
        state.username = null;
        state.accessToken = null;
      })
      .addCase(refreshTokenAsync.pending, (state: User) => {
        state.username = null;
        state.accessToken = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state: User, action: PayloadAction<any>) => {
        state.doesRefreshToken = true;
        state.username = action.payload.username;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshTokenAsync.rejected, (state: User, action: PayloadAction<any>) => {
        state.doesRefreshToken = true;
        state.username = null;
        state.accessToken = null;
      });
  }
});

export default userSlice.reducer;