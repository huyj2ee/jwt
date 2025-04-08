import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { signInAsync, refreshTokenAsync } from './user/userSlice';
import { User } from '../app/api';
import Layout from './Layout';

const SignedOutHome : React.FunctionComponent = () => {
  const user: User = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  function handleSignIn() {
    dispatch(signInAsync({username, password}));
  }
  return (
    <>
      <label htmlFor='username'>Username</label>
      <input id='username' onChange={e => setUsername(e.target.value)} value={username}></input>
      <label htmlFor='password'>Password</label>
      <input id='password' type='password' onChange={e => setPassword(e.target.value)} value={password}></input>
      <div>{user.errorMessage === null ? '' : user.errorMessage}</div>
      <button type='submit' onClick={handleSignIn}>Sign in</button>
    </>
  );
}

const SignedInHome : React.FunctionComponent = () => {
  return (
    <Layout>
      <div>Welcome JWT</div>
    </Layout>
  );
}

const Home : React.FunctionComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const user:User = useSelector((state: RootState) => state.user);
  const doesRefreshToken = user.doesRefreshToken;
  if (user.doesRefreshToken === false && user.username === null) {
    dispatch(refreshTokenAsync());
  }
  return (
    user.username === null ? (doesRefreshToken === false ? '': <SignedOutHome />) : <SignedInHome />
  );
};

export default Home;