import React, { ReactNode, useEffect } from 'react';
import Layout from './Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { listUsersAsync } from './users/usersSlice';
import { SignedInUser, UserItem, UsersStore } from '../app/api';

const User : React.FunctionComponent<{user: UserItem}> = ({user}) => {
  function unlock(username: string):void {
    alert('unlock ' + username);
  }

  function setEnabled(username: string, enabled: boolean):void {
    if (enabled) {
      alert('enable ' + username);
    }
    else {
      alert('disable ' + username);
    }
  }

  function setPassword(username: string):void {
    alert('setPassword ' + username);
  }

  function setRoles(username: string):void {
    alert('setRoles ' + username);
  }

  function deleteUser(username: string):void {
    alert('deleteUser ' + username);
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
      <span onClick={() => deleteUser(user.username)}>delete</span>
    </div>
  );
};

const UserList : React.FunctionComponent = () => {
  const user:SignedInUser = useSelector((state: RootState) => state.user);
  const users:UsersStore = useSelector((state: RootState) => state.users);
  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageStr:string = searchParams.get("page");
  const page:number = pageStr === null ? 0 : parseInt(pageStr);
  const prePage:ReactNode = page > 0 ?
    <span onClick={() => setSearchParams("page=" + (page - 1))}>&lt;</span> :
    <span>&lt;</span>;
  const nextPage:ReactNode = page < users.count - 1 ?
    <span onClick={() => setSearchParams("page=" + (page + 1))}>&gt;</span> :
    <span>&gt;</span>;

  function handleCreateUser() {
    navigate('/user');
  }

  useEffect(()=>{
    if (user.username !== null) {
      dispatch(listUsersAsync(page));
    }
  }, [dispatch, page, user]);

  return (
    <Layout>
      <div>
        <button type='button' onClick={handleCreateUser}>Create user</button>
      </div>
      <div>
        {users.data.map((user) => <User user={user}/>)}
      </div>
      {prePage} {nextPage}
    </Layout>
  );
};

export default UserList;