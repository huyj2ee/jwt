import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ChangePassword from './ChangePassword';
import NewUser from './NewUser';
import UserList from './UserList';
import SetPassword from './SetPassword';
import AssignRevokeRole from './AssignRevokeRole';

const App : React.FunctionComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/password' element={<ChangePassword />} />
        <Route path='/user' element={<NewUser />} />
        <Route path='/users' element={<UserList />} />
        <Route path='/setpassword' element={<SetPassword />} />
        <Route path='/roles' element={<AssignRevokeRole />} />
      </Routes>
    </Router>
  );
};

export default App;