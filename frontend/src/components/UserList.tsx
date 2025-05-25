import React, { ReactNode, useEffect } from 'react';
import Layout from './Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { clearTargetUsername, setRefreshRequest, deleteUserAsync, filterByUsernameAsync, listUsersAsync, setEnabledAsync, unlockUserAsync } from './users/usersSlice';
import { SignedInUser, UserItem, UsersStore } from '../app/api';
import { clearRoles } from './roles/rolesSlice';

const User : React.FunctionComponent<{user: UserItem}> = ({user}) => {
  const signedInUser:SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate();

  function unlock(username: string):void {
    dispatch(unlockUserAsync(username));
  }

  function setEnabled(username: string, enabled: boolean):void {
    dispatch(setEnabledAsync({username, enabled}));
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
    dispatch(deleteUserAsync(username));
  }

  return (
    <div>
      <span>{user.username}</span>
      {user.accountNonLocked ? '' : <span onClick={() => unlock(user.username)}>unlock</span>}
      {user.enabled ?
        <span onClick={() => setEnabled(user.username, false)}>disable</span> :
        <span onClick={() => setEnabled(user.username, true)}>enable</span>
      }
      <span onClick={() => setPassword(user.username)}>password</span>
      <span onClick={() => setRoles(user.username)}>roles</span>
      {
        user.username === signedInUser.username ?
        <span>delete</span> :
        <span onClick={() => deleteUser(user.username)}>delete</span>
      }
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
    <span onClick={handlePrePageClick}>&lt;</span> :
    <span>&lt;</span>;
  const nextPage:ReactNode = page < users.count - 1 ?
    <span onClick={handleNextPageClick}>&gt;</span> :
    <span>&gt;</span>;
  const lockButton:ReactNode = nonlocked === null ?
    <button type='button' onClick={toggleLock}>List locked users</button> : 
    <button type='button' onClick={toggleLock}>List all users</button>;

  function handlePrePageClick() {
    dispatch(setRefreshRequest(true));
    searchParams.set("nonlocked", nonlocked === null ? "" : nonlocked.toString());
    searchParams.set("page", (page - 1).toString());
    setSearchParams(searchParams);
  }

  function handleNextPageClick() {
    dispatch(setRefreshRequest(true));
    searchParams.set("nonlocked", nonlocked === null ? "" : nonlocked.toString());
    searchParams.set("page", (page + 1).toString());
    setSearchParams(searchParams);
  }

  function toggleLock() {
    dispatch(setRefreshRequest(true));
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
    if (users.refreshRequest) {
      if (username.length > 0) {
        dispatch(filterByUsernameAsync(username));
      }
      else {
        dispatch(listUsersAsync({page, nonlocked}));
      }
      dispatch(setRefreshRequest(false));
    }
  }, [dispatch, page, nonlocked, users]);

  return (
    <Layout>
      <div>
        {lockButton}
      </div>
      <div>
        <button type='button' onClick={handleCreateUser}>Create user</button>
      </div>
      <div>
        <input type='text' placeholder='Filter by username...' onKeyDown={e => filterByUsernameKeyDown(e)} onChange={e => setSearchParams("username=" + e.target.value)} value={username}></input>
        <button type='button' onClick={handleFilterByUsername}>Filter</button>
      </div>
      {users.errorMessage === null ? null : <div>Unexpected Error has occurred.</div>}
      <div>
        {users.data.map((user) => <User user={user}/>)}
      </div>
      {prePage} {nextPage}
    </Layout>
  );
};

export default UserList;