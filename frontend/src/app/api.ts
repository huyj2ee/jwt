import axios from 'axios';
import {
    setSignInObject,
    nextOp,
    setOps,
    refreshTokenAsync,
    signOutAsync,
    changePasswordAsync,
    setErrorMessage,
    createUserAsync
  } from '../components/user/userSlice';

import {
    SignInEndpoint,
    RefreshTokenEndpoint,
    SignOutEndpoint,
    ChangePasswordEndpoint,
    UsersEndpoint
  } from './setting';

export interface Credential {
  username: string,
  password: string,
};

export interface SignedInUser {
  ops: Array<string>,
  params: Array<string>,
  curOp: number,
  doesRefreshToken: boolean,
  username: string,
  accessToken: string,
  errorMessage: string
};

export interface UserObject {
  username: string,
  password: string,
  enabled: boolean
};

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
    const signInObj = {
      accessToken: response.data.accessToken,
      username: response.data.username
    };
    dispatch(setSignInObject(signInObj));
    const user: SignedInUser = getState().user;
    if (user.ops.length > 0) {
      switch(user.ops[user.curOp]) {
        case 'signout':
          dispatch(nextOp());
          dispatch(signOutAsync());  
          break;

        case'changepassword':
          dispatch(nextOp());
          dispatch(changePasswordAsync(JSON.parse(user.params[user.curOp])));
          break;

        case 'createuser':
          dispatch(nextOp());
          dispatch(createUserAsync(JSON.parse(user.params[user.curOp])));
          break;
      }
    }
    return response.data;
  } catch (error) {
    const signInObj: Object = {
      username: null,
      accessToken: null
    };
    const user: SignedInUser = getState().user;
    const expiredMsg: string = 'Refresh token was expired. Please make a new sign in request.';
    const notfoundMsg: string = 'Refresh token is not in database.';
    if (user.doesRefreshToken === true
      && error.response.data.message.slice(-expiredMsg.length) !== expiredMsg
      && error.response.data.message.slice(-notfoundMsg.length) !== notfoundMsg) {
      dispatch(setErrorMessage('Unexpected Error has occured.'));
    }
    dispatch(setSignInObject(signInObj));
    return rejectWithValue(error.response.data);
  }
}

export const signOut = async ({ rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
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

export const changePassword = async (credential: Credential, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.put(ChangePasswordEndpoint, credential, config);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'You must sign in to execute change password operation.') {
      dispatch(setOps({ops:['changepassword'], params:[error.response.config.data]}));
      dispatch(refreshTokenAsync());
    }
    else if (error.response.data.status === 401) {
      const signInObj: Object = {
        username: null,
        accessToken: null
      };
      dispatch(setSignInObject(signInObj));
    }
    return rejectWithValue(error.response.data);
  }
};

export const createUser = async (user: UserObject, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.post(UsersEndpoint, user, config);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to create new user.') {
      dispatch(setOps({ops:['createuser'], params:[error.response.config.data]}));
      dispatch(refreshTokenAsync());
    }
    else {
      dispatch(setErrorMessage(error.response.data.message));
    }
    return rejectWithValue(error.response.data);
  }
}