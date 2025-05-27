import React, { ChangeEvent, useEffect } from 'react';
import Layout from './Layout';
import { Link, useSearchParams } from 'react-router-dom';
import { RolesStore } from '../app/api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { assignRevokeRoleAsync, getAllRolesAsync, getAssignedRolesAsync } from './roles/rolesSlice';

const Roles : React.FunctionComponent<{roles: RolesStore}> = ({roles}: {roles: RolesStore}) => {
  const dispatch:AppDispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const usernameObj:string = searchParams.get("username");
  const username:string = usernameObj === null ? '' : usernameObj;

  function assignRevokeRole(e: ChangeEvent<HTMLInputElement>, role: string) {
    const isAssigned:boolean = e.target.checked;
    dispatch(assignRevokeRoleAsync({username, role, isAssigned}));
  }
  return (
    <>
      {
        roles.roles === null || roles.assignedRoles === null ? '' :
        roles.roles.map(
          (role) =>
            <div>
              <label htmlFor={role}>{role}</label>
              <input
                id={role}
                type='checkbox'
                checked={roles.assignedRoles.includes(role)}
                onChange={(e) => assignRevokeRole(e, role)}
              />
            </div>
        )
      }
    </>
  );
}

const AssignRevokeRole : React.FunctionComponent = () => {
  const roles:RolesStore = useSelector((state: RootState) => state.roles);
  const dispatch:AppDispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const usernameObj:string = searchParams.get("username");
  const username:string = usernameObj === null ? '' : usernameObj;

  useEffect(()=>{
    if (roles.roles === null) {
      dispatch(getAllRolesAsync());
    }
    if (roles.assignedRoles === null) {
      dispatch(getAssignedRolesAsync(username));
    }
  }, [dispatch, roles]);

  return (
    <Layout>
      {username} roles
      <Roles roles={roles}/>
      {roles.errorMessage === null ? null : <div>Unexpected Error has occurred.</div>}
      <Link to="/users">Back</Link>
    </Layout>
  );
};

export default AssignRevokeRole;