import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store'
import { User } from '../app/api';

interface LayoutProperties {
  children?: React.ReactNode;
}

const Layout : React.FunctionComponent<LayoutProperties> = (props: LayoutProperties) => {
  const user:User = useSelector((state: RootState) => state.user);
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
          <li><span>Sign out</span></li>
        </ul>
      </div>
      {props.children}
    </div>
  );
}

export default Layout;