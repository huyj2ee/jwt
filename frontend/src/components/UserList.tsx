import React, { ReactNode, useEffect } from 'react';
import Layout from './Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { clearTargetUsername, deleteUserAsync, filterByUsernameAsync, listUsersAsync, setEnabledAsync, unlockUserAsync } from './users/usersSlice';
import { SignedInUser, UserItem, UsersStore } from '../app/api';
import { clearRoles } from './roles/rolesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const User : React.FunctionComponent<{user: UserItem}> = ({user}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const usernameObj:string = searchParams.get("username");
  const filteredUsername:string = usernameObj === null ? '' : usernameObj;
  const pageStr:string = searchParams.get("page");
  const page:number = pageStr === null ? 0 : parseInt(pageStr);
  const nonlockedObj:string = searchParams.get("nonlocked");
  const nonlocked:boolean = nonlockedObj === null || nonlockedObj.length === 0 ? null : false;

  const signedInUser:SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate();

  function unlock(username: string):void {
    dispatch(unlockUserAsync({username, filteredUsername, page, nonlocked}));
  }

  function setEnabled(username: string, enabled: boolean):void {
    dispatch(setEnabledAsync({username, enabled, filteredUsername, page, nonlocked}));
  }

  function setPassword(username: string):void {
    dispatch(clearTargetUsername());
    navigate('/setpassword?username=' + username);
  }

  function setRoles(username: string):void {
    dispatch(clearRoles());
    navigate('/roles?username=' + username);
  }

  function deleteUser(username: string):void {
    dispatch(deleteUserAsync({username, filteredUsername, page, nonlocked}));
  }

  return (
    <div className='flex justify-between user-row'>
      <div>
        <span>{user.username}</span>
      </div>
      <div className='text-[#0099cc]'>
        {user.accountNonLocked ? '' : <span className='ml-[20px] cursor-pointer' onClick={() => unlock(user.username)}>unlock</span>}
        {
          user.username === signedInUser.username ?
          (
            user.enabled ?
            <span className='ml-[20px]'>disable</span> :
            <span className='ml-[20px]'>enable</span>
          ) :
          (
            user.enabled ?
            <span className='ml-[20px] cursor-pointer' onClick={() => setEnabled(user.username, false)}>disable</span> :
            <span className='ml-[20px] cursor-pointer' onClick={() => setEnabled(user.username, true)}>enable</span>
          )
        }
        <span className='ml-[20px] cursor-pointer' onClick={() => setPassword(user.username)}>password</span>
        <span className='ml-[20px] cursor-pointer' onClick={() => setRoles(user.username)}>roles</span>
        {
          user.username === signedInUser.username ?
          <span className='ml-[20px]'>delete</span> :
          <span className='ml-[20px] cursor-pointer' onClick={() => deleteUser(user.username)}>delete</span>
        }
      </div>
    </div>
  );
};

const UserList : React.FunctionComponent = () => {
  const users:UsersStore = useSelector((state: RootState) => state.users);
  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const usernameObj:string = searchParams.get("username");
  const username:string = usernameObj === null ? '' : usernameObj;
  const pageStr:string = searchParams.get("page");
  const page:number = pageStr === null ? 0 : parseInt(pageStr);
  const nonlockedObj:string = searchParams.get("nonlocked");
  const nonlocked:boolean = nonlockedObj === null || nonlockedObj.length === 0 ? null : false;
  const prePage:ReactNode = page > 0 ?
    <span onClick={handlePrePageClick} className='cursor-pointer px-[2px]'>
      <FontAwesomeIcon className='w-[10px] h-[16px]' icon={faAngleLeft}/>
    </span> :
    <span className='px-[2px]'>
      <FontAwesomeIcon className='w-[10px] h-[16px] text-[#d9d9d9]' icon={faAngleLeft}/>
    </span>;
  const nextPage:ReactNode = page < users.count - 1 ?
    <span onClick={handleNextPageClick} className='cursor-pointer px-[2px]'>
      <FontAwesomeIcon className='w-[10px] h-[16px]' icon={faAngleRight}/>
    </span> :
    <span className='px-[2px]'>
      <FontAwesomeIcon className='w-[10px] h-[16px] text-[#d9d9d9]' icon={faAngleRight}/>
    </span>;
  const lockButton:ReactNode = nonlocked === null ?
    <button className='w-[140px] h-[34px] mx-[6px] rounded-[6px] bg-[#0099cc] text-white' type='button' onClick={toggleLock}>List locked users</button> : 
    <button className='w-[110px] h-[34px] mx-[6px] rounded-[6px] bg-[#0099cc] text-white' type='button' onClick={toggleLock}>List all users</button>;

  function handlePrePageClick() {
    searchParams.set("nonlocked", nonlocked === null ? "" : nonlocked.toString());
    searchParams.set("page", (page - 1).toString());
    setSearchParams(searchParams);
  }

  function handleNextPageClick() {
    searchParams.set("nonlocked", nonlocked === null ? "" : nonlocked.toString());
    searchParams.set("page", (page + 1).toString());
    setSearchParams(searchParams);
  }

  function toggleLock() {
    searchParams.set("username", "");
    if (nonlocked === null) {
      searchParams.set("nonlocked", "false");
      searchParams.set("page", "0");
    }
    else {
      searchParams.set("nonlocked", "");
      searchParams.set("page", "0");
    }
    setSearchParams(searchParams);
  }

  function handleCreateUser() {
    navigate('/user');
  }

  function handleFilterByUsername() {
    if (username !== '') {
      dispatch(filterByUsernameAsync(username));
    }
  }

  function filterByUsernameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.key === 'Enter') {
      handleFilterByUsername();
    }
  }

  useEffect(()=>{
    if (username.length > 0) {
      dispatch(filterByUsernameAsync(username));
    }
    else {
      dispatch(listUsersAsync({page, nonlocked}));
    }
  }, [dispatch, page, nonlocked]);

  return (
    <Layout>
      <div className='flex justify-between items-center my-[7px] ml-[10px] mr-[6px]'>
        <div className='text-[24px]'>User list</div>
        <div className='flex items-center'>
          <div>
            <input className='w-[270px] h-[27px] mx-[6px] px-[2px] border-[1px] border-[#999999] rounded-[6px]' type='text' placeholder='Filter by username...' onKeyDown={e => filterByUsernameKeyDown(e)} onChange={e => setSearchParams("username=" + e.target.value)} value={username}></input>
            <button className='w-[56px] h-[34px] mx-[6px] rounded-[6px] bg-[#0099cc] text-white' type='button' onClick={handleFilterByUsername}>Filter</button>
          </div>
          <div>
            {lockButton}
          </div>
          <div>
            <button className='w-[102px] h-[34px] mx-[6px] rounded-[6px] bg-[#0099cc] text-white' type='button' onClick={handleCreateUser}>Create user</button>
          </div>
        </div>
      </div>
      {
        users.errorMessage === null ?
        null :
        <div>Unexpected Error has occurred.</div>
      }
      <div className='w-[60%] mx-auto'>
        <div className='text-[16px] mt-[45px]'>
          {users.data.map((user) => <User user={user}/>)}
        </div>
        <div className='float-right'>
          {prePage}<div className='inline-block w-[50px] h-[1px]'/>{nextPage}
        </div>
      </div>
    </Layout>
  );
};

export default UserList;