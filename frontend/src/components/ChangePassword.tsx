import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { SignedInUser, Credential } from '../app/api';
import { changePasswordAsync } from './user/userSlice';

const ChangePassword : React.FunctionComponent = () => {
  const user: SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.username === null) {
      navigate('/');
    }
  }, [user.username]);
  const credential : Credential = {
    username: user.username,
    password
  };
  function handleChangePassword() {
    if (password != confirmPassword) {
      setErrorMessage('Password and reenter password is not matched.');
    }
    else {
      dispatch(changePasswordAsync(credential));
    }
  }
  function handleBack() {
    navigate('/');
  }
  let feedbackMessage: React.ReactNode = '';
  let changeButton: React.ReactNode = '';
  if (user.errorMessage === '') {
    feedbackMessage = <div>Password is changed.</div>;
  }
  else {
    changeButton = <button type='submit' onClick={handleChangePassword}>Change</button>;
  }
  return (
    <>
      <div>
        <span>User name</span>
        <span>{user.username}</span>
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' onChange={e => setPassword(e.target.value)} value={password}></input>
      </div>
      <div>
        <label htmlFor='reenterPassword'>Reenter password</label>
        <input id='reenterPassword' type='password' onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}></input>
      </div>
      {errorMessage === null ? '' : <div>{errorMessage}</div>}
      {feedbackMessage}
      <div>
        <button type='button' onClick={handleBack}>Back</button>
        {changeButton}
      </div>
    </>
  );
};

export default ChangePassword;