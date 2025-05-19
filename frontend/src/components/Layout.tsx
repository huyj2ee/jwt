import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { SignedInUser } from '../app/api';
import { refreshTokenAsync, signOutAsync, setErrorMessage } from './user/userSlice';

interface LayoutProperties {
  children?: React.ReactNode;
}

const Layout : React.FunctionComponent<LayoutProperties> = (props: LayoutProperties) => {
  const navigate = useNavigate();
  const user:SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  let usersLink: React.ReactNode = '';
  function handleSignOut () {
    dispatch(signOutAsync());
    navigate('/');
  }
  useEffect(() => {
    if (user.doesRefreshToken === false && user.username === null) {
      dispatch(refreshTokenAsync());
    }
    else if (user.username === null) {
      navigate('/');
    }
  }, [user.username]);
  useEffect(() => {
    dispatch(setErrorMessage(null));
  }, []);
  if (user.roles.includes('admin')) {
    usersLink = <li><Link to='/users'>Users</Link></li>;
  }
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {usersLink}
        </ul>
      </nav>
      <div>
        <ul>
          <li>{user.username}</li>
        </ul>
        <ul>
          <li><Link to='/password'>Change password</Link></li>
        </ul>
        <ul>
          <li><span onClick={handleSignOut}>Sign out</span></li>
        </ul>
      </div>
      {props.children}
    </div>
  );
}

export default Layout;