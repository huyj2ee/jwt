import React from 'react';
import { Link } from 'react-router-dom';

const Home : React.FunctionComponent = () => {
  return (
    <div>
      Home<br />
      <Link to="/password">password</Link><br />
      <Link to="/user">user</Link><br />
      <Link to="/users">users</Link><br />
      <Link to="/setpassword">setpassword</Link><br />
      <Link to="/roles">roles</Link><br />
    </div>
  );
};

export default Home;