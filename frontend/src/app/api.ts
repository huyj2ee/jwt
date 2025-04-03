import axios from 'axios';
import { SignInEndpoint } from './setting';

export interface Credential {
  username: string,
  password: string,
};

export interface User {
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