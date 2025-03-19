import React from 'react';
import useAuth from '../../Auth/useAuth';
import { Link } from 'react-router-dom';
// import * as Avatar from '@radix-ui/react-avatar';
import * as Avatar from './Avatar';

import '../styles/UserMenu.scss';

const UserMenu: React.FC = () => {

    const { user } = useAuth();

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
                <h3>EBoard Member</h3>
            </div>
            <div className="divider" />
            <nav className='options-container'>
                <ul className='user-options member'>
                    <li><Link to='/myforge/summary' className='btn'>Summary</Link></li>
                    <li><Link to='/myforge/create' className='btn'>Use a Machine</Link></li>
                    <li><Link to='/myforge/usages' className='btn'>Usages</Link></li>
                    {/* <button className="btn">Inventory</button> */}
                </ul>
                <hr className='divider' />
                <ul className='user-options volunteer'>
                    <li><Link to='/myforge/failure_form' className='btn'>Failure Form</Link></li>
                </ul>
                <hr className='divider' />
                <ul className='user-options manager'>
                    <li><Link to='/myforge/machine_types' className='btn'>Machine Types</Link></li>
                    <li><Link to='/myforge/machine_groups' className='btn'>Machine Groups</Link></li>
                    <li><Link to='/myforge/machines' className='btn'>Machines</Link></li>
                    <li><Link to='/myforge/resources' className='btn'>Resources</Link></li>
                    <li><Link to='/myforge/users' className='btn'>Users</Link></li>
                </ul>
                <hr className='divider' />
                <ul className='user-options eboard'>
                    <li><Link to='/myforge/semesters' className='btn'>Semesters</Link></li>
                    <li><Link to='/myforge/charge_sheets' className='btn'>Charge Sheets</Link></li>
                    <li><Link to='/myforge/change_config' className='btn'>Change Configuration</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default UserMenu;