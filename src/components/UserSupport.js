import React  from 'react';
import UserSupportForm from './UserSupport/UserSupportForm';
import NodesSelect from './institutionalHierarchy/NodesSelect';
import { ToastContainer } from 'react-toastify';
import { useUserSupportStore } from '../store/userSupportStore';
import TabLeAsignation from './institutionalHierarchy/TabLeAsignation';

const UserSupport = () => {

    const user = useUserSupportStore(state => state.user);
    const asignedNodeList = useUserSupportStore(state => state.asignedNodeList);

  return (
    <>
     <ToastContainer/>
     {Object.keys(user).length == 0 ? <UserSupportForm/> : <NodesSelect/>}
     {asignedNodeList.length >0 && <TabLeAsignation/>}
    </>
  )
}

export default UserSupport