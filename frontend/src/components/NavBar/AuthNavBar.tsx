import React, { useEffect, Suspense } from 'react';
import { useResetRecoilState } from 'recoil';
import { userNameState, userState } from 'src/GlobalAtoms';
import { User } from 'src/interfaces';
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';
import { CaretDownIcon } from '@radix-ui/react-icons';
import * as Avatar from '../MyForge/components/Avatar';
import * as Hamburger from './Hamburger';

import './styles/UserMenu.scss';
import './styles/NavBar.scss';

interface NavBarProps {
    user: User;
    setAuth: (value: boolean) => void;
}

const UserMenu: React.FC<NavBarProps> = ({user, setAuth}) => {

    const setDefaultUser = useResetRecoilState(userState);

    const onSignOut = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expiration');
        setAuth(false);
        setDefaultUser();
    }

    return (
        <NavMenu.Item className='user-item'>
            <NavMenu.Trigger className='user-trigger'>
                <Avatar.default user={user} isNav={true} />
                {user.RCSID} <CaretDownIcon className='caret-down dropdown-spinner' aria-hidden />
            </NavMenu.Trigger>
            <NavMenu.Content className='user-content'>
                <NavMenu.Link className='link' href="/myforge/create">Create</NavMenu.Link>
                <NavMenu.Link className='link' href="/myforge">Summary</NavMenu.Link>
                <NavMenu.Link className='link' href="/myforge/usages">Usages</NavMenu.Link>
                <NavMenu.Link className='link' href="/" onSelect={(e) => onSignOut()}>Logout</NavMenu.Link>
            </NavMenu.Content>
        </NavMenu.Item>
    )
}

export const AuthNavBar: React.FC<NavBarProps> = ({user, setAuth}) => {

    return (
        <NavMenu.Root className='nav-menu-root' delayDuration={1000 /* Prevent closing immediately after opening */}>

            <NavMenu.Link className='logo-link' href="/">
                <ForgeSVG className='forge-logo' />
                <div className='logo-text'>The Forge</div>
            </NavMenu.Link>

            <NavMenu.List className='nav-menu-list'>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Link className='link' href="/status">Status</NavMenu.Link>
                </NavMenu.Item>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Link className='link' href="/hours">Hours</NavMenu.Link>
                </NavMenu.Item>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Link className='link' href="/learn">Wiki</NavMenu.Link>
                </NavMenu.Item>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Link className='link' href="/learn/about">About Us</NavMenu.Link>
                </NavMenu.Item>

                <Hamburger.default />

                <div className='separator horizontal' />

                <UserMenu user={user} setAuth={setAuth}/>

                <NavMenu.Indicator className='indicator'>
                    <div className='arrow' />
                </NavMenu.Indicator>

            </NavMenu.List>
        </NavMenu.Root>
    )
};

