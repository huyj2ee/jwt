import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { AppDispatch, RootState } from '../app/store';
import { createUserAsync, setErrorMessage } from './user/userSlice';
import { SignedInUser, UserObject } from '../app/api';

const NewUser : React.FunctionComponent = () => {
  const navigate = useNavigate();
  const user: SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(true);
  const [clientErrorMessage, setClientErrorMessage] = useState<string>(null);
  const [usernameIsRequired, setUsernameIsRequired] = useState<React.ReactNode>('');
  const [passwordIsRequired, setPasswordIsRequired] = useState<React.ReactNode>('');
  const [reenterPasswordIsRequired, setReenterPasswordIsRequired] = useState<React.ReactNode>('');
  let button: React.ReactNode = (
    <div>
      <button type='button' onClick={handleCreate}>Create</button>
    </div>
  );
  function handleBack() {
    navigate('/');
    dispatch(setErrorMessage(null));
  }
  let feedbackMessage: React.ReactNode = '';
  let errorMessage: string = '';
  if (user.errorMessage === '') {
    feedbackMessage = <div>User created.</div>;
    button = (
    <div>
      <button type='button' onClick={handleBack}>Back</button>
    </div>
  );
  }
  else if (user.errorMessage !== null) {
    const alreadyExistsUser: string = 'already exists.';
    if (user.errorMessage.slice(-alreadyExistsUser.length) === alreadyExistsUser) {
      errorMessage = user.errorMessage;
    }
    else {
      errorMessage = 'Unexpected Error has occurred.';
    }
  }
  else {
    errorMessage = clientErrorMessage;
  }
  function handleCreate() {
    if (username === '') {
      setUsernameIsRequired(<span>this field is required</span>);
    }
    else {
      setUsernameIsRequired('');
    }
    if (password === '') {
      setPasswordIsRequired(<span>this field is required</span>);
    }
    else {
      setPasswordIsRequired('');
    }
    if (confirmPassword === '') {
      setReenterPasswordIsRequired(<span>this field is required</span>);
    }
    else {
      setReenterPasswordIsRequired('');
    }
    if (password !== confirmPassword) {
      setClientErrorMessage('Password and reenter password is not matched.');
    }
    else if (username !== '' && password !== '' && confirmPassword !== '') {
      const user: UserObject = {
        username,
        password,
        enabled
      };
      dispatch(createUserAsync(user));
    }
  }

  return (
    <Layout>
      <div>Create user</div>
      <div>
        <label htmlFor='username'>User name</label>
        <input id='username' type='text' onChange={e => setUsername(e.target.value)} value={username}></input>
        {usernameIsRequired}
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' onChange={e => setPassword(e.target.value)} value={password}></input>
        {passwordIsRequired}
      </div>
      <div>
        <label htmlFor='reenterPassword'>Reenter password</label>
        <input id='reenterPassword' type='password' onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}></input>
        {reenterPasswordIsRequired}
      </div>
      <div>
        <label htmlFor='enable'>Enable</label>
        <input id='enable' type='checkbox' onChange={e => setEnabled(e.target.checked)} checked={enabled}></input>
      </div>
      {errorMessage === null ? '' : <div>{errorMessage}</div>}
      {feedbackMessage}
      {button}
    </Layout>
  );
};

export default NewUser;