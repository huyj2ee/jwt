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
}

export const signIn = async (credential: Credential) => {
  try {
    const response = await axios.post(SignInEndpoint, credential);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(RefreshTokenEndpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
}