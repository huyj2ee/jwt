import axios from 'axios';
import {
    setAccessToken,
    clearOps,
    nextOp,
    refreshTokenAsync,
    setOps,
    signOutAsync
  } from '../components/user/userSlice';

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
  params: Array<Object>,
  curOp: number,
  doesRefreshToken: boolean,
  username: string,
  accessToken: string,
  errorMessage: string
}

export const signIn = async (credential: Credential, { rejectWithValue }: any) => {
  try {
    const response = await axios.post(SignInEndpoint, credential);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
};

export const refreshToken = async ({ rejectWithValue, dispatch, getState }: any) => {
  try {
    const response = await axios.post(RefreshTokenEndpoint);
    const user: User = getState().user;
    if (user.ops.length > 0) {
      if (user.curOp === user.ops.length) {
        dispatch(clearOps());
      }
      else if (user.ops[user.curOp] === 'signout') {
        dispatch(setAccessToken(response.data.accessToken));
        dispatch(nextOp());
        dispatch(signOutAsync());
      }
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
}

export const signOut = async ({ rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  console.log(accessToken);
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.post(SignOutEndpoint, undefined, config);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'You must sign in to execute sign out operation.') {
      dispatch(setOps({ops:['signout'], params:[null]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const changePassword = async (credential: Credential, { rejectWithValue, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.put(ChangePasswordEndpoint, credential, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
};