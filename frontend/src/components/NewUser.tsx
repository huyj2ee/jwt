import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { AppDispatch, RootState } from '../app/store';
import { createUserAsync, setErrorMessage } from './user/userSlice';
import { SignedInUser, UserObject } from '../app/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

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
  const backButton = (
    <div>
      <button type='button' className='w-[56px] h-[34px] mr-[53px] bg-[#0099cc] rounded-[6px] text-white' onClick={handleBack}>Back</button>
    </div>
  );
  const triangleExclamation = <FontAwesomeIcon style={{width: '15px', height: '17px'}} className='ml-[11px] mr-[13px] text-[#db2f2f]' icon={faTriangleExclamation}/>;
  let button: React.ReactNode = (
    <div>
      <button className='w-[67px] h-[34px] mr-[53px] bg-[#0099cc] rounded-[6px] text-white' type='button' onClick={handleCreate}>Create</button>
    </div>
  );
  function handleBack() {
    navigate('/users');
  }
  let feedbackMessage: React.ReactNode = null;
  let errorMessage: string = '';
  if (user.errorMessage === '') {
    feedbackMessage = <div>User created.</div>;
    button = backButton;
  }
  else if (user.errorMessage !== null) {
    const alreadyExistsUser: string = 'already exists.';
    if (user.errorMessage.slice(-alreadyExistsUser.length) === alreadyExistsUser) {
      errorMessage = user.errorMessage;
    }
    else {
      errorMessage = 'Unexpected Error has occurred.';
      button = backButton;
    }
  }
  else {
    errorMessage = clientErrorMessage;
  }
  function handleCreate() {
    if (username === '') {
      setUsernameIsRequired(triangleExclamation);
    }
    else {
      setUsernameIsRequired('');
    }
    if (password === '') {
      setPasswordIsRequired(triangleExclamation);
    }
    else {
      setPasswordIsRequired('');
    }
    if (confirmPassword === '') {
      setReenterPasswordIsRequired(triangleExclamation);
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
      setClientErrorMessage(null);
      dispatch(createUserAsync(user));
    }
  }

  return (
    <Layout>
`      <div className='flex justify-center items-center h-[calc(100%-50px)] w-full'>
        <div className='box-content relative w-[524px] bg-[#eeeeee] border-[#999999] border-[1px] rounded-tl-[10px] rounded-tr-[10px]'>
          <div className='flex items-center justify-center w-[524px] h-[55px] bg-[#d9d9d9] border-[#999999] border-b-[1px] rounded-tl-[10px] rounded-tr-[10px] text-[24px]'>
            Create user
          </div>
          <div className='flex items-center h-[43px] ml-[53px] mt-[27px]'>
            <label className='inline-block min-w-[147px] text-[16px]' htmlFor='username'>User name</label>
            <input id='username' type='text' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px] bg-[#ffffff]' onChange={e => setUsername(e.target.value)} value={username}></input>
            {usernameIsRequired}
          </div>
          <div className='flex items-center h-[43px] ml-[53px]'>
            <label htmlFor='password' className='inline-block min-w-[147px] text-[16px]'>Password</label>
            <input id='password' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px] bg-[#ffffff]' type='password' onChange={e => setPassword(e.target.value)} value={password}></input>
            {passwordIsRequired}
          </div>
          <div className='flex items-center h-[43px] ml-[53px]'>
            <label htmlFor='reenterPassword' className='inline-block min-w-[147px] text-[16px]'>Reenter password</label>
            <input id='reenterPassword' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px] bg-[#ffffff]' type='password' onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}></input>
            {reenterPasswordIsRequired}
          </div>
          <div className='flex items-center h-[43px] ml-[53px]'>
            <label htmlFor='enable' className='inline-block min-w-[147px] text-[16px]'>Enable</label>
            <input id='enable' type='checkbox' className='border-[#999999] border-[1px] rounded-[6px]' onChange={e => setEnabled(e.target.checked)} checked={enabled}></input>
          </div>
          {errorMessage === null || errorMessage === '' ? null : (
            <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px] bg-[#f9e4dd] text-[#6c0101]'>
              {triangleExclamation} {errorMessage}
            </div>
          )}
          {feedbackMessage === null ? null : (
            <div className='flex items-center h-[32px] mt-[11px] mb-[32px] ml-[53px]'>
              {feedbackMessage}
            </div>
          )}
          <div className='flex items-center justify-end w-[524px] h-[55px] mt-[25px] bg-[#fafafa] border-[#999999] border-t-[1px]'>
            {button}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewUser;