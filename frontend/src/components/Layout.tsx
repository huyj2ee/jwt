import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { SignedInUser } from '../app/api';
import { refreshTokenAsync, signOutAsync, setErrorMessage } from './user/userSlice';
import { listUsersAsync } from './users/usersSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faHouseChimney, faSortDown, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorage } from 'react-use';

interface LayoutProperties {
  children?: React.ReactNode;
}

const Body : React.FunctionComponent<LayoutProperties> = (props: LayoutProperties) => {
  const [navExpanded, setNavExpanded] = useLocalStorage('navExpanded', false);
  const user:SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  let homeStyle = location.pathname === '/' ? {background: 'black'} : {};
  let usersStyle = ['/user', '/users', '/roles', '/setpassword'].includes(location.pathname) ? {background: 'black'} : {};
  let usersLink: React.ReactNode = '';
  if (user.roles.includes('admin')) {
    function handleUsersLink() {
      dispatch(listUsersAsync({page: 0, nonlocked: true}));
    }
    usersLink = (
      <li style={usersStyle} className='hover:bg-black [&:hover>a>span]:flex [&:hover>a>svg]:text-[#ffffff] [&:hover>a>span]:text-[#ffffff] [&:hover>a>span]:font-medium'>
        <Link to='/users' onClick={handleUsersLink} className='relative flex items-center'>
          <FontAwesomeIcon icon={faUsers} style={{width: '34px', height: '34px'}} className='m-[8px] text-[#d9d9d9]' />
          {
            navExpanded ?
            <span className='ml-[26px] h-full w-[124px] text-[#d9d9d9] text-[16px]'>
              Users
            </span> :
            <span className='absolute left-full top-0 hidden items-center bg-black pl-[26px] h-full w-[124px] text-white text-[16px] font-medium'>Users</span>
          }
        </Link>
      </li>
    );
  }
  return navExpanded ?
  (
    <div className='relative w-full h-full flex'>
      <nav className='absolute w-[200px] top-0 bottom-0 min-h-[calc(100vh-50px)] bg-[#747474]'>
        <ul className='absolute top-0 left-0'>
          <li style={homeStyle} className='hover:bg-black [&:hover>a>svg]:text-[#ffffff] [&:hover>a>span]:text-[#ffffff] [&:hover>a>span]:font-medium'>
            <Link to='/' className='flex items-center'>
              <FontAwesomeIcon icon={faHouseChimney} style={{width: '34px', height: '34px'}} className='m-[8px] text-[#d9d9d9]' />
              <span className='ml-[26px] h-full w-[124px] text-[#d9d9d9] text-[16px]'>
                Home
              </span>
            </Link>
          </li>
          {usersLink}
        </ul>
        <ul className='absolute left-0 bottom-0 w-full'>
          <div className='w-full h-[1px] mb-[2px] bg-black'/>
          <li className='flex items-center justify-end [&:hover>div]:font-medium [&:hover>div>svg]:text-[#ffffff] cursor-pointer' onClick={(e)=>{setNavExpanded(false)}}>
            <div className='text-[#fafafa] text-[16px]'>Collapse menu</div>
            <div className='w-[34px] h-[34px] m-[8px] rounded-[17px] bg-black flex items-center justify-center'>
              <FontAwesomeIcon icon={faAnglesLeft} style={{width: '19px', height: '16px'}} className='mr-[1px] text-[#0099cc]'/>
            </div>
          </li>
        </ul>
      </nav>
      <main className='ml-[200px] min-w-[calc(100vw-200px)] min-h-[calc(100vh-50px)]'>
        {props.children}
      </main>
    </div>
  ) :
  (
    <div className='relative w-full h-full flex'>
      <nav className='absolute w-[50px] top-0  bottom-0 min-h-[calc(100vh-50px)] bg-[#747474]'>
        <ul className='absolute top-0 left-0'>
          <li style={homeStyle} className='hover:bg-black [&:hover>a>span]:flex [&:hover>a>svg]:text-[#ffffff]'>
            <Link to='/' className='relative flex items-center'>
              <FontAwesomeIcon icon={faHouseChimney} style={{width: '34px', height: '34px'}} className='m-[8px] text-[#d9d9d9]' />
              <span className='absolute left-full top-0 hidden items-center bg-black pl-[26px] h-full w-[124px] text-white text-[16px] font-medium'>Home</span>
            </Link>
          </li>
          {usersLink}
        </ul>
        <ul className='absolute left-0 bottom-0 w-full'>
          <div className='w-full h-[1px] mb-[2px] bg-black'/>
          <li className='flex items-center [&:hover>div>svg]:text-[#ffffff]' onClick={(e)=>{setNavExpanded(true)}}>
            <div className='w-[34px] h-[34px] m-[8px] rounded-[17px] bg-black flex items-center justify-center cursor-pointer'>
              <FontAwesomeIcon icon={faAnglesRight} style={{width: '19px', height: '16px'}} className='text-[#0099cc]'/>
            </div>
          </li>
        </ul>
      </nav>
      <main className='ml-[50px] min-w-[calc(100vw-50px)] min-h-[calc(100vh-50px)]'>
        {props.children}
      </main>
    </div>
  );
}

const Layout : React.FunctionComponent<LayoutProperties> = (props: LayoutProperties) => {
  const navigate = useNavigate();
  const user:SignedInUser = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
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
  return (
    <div className='w-max'>
      <header className='flex items-center justify-between pl-[5px] bg-[#eeeeee] w-full h-[50px]'>
        <Link to='/'>
          <img src='/imgs/logo.png' alt='logo'/>
        </Link>
        <div className='relative [&:hover>ul]:block h-[50px] flex items-center z-10'>
          <div>
            <FontAwesomeIcon icon={faUser} style={{width: '34px', height: '34px'}}/>
            <FontAwesomeIcon icon={faSortDown} style={{width: '34px', height: '34px'}}/>
          </div>
          <ul className='absolute hidden w-[180px] bg-[#ffffff] top-full right-0'>
            <li className='w-full h-[50px] bg-[#d9d9d9] flex items-center justify-end pr-[20px]'>{user.username}</li>
            <li className='w-full h-[50px] bg-[#d9d9d9] flex items-center justify-end pr-[20px] mt-[1px]'><Link to='/password'>Change password</Link></li>
            <li className='w-full h-[50px] bg-[#d9d9d9] flex items-center justify-end pr-[20px] mt-[1px] cursor-pointer'><span onClick={handleSignOut}>Sign out</span></li>
          </ul>
        </div>
      </header>
      <Body>
        {props.children}
      </Body>
    </div>
  );
}

export default Layout;