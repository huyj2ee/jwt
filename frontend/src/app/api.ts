import axios, { AxiosResponse } from 'axios';
import {
    setSignedInObject,
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
    UsersEndpoint,
    RolesEndpoint
  } from './setting';
import { deleteUserAsync, filterByUsernameAsync, listUsersAsync, setEnabledAsync, setPasswordAsync, unlockUserAsync } from '../components/users/usersSlice';
import { assignRevokeRoleAsync, getAllRolesAsync, getAssignedRolesAsync } from '../components/roles/rolesSlice';

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
  roles: Array<string>,
  errorMessage: string
};

export interface UserObject {
  username: string,
  password: string,
  enabled: boolean
};

export interface UserItem {
  username: string,
  password: string,
  enabled: boolean,
  accountNonLocked: boolean
};

export interface UsersStore {
  targetUsername: string,
  data: Array<UserItem>,
  count: number,
  limit: number,
  page: number,
  errorMessage: string
};

export interface RolesStore {
  roles: Array<string>,
  assignedRoles: Array<string>,
  errorMessage: string
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
    const signedInObj = {
      accessToken: response.data.accessToken,
      username: response.data.username,
      roles: response.data.roles,
    };
    dispatch(setSignedInObject(signedInObj));
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

        case 'listusers':
          dispatch(nextOp());
          dispatch(listUsersAsync(JSON.parse(user.params[user.curOp])));
          break;

        case 'filterbyusername':
          dispatch(nextOp());
          dispatch(filterByUsernameAsync(user.params[user.curOp]));
          break;

        case 'createuser':
          dispatch(nextOp());
          dispatch(createUserAsync(JSON.parse(user.params[user.curOp])));
          break;

        case 'deleteuser':
          dispatch(nextOp());
          dispatch(deleteUserAsync(JSON.parse(user.params[user.curOp])));
          break;

        case 'setpassword':
          dispatch(nextOp());
          dispatch(setPasswordAsync(JSON.parse(user.params[user.curOp])));
          break;

        case 'unlockuser':
          dispatch(nextOp());
          dispatch(unlockUserAsync(JSON.parse(user.params[user.curOp])));
          break;

        case 'setenabled':
          dispatch(nextOp());
          dispatch(setEnabledAsync(JSON.parse(user.params[user.curOp])));
          break;

        case 'getallroles':
          dispatch(nextOp());
          dispatch(getAllRolesAsync());
          break;

        case 'getassignedroles':
          dispatch(nextOp());
          dispatch(getAssignedRolesAsync(user.params[user.curOp]));
          break;

        case 'assignrevokerole':
          dispatch(nextOp());
          dispatch(assignRevokeRoleAsync(JSON.parse(user.params[user.curOp])));
          break;
      }
    }
    return response.data;
  } catch (error) {
    const signedInObj: Object = {
      username: null,
      accessToken: null,
      roles: []
    };
    const user: SignedInUser = getState().user;
    const expiredMsg: string = 'Refresh token was expired. Please make a new sign in request.';
    const notfoundMsg: string = 'Refresh token is not in database.';
    if (user.doesRefreshToken === true
      && error.response.data.message.slice(-expiredMsg.length) !== expiredMsg
      && error.response.data.message.slice(-notfoundMsg.length) !== notfoundMsg) {
      dispatch(setErrorMessage('Unexpected Error has occured.'));
    }
    else {
      dispatch(setErrorMessage(null));
    }
    dispatch(setSignedInObject(signedInObj));
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
};

