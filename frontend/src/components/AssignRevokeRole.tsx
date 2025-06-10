import React, { ChangeEvent, useEffect } from 'react';
import Layout from './Layout';
import { Link, useSearchParams } from 'react-router-dom';
import { RolesStore } from '../app/api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { assignRevokeRoleAsync, getAllRolesAsync, getAssignedRolesAsync } from './roles/rolesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

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
            <div className='h-[24px]'>
              <label className='min-w-[406px] inline-block' htmlFor={role}>{role}</label>
              <input
                className='cursor-pointer'
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
    dispatch(getAssignedRolesAsync(username));
  }, []);

  return (
    <Layout>
`      <div className='flex justify-center items-center h-[calc(100%-50px)] w-full'>
        <div className='box-content relative w-[524px] bg-[#eeeeee] border-[#999999] border-[1px] rounded-tl-[10px] rounded-tr-[10px]'>
          <div className='flex items-center justify-center w-[524px] h-[55px] bg-[#d9d9d9] border-[#999999] border-b-[1px] rounded-tl-[10px] rounded-tr-[10px] text-[24px]'>
            {username} roles
          </div>
          <div className='flex justify-center items-center mt-[20px]'>
            <div>
              <Roles roles={roles}/>
            </div>
          </div>
          {roles.errorMessage === null ? null : (
            <div className='flex items-center w-[418px] h-[32px] mt-[11px] mb-[32px] ml-[53px] bg-[#f9e4dd] text-[#6c0101]'>
              <FontAwesomeIcon className='ml-[11px] mr-[13px] w-[15px] h-[17px] text-[#db2f2f]' icon={faTriangleExclamation}/> Unexpected Error has occurred.
            </div>
          )}
          <div className='flex items-center justify-end w-[524px] h-[55px] mt-[25px] bg-[#fafafa] border-[#999999] border-t-[1px]'>
            <Link className='w-[56px] h-[34px] mr-[53px] bg-[#0099cc] rounded-[6px] text-white flex items-center justify-center' to="/users">Back</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignRevokeRole;