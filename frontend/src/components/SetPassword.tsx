import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { clearTargetUsername, setPasswordAsync } from './users/usersSlice';
import { UsersStore } from '../app/api';

const SetPassword : React.FunctionComponent = () => {
  const navigate = useNavigate();
  const users:UsersStore = useSelector((state: RootState) => state.users);
  const dispatch:AppDispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const usernameObj:string = searchParams.get("username");
  const username:string = usernameObj === null ? '' : usernameObj;

  function handleSet() {
    if (password !== confirmPassword) {
      setErrorMessage('Password and reenter password is not matched.');
    }
    else {
      dispatch(setPasswordAsync({username, password}));
    }
  }

  useEffect(()=>{
    if (users.targetUsername !== null) {
      dispatch(clearTargetUsername());
      navigate('/users');
    }
  }, [dispatch, users]);

  return (
    <Layout>
      <div>Set password</div>
      <div>
        <span>User name</span>
        <span>{username}</span>
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
      <div>
        <button type='button' onClick={handleSet}>Set</button>
      </div>
    </Layout>
  );
};

export default SetPassword;