export const listUsers = async (params: {page:number, nonlocked:boolean}, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    params:{
      page: params.page,
      accountNonLocked: params.nonlocked
    },
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.get(UsersEndpoint, config);
    return {
      data: response.data,
      count: parseInt(response.headers['pagination-count']),
      limit: parseInt(response.headers['pagination-limit']),
      page: parseInt(response.headers['pagination-page'])
    };
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to get user list.') {
      dispatch(setOps({ops:['listusers'], params:[JSON.stringify(params)]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
};

export const filterByUsername = async (username: string, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.get(UsersEndpoint + '/' + username, config);
    return {
      data: [response.data],
      count: 1,
      limit: 1,
      page: 0
    };
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to get user.') {
      dispatch(setOps({ops:['filterbyusername'], params:[username]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const deleteUser = async (params: {username: string, filteredUsername: string, page: number, nonlocked: boolean}, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    await axios.delete(UsersEndpoint + '/' + params.username, config);
    if (params.filteredUsername.length > 0) {
      dispatch(filterByUsernameAsync(params.filteredUsername));
    }
    else {
      dispatch(listUsersAsync({page: params.page, nonlocked: params.nonlocked}));
    }
    return null;
  } catch (error) {
    const url:string = error.response.config.url;
    const username:string = url.substring(url.lastIndexOf('/') + 1, url.length);
    if (error.response.data.message === 'Admin role is required to delete user.') {
      dispatch(setOps({ops:['deleteuser'], params:[JSON.stringify(params)]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const setPassword = async (params: {username: string, password: string}, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.put(UsersEndpoint + '/' + params.username, params, config);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to edit user.') {
      dispatch(setOps({ops:['setpassword'], params:[error.response.config.data]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const unlockUser = async (params: {username: string, filteredUsername: string, page: number, nonlocked: boolean}, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const httpParams = {username: params.username, accountNonLocked: true};
    await axios.put(UsersEndpoint + '/' + params.username, httpParams, config);
    if (params.filteredUsername.length > 0) {
      dispatch(filterByUsernameAsync(params.filteredUsername));
    }
    else {
      dispatch(listUsersAsync({page: params.page, nonlocked: params.nonlocked}));
    }
    return null;
  } catch (error) {
    const url:string = error.response.config.url;
    if (error.response.data.message === 'Admin role is required to edit user.') {
      dispatch(setOps({ops:['unlockuser'], params:[JSON.stringify(params)]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const setEnabled = async (params: {username: string, enabled: boolean, filteredUsername: string, page: number, nonlocked: boolean}, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    await axios.put(UsersEndpoint + '/' + params.username, params, config);
    if (params.filteredUsername.length > 0) {
      dispatch(filterByUsernameAsync(params.filteredUsername));
    }
    else {
      dispatch(listUsersAsync({page: params.page, nonlocked: params.nonlocked}));
    }
    return null;
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to edit user.') {
      dispatch(setOps({ops:['setenabled'], params:[JSON.stringify(params)]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const getAllRoles = async ({ rejectWithValue, dispatch, getState }: any) => {
  const ops: Array<string> = getState().user.ops;
  const params: Array<string> = getState().user.params;
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.get(RolesEndpoint, config);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to get all roles list.') {
      dispatch(setOps({ops:['getallroles'], params:[null]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const getAssignedRoles = async (username: string, { rejectWithValue, dispatch, getState }: any) => {
  const ops: Array<string> = getState().user.ops;
  const params: Array<string> = getState().user.params;
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    const response = await axios.get(UsersEndpoint + '/' + username + '/roles', config);
    if (getState().roles.roles === null) {
      dispatch(getAllRolesAsync());
    }
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to get assigned roles list.') {
      dispatch(setOps({ops:['getassignedroles'], params:[username]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}

export const assignRevokeRole = async (params: {username: string, role: string, isAssigned: boolean}, { rejectWithValue, dispatch, getState }: any) => {
  const accessToken: string = getState().user.accessToken;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  try {
    let response: AxiosResponse<any, any> = null;
    const url = UsersEndpoint + '/' + params.username + '/roles/' + params.role;
    if (params.isAssigned) {
      response = await axios.put(url, undefined, config);
    }
    else {
      response = await axios.delete(url, config);
    }
    dispatch(getAssignedRolesAsync(params.username));
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'Admin role is required to assign role.' ||
      error.response.data.message === 'Admin role is required to revoke role.'
    ) {
      dispatch(setOps({ops:['assignrevokerole'], params:[JSON.stringify(params)]}));
      dispatch(refreshTokenAsync());
    }
    return rejectWithValue(error.response.data);
  }
}