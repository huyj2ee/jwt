import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { SignedInUser, Credential } from '../app/api';
import { changePasswordAsync, setErrorMessage } from './user/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const ChangePassword : React.FunctionComponent = () => {
  const user: SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientErrorMessage, setClientErrorMessage] = useState(null);
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
      setClientErrorMessage('Password and reenter password is not matched.');
    }
    else {
      setClientErrorMessage(null);
      dispatch(changePasswordAsync(credential));
    }
  }
  function handleBack() {
    dispatch(setErrorMessage(null));
    navigate('/');
  }
  let feedbackMessage: React.ReactNode = null;
  let changeButton: React.ReactNode = '';
  if (user.errorMessage === '') {
    feedbackMessage = <div>Password is changed.</div>;
  }
  else {
    changeButton = <button className='w-[68px] h-[34px] mr-[53px] bg-[#0099cc] rounded-[6px] text-white' type='submit' onClick={handleChangePassword}>Change</button>;
  }
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='box-content relative w-[524px] bg-[#eeeeee] border-[#999999] border-[1px] rounded-tl-[10px] rounded-tr-[10px]'>
        <div className='flex items-center justify-center w-[524px] h-[55px] bg-[#d9d9d9] border-[#999999] border-b-[1px] rounded-tl-[10px] rounded-tr-[10px] text-[24px]'>
          Change password
        </div>
        <div className='flex items-center h-[43px] ml-[53px] mt-[27px]'>
          <div className='inline-block min-w-[147px] text-[16px]'>Username</div>
          <div className='h-[27px] w-[271px]'>{user.username}</div>
        </div>
        <div className='flex items-center h-[43px] ml-[53px]'>
          <label htmlFor='password' className='inline-block min-w-[147px] text-[16px]'>Password</label>
          <input id='password' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px]' type='password' onChange={e => setPassword(e.target.value)} value={password}></input>
        </div>
        <div className='flex items-center h-[43px] ml-[53px]'>
          <label htmlFor='reenterPassword' className='inline-block min-w-[147px] text-[16px]'>Reenter password</label>
          <input id='reenterPassword' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px]' type='password' onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}></input>
        </div>
        {clientErrorMessage === null ? null : (
          <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px] bg-[#f9e4dd] text-[#6c0101]'>
            <FontAwesomeIcon className='ml-[11px] mr-[13px] w-[15px] h-[17px] text-[#db2f2f]' icon={faTriangleExclamation}/> {clientErrorMessage}
          </div>
        )}
        {user.errorMessage === null || user.errorMessage === '' ? null : (
          <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px] bg-[#f9e4dd] text-[#6c0101]'>
            <FontAwesomeIcon className='ml-[11px] mr-[13px] w-[15px] h-[17px] text-[#db2f2f]' icon={faTriangleExclamation}/> Unexpected Error has occurred.
          </div>
        )}
        {feedbackMessage === null ? null : (
          <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px]'>
            {feedbackMessage}
          </div>
        )}
        <div className='flex items-center justify-end w-[524px] h-[55px] mt-[25px] bg-[#fafafa] border-[#999999] border-t-[1px]'>
          <button className='w-[68px] h-[34px] mr-[24px] bg-[#0099cc] rounded-[6px] text-white' type='submit' onClick={handleBack}>Back</button>
          {changeButton}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;