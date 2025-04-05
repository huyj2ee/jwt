import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store'
import { signInAsync, refreshTokenAsync } from './user/userSlice';

const SignedOutHome : React.FunctionComponent = () => {
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
      <button type='submit' onClick={handleSignIn}>Sign in</button>
    </>
  );
}

const SignedInHome : React.FunctionComponent = () => {
  return (
    <div>
      Home<br />
      <Link to='/password'>password</Link><br />
      <Link to='/user'>user</Link><br />
      <Link to='/users'>users</Link><br />
      <Link to='/setpassword'>setpassword</Link><br />
      <Link to='/roles'>roles</Link><br />
    </div>
  );
}

const Home : React.FunctionComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  if (user.doesRefreshToken == false && user.username == null) {
    dispatch(refreshTokenAsync());
  }
  return (
    user.username == null ? <SignedOutHome /> : <SignedInHome />
  );
};

export default Home;