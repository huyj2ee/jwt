import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch, RootState } from '../app/store';
import { signInAsync, refreshTokenAsync } from './user/userSlice';
import { SignedInUser } from '../app/api';
import Layout from './Layout';

const SignedOutHome : React.FunctionComponent = () => {
  const user: SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  function handleSignIn() {
    dispatch(signInAsync({username, password}));
  }
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div id='windows' className='box-content relative w-[524px] bg-[#eeeeee] border-[#999999] border-[1px] rounded-tl-[10px] rounded-tr-[10px]'>
        <div className='pl-[20px] flex items-center w-[524px] h-[55px] bg-[#d9d9d9] border-[#999999] border-b-[1px] rounded-tl-[10px] rounded-tr-[10px]'>
          <div className='w-[102px] h-[94px] bg-[#d9d9d9] border-[#999999] border-[1px] rounded-[8px]'>
            <div className='relative ml-[6px] mt-[6px] w-[88px] h-[80px] bg-[#fafafa] border-[#999999] border-[1px] rounded-[8px]'>
              <FontAwesomeIcon className='absolute left-[18px] top-[10px] text-[#999999] w-[50px] h-[56px] z-10' icon={faLock} />
              <div className='absolute bottom-0 w-[86px] h-[41px] bg-[#eeeeee] rounded-bl-[8px] rounded-br-[8px]'></div>
            </div>
          </div>
          <span className='text-[24px] ml-[20px]'>Welcome to JWT. Please sign in.</span>
        </div>
        <div className='flex items-center h-[43px] ml-[53px] mt-[27px]'>
          <label htmlFor='username' className='inline-block min-w-[147px] text-[16px]'>Username</label>
          <input id='username' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px]' onChange={e => setUsername(e.target.value)} value={username}></input>
        </div>
        <div className='flex items-center h-[43px] ml-[53px]'>
          <label htmlFor='password' className='inline-block min-w-[147px] text-[16px]'>Password</label>
          <input id='password' className='h-[27px] w-[271px] border-[#999999] border-[1px] rounded-[6px]' type='password' onChange={e => setPassword(e.target.value)} value={password}></input>
        </div>
        {user.errorMessage === null ? null : (
          <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px] bg-[#f9e4dd] text-[#6c0101]'>
            <FontAwesomeIcon className='ml-[11px] mr-[13px] w-[15px] h-[17px] text-[#db2f2f]' icon={faTriangleExclamation}/> {user.errorMessage}
          </div>
        )}
        <div className='flex items-center justify-end w-[524px] h-[55px] mt-[25px] bg-[#fafafa] border-[#999999] border-t-[1px]'>
          <button className='w-[68px] h-[34px] mr-[53px] bg-[#0099cc] rounded-[6px] text-white' type='submit' onClick={handleSignIn}>Sign in</button>
        </div>
      </div>
    </div>
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
  const user:SignedInUser = useSelector((state: RootState) => state.user);
  const doesRefreshToken = user.doesRefreshToken;
  if (user.doesRefreshToken === false && user.username === null) {
    dispatch(refreshTokenAsync());
  }
  return (
    user.username === null ? (doesRefreshToken === false ? '': <SignedOutHome />) : <SignedInHome />
  );
};

export default Home;