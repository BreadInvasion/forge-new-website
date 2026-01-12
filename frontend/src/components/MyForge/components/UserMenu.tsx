import React from 'react';
import useAuth from '../../Auth/useAuth';
import { Link } from 'react-router-dom';
import * as Avatar from './Avatar';
import { UserPermission } from "../../../enums";

import '../styles/UserMenu.scss';

const UserMenu: React.FC = () => {

    const { user } = useAuth();

    const hasPermission = (permission: UserPermission) => user.permissions.includes(permission) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    return (
    <div className="sidebar">
            {/* Avatar should be able to be outlined based on user type 
                - if user is a volunteer, avatar should have a green border
                - is user is a room manager, avatar should have a gold border
                - if user is eboard, avatar should have a purple border
            */}
            <div className='user-summary'>
                <Avatar.default 
                    user = {user}
                    isNav = {false}
                />
                <h2>{user.first_name} {user.last_name}</h2>
                <h3>{user.display_role}</h3>
            </div>
            <div className="divider" />
            <nav className='options-container'>
                <ul className='user-options member'>
                    <li><Link to='/myforge/summary' className='btn'>Summary</Link></li>
                    { (hasPermission(UserPermission.CAN_USE_MACHINES) || hasPermission(UserPermission.CAN_USE_MACHINES_BETWEEN_SEMESTERS)) && (
                        <li><Link to='/myforge/create' className='btn'>Use a Machine</Link></li>
                    )}
                    <li><Link to='/myforge/usages' className='btn'>Usages</Link></li>
                </ul>
                { hasPermission(UserPermission.CAN_FAIL_MACHINES) && (
                    <hr className='divider' />
                )}
                { hasPermission(UserPermission.CAN_FAIL_MACHINES) && (
                    <ul className='user-options volunteer'>
                        <li><Link to='/myforge/fail' className='btn'>Failure Form</Link></li>
                    </ul>   
                )}
                { (hasPermission(UserPermission.CAN_SEE_MACHINE_TYPES) || hasPermission(UserPermission.CAN_SEE_MACHINE_GROUPS) || hasPermission(UserPermission.CAN_SEE_MACHINES) || hasPermission(UserPermission.CAN_SEE_RESOURCES) || hasPermission(UserPermission.CAN_SEE_USERS)) && (
                    <hr className='divider' />
                )}
                <ul className='user-options manager'>
                    { hasPermission(UserPermission.CAN_SEE_MACHINE_TYPES) && (
                        <li><Link to='/myforge/machine_types' className='btn'>Machine Types</Link></li>
                    )}
                    { hasPermission(UserPermission.CAN_SEE_MACHINE_GROUPS) && (
                        <li><Link to='/myforge/machine_groups' className='btn'>Machine Groups</Link></li>
                    )}
                    { hasPermission(UserPermission.CAN_SEE_MACHINES) && (
                        <li><Link to='/myforge/machines' className='btn'>Machines</Link></li>
                    )}
                    { hasPermission(UserPermission.CAN_SEE_RESOURCES) && (
                        <li><Link to='/myforge/resources' className='btn'>Resources</Link></li>
                    )}
                    { hasPermission(UserPermission.CAN_SEE_USERS) && (
                        <li><Link to='/myforge/users' className='btn'>Users</Link></li>
                    )}
                </ul>
                { (hasPermission(UserPermission.CAN_SEE_SEMESTERS) || hasPermission(UserPermission.CAN_GET_CHARGES)) && (
                    <hr className='divider' />
                )}
                <ul className='user-options eboard'>
                    { hasPermission(UserPermission.CAN_SEE_SEMESTERS) && (
                        <li><Link to='/myforge/semesters' className='btn'>Semesters</Link></li>
                    )}
                    { hasPermission(UserPermission.CAN_GET_CHARGES) && (
                        <li><Link to='/myforge/charge_sheets' className='btn'>Charge Sheets</Link></li>
                    )}
                    { hasPermission(UserPermission.IS_SUPERUSER) && (
                        <li><Link to='/myforge/change_config' className='btn'>Change Configuration</Link></li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default UserMenu;