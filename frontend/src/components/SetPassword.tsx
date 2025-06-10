import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { clearTargetUsername, setPasswordAsync } from './users/usersSlice';
import { UsersStore } from '../app/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

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
      setErrorMessage(null);
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
`      <div className='flex justify-center items-center h-[calc(100%-50px)] w-full'>
        <div className='box-content relative w-[524px] bg-[#eeeeee] border-[#999999] border-[1px] rounded-tl-[10px] rounded-tr-[10px]'>
          <div className='flex items-center justify-center w-[524px] h-[55px] bg-[#d9d9d9] border-[#999999] border-b-[1px] rounded-tl-[10px] rounded-tr-[10px] text-[24px]'>
            Set password
          </div>
          <div className='flex items-center h-[43px] ml-[53px] mt-[27px]'>
            <div className='inline-block min-w-[147px] text-[16px]'>Username</div>
            <div className='h-[27px] w-[271px]'>{username}</div>
          </div>
          <div className='flex items-center h-[43px] ml-[53px]'>
            <label htmlFor='password' className='inline-block min-w-[147px] text-[16px]'>Password</label>
            <input id='password' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px]' type='password' onChange={e => setPassword(e.target.value)} value={password}></input>
          </div>
          <div className='flex items-center h-[43px] ml-[53px]'>
            <label htmlFor='reenterPassword' className='inline-block min-w-[147px] text-[16px]'>Reenter password</label>
            <input id='reenterPassword' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px]' type='password' onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}></input>
          </div>
          {errorMessage === null ? null : (
            <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px] bg-[#f9e4dd] text-[#6c0101]'>
              <FontAwesomeIcon className='ml-[11px] mr-[13px] w-[15px] h-[17px] text-[#db2f2f]' icon={faTriangleExclamation}/> {errorMessage}
            </div>
          )}
          {users.errorMessage === null ? null : (
            <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px] bg-[#f9e4dd] text-[#6c0101]'>
              <FontAwesomeIcon className='ml-[11px] mr-[13px] w-[15px] h-[17px] text-[#db2f2f]' icon={faTriangleExclamation}/> Unexpected Error has occurred.
            </div>
          )}
          <div className='flex items-center justify-end w-[524px] h-[55px] mt-[25px] bg-[#fafafa] border-[#999999] border-t-[1px]'>
            <button className='w-[44px] h-[34px] mr-[53px] bg-[#0099cc] rounded-[6px] text-white' type='submit' onClick={handleSet}>Set</button>
          </div>
        </div>
      </div>`
    </Layout>
  );
};

export default SetPassword;