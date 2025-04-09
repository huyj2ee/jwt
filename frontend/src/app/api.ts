import axios from 'axios';
import { AppDispatch } from './store';
import { clearOps, nextOp, refreshTokenAsync, signOutAsync } from '../components/user/userSlice';

import {
    SignInEndpoint,
    RefreshTokenEndpoint,
    SignOutEndpoint,
    ChangePasswordEndpoint
  } from './setting';

export interface Credential {
  username: string,
  password: string,
};

export interface User {
  ops: Array<string>,
  curOp: number,
  doesRefreshToken: boolean,
  username: string,
  accessToken: string,
  errorMessage: string
}

export function processChain(user: User, dispatch: AppDispatch) {
  if (user.ops.length > 0) {
    if (user.curOp < user.ops.length) {
      switch(user.ops[user.curOp]) {
        case 'refreshtoken':
          dispatch(nextOp());
          dispatch(refreshTokenAsync());
          break;

        case 'signout':
          dispatch(nextOp());
          dispatch(signOutAsync(user.accessToken));
          break;
      }
    }
    else {
      dispatch(clearOps());
    }
  }
};

export const signIn = async (credential: Credential, { rejectWithValue }: any) => {
  try {
    const response = await axios.post(SignInEndpoint, credential);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
};

export const refreshToken = async ({ rejectWithValue }: any) => {
  try {
    const response = await axios.post(RefreshTokenEndpoint);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
}

export const signOut = async (accessToken: string, { rejectWithValue }: any) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.post(SignOutEndpoint, undefined, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
}

export const changePassword = async (param: {accessToken: string, credential: Credential}, { rejectWithValue }: any) => {
  const config = {
    headers: { Authorization: `Bearer ${param.accessToken}` }
  };
  try {
    const response = await axios.put(ChangePasswordEndpoint, param.credential, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
};