import axios from 'axios';
import { SignInEndpoint, RefreshTokenEndpoint } from './setting';

export interface Credential {
  username: string,
  password: string,
};

export interface User {
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

export const refreshToken = async ({ rejectWithValue }: any) => {
  try {
    const response = await axios.post(RefreshTokenEndpoint);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
}