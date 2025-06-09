import { createSlice, createAsyncThunk, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import {
    signIn,
    signOut,
    refreshToken,
    changePassword,
    Credential,
    SignedInUser,
    UserObject,
    createUser
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

export const createUserAsync = createAsyncThunk(
  'createuser',
  async (user: UserObject, thunkAPI) => {
    const response = await createUser(user, thunkAPI);
    return response;
  }
);

const initialState: SignedInUser = {
  ops: [],
  params: [],
  curOp: 0,
  doesRefreshToken: false,
  username: null,
  accessToken: null,
  roles: [],
  errorMessage: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSignedInObject: (state, action) => {
      state.doesRefreshToken = true;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.roles = action.payload.roles;
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
  extraReducers: (builder: ActionReducerMapBuilder<SignedInUser>) => {
    builder
      // signin
      .addCase(signInAsync.pending, (state: SignedInUser) => {
        state.errorMessage = null;
        state.username = null;
        state.accessToken = null;
      })
      .addCase(signInAsync.fulfilled, (state: SignedInUser, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.username = action.payload.username;
        state.accessToken = action.payload.accessToken;
        state.roles = action.payload.roles;
      })
      .addCase(signInAsync.rejected, (state: SignedInUser, action: PayloadAction<any>) => {
        state.errorMessage = action.payload.message;
        state.username = null;
        state.accessToken = null;
      })
      // refreshtoken
      // signout
      .addCase(signOutAsync.pending, (state: SignedInUser) => {
      })
      .addCase(signOutAsync.fulfilled, (state: SignedInUser, action: PayloadAction<any>) => {
        state.username = null;
        state.accessToken = null;
      })
      .addCase(signOutAsync.rejected, (state: SignedInUser, action: PayloadAction<any>) => {
        state.username = null;
        state.accessToken = null;
      })
      // password
      .addCase(changePasswordAsync.pending, (state: SignedInUser) => {
        state.errorMessage = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state: SignedInUser, action: PayloadAction<any>) => {
        state.errorMessage = '';
      })
      .addCase(changePasswordAsync.rejected, (state: SignedInUser, action: PayloadAction<any>) => {
        state.errorMessage = action.payload.message;
      })
      // createuser
      .addCase(createUserAsync.pending, (state: SignedInUser) => {
        state.errorMessage = null;
      })
      .addCase(createUserAsync.fulfilled, (state: SignedInUser) => {
        state.errorMessage = '';
      });
  }
});

export const { setSignedInObject, nextOp, setOps, setErrorMessage } = userSlice.actions
export default userSlice.reducer;