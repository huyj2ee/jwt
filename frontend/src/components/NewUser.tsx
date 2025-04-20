import React, { useState } from 'react';
import Layout from './Layout';
import { AppDispatch, RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { createUserAsync } from './user/userSlice';
import { SignedInUser, UserObject } from '../app/api';

const NewUser : React.FunctionComponent = () => {
  const user: SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [usernameIsRequired, setUsernameIsRequired] = useState<React.ReactNode>('');
  const [passwordIsRequired, setPasswordIsRequired] = useState<React.ReactNode>('');
  const [reenterPasswordIsRequired, setReenterPasswordIsRequired] = useState<React.ReactNode>('');
  let feedbackMessage: React.ReactNode = '';
  if (user.errorMessage === '') {
    feedbackMessage = <div>User created.</div>;
    if(errorMessage !== '') {
      setErrorMessage('');
    }
  }
  else if (user.errorMessage !== null
    && user.errorMessage !== ''
    && user.errorMessage !== errorMessage
    && errorMessage !== 'Unexpected Error has occurred.'
  ) {
    const alreadyExistsUser: string = 'already exists.';
    if (user.errorMessage.slice(-alreadyExistsUser.length) === alreadyExistsUser) {
      setErrorMessage(user.errorMessage);
    }
    else {
      setErrorMessage('Unexpected Error has occurred.');
    }
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
      setErrorMessage('Password and reenter password is not matched.');
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
      <div>
        <button type='button' onClick={handleCreate}>Create</button>
      </div>
    </Layout>
  );
};

export default NewUser;