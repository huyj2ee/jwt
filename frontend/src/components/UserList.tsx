import React from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

const UserList : React.FunctionComponent = () => {
  const navigate = useNavigate();
  function handleCreateUser() {
    navigate('/user');
  }

  return (
    <Layout>
      <div>
        <button type='button' onClick={handleCreateUser}>Create user</button>
      </div>
      <div>
        User list
      </div>
    </Layout>
  );
};

export default UserList;