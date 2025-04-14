import { createSlice, createAsyncThunk, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import {
    signIn,
    signOut,
    refreshToken,
    changePassword,
    Credential,
    User
  } from '../../app/api';

export const signInAsync = createAsyncThunk(
  'signin',
  async (param: Credential, thunkAPI) => {
    const response = await signIn(param, thunkAPI);
    return response;
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'refreshtoken',
  async (param, thunkAPI) => {
    const response = await refreshToken(thunkAPI);
    return response;
  }
);

export const signOutAsync = createAsyncThunk(
  'signout',
  async (param, thunkAPI) => {
    const response = await signOut(thunkAPI);
    return response;
  }
);

export const changePasswordAsync = createAsyncThunk(
  'password',
  async (credential: Credential, thunkAPI) => {
    const response = await changePassword(credential, thunkAPI);
    return response;
  }
);

const initialState: User = {
  ops: [],
  params: [],
  curOp: 0,
  doesRefreshToken: false,
  username: null,
  accessToken: null,
  errorMessage: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSignInObject: (state, action) => {
      state.doesRefreshToken = true;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
    },
    nextOp: (state) => {
      if (state.curOp < state.ops.length) {
        state.curOp = state.curOp + 1;
      }
      if (state.curOp === state.ops.length) {
        state.ops = [];
        state.params = [];
        state.curOp = 0;  
      }
    },
    setOps: (state, action) => {
      state.ops = action.payload.ops;
      state.params = action.payload.params;
      state.curOp = 0;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<User>) => {
    builder
      // signin
      .addCase(signInAsync.pending, (state: User) => {
        state.errorMessage = null;
        state.username = null;
        state.accessToken = null;
      })
      .addCase(signInAsync.fulfilled, (state: User, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.username = action.payload.username;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(signInAsync.rejected, (state: User, action: PayloadAction<any>) => {
        state.errorMessage = action.payload.message;
        state.username = null;
        state.accessToken = null;
      })
      // refreshtoken
      .addCase(refreshTokenAsync.pending, (state: User) => {
        state.username = null;
        state.accessToken = null;
      })
      // signout
      .addCase(signOutAsync.pending, (state: User) => {
      })
      .addCase(signOutAsync.fulfilled, (state: User, action: PayloadAction<any>) => {
        state.username = null;
        state.accessToken = null;
      })
      .addCase(signOutAsync.rejected, (state: User, action: PayloadAction<any>) => {
        state.username = null;
        state.accessToken = null;
      })
      // password
      .addCase(changePasswordAsync.pending, (state: User) => {
        state.errorMessage = null;
      });
  }
});

export const { setSignInObject, nextOp, setOps, setErrorMessage } = userSlice.actions
export default userSlice.reducer;