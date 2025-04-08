import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { User } from '../app/api';
import { signOutAsync } from './user/userSlice';

interface LayoutProperties {
  children?: React.ReactNode;
}

const Layout : React.FunctionComponent<LayoutProperties> = (props: LayoutProperties) => {
  const navigate = useNavigate();
  const user:User = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  function handleSignOut() {
    dispatch(signOutAsync(user.accessToken));
    navigate('/');
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/users'>Users</Link>
          </li>
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