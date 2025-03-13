import React, { useEffect } from 'react';
import useAuth from '../Auth/useAuth';
import { useResetRecoilState } from 'recoil';
import { User } from 'src/interfaces';
import { userState } from 'src/GlobalAtoms';
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';
import { CaretDownIcon } from '@radix-ui/react-icons';

// import './styles/Avatar.scss';
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
            <NavMenu.Trigger className='user-trigger' >
                {user.RCSID} <CaretDownIcon className='caret-down' aria-hidden />
            </NavMenu.Trigger>
            <NavMenu.Content className='user-content' >
                <NavMenu.Link className='link' href="/myforge">Summary</NavMenu.Link>
                <NavMenu.Link className='link' href="/myforge/usages">Usages</NavMenu.Link>
                <NavMenu.Link className='link' href="/" onSelect={(e) => onSignOut()}>Logout</NavMenu.Link>
            </NavMenu.Content>
        </NavMenu.Item>
    )
}

export const AuthNavBar: React.FC<NavBarProps> = ({user, setAuth}) => {

    return (
        <NavMenu.Root className='nav-menu-root'>

            <NavMenu.Link className='logo-link' href="/">
                <ForgeSVG className='forge-logo' />
                <div className='logo-text'>The Forge</div>
            </NavMenu.Link>

            <NavMenu.List className='nav-menu-list'>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Trigger className='nav-menu-trigger'>
                        Create <CaretDownIcon className='caret-down' aria-hidden />
                    </NavMenu.Trigger>
                    <NavMenu.Content className='nav-menu-content'>
                        <NavMenu.Link className='link' href="/create/3dprint">3D Print</NavMenu.Link>
                        <NavMenu.Link className='link' href="/create/laser">Laser Engrave</NavMenu.Link>
                        <NavMenu.Link className='link' href="/create/sticker">Sticker Print</NavMenu.Link>
                        <NavMenu.Link className='link' href="/create/all">See All Machines</NavMenu.Link>
                    </NavMenu.Content>
                </NavMenu.Item>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Link className='link' href="/status">Status</NavMenu.Link>
                </NavMenu.Item>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Trigger className='nav-menu-trigger' >
                        Learn <CaretDownIcon className='caret-down' aria-hidden />
                    </NavMenu.Trigger>
                    <NavMenu.Content className='nav-menu-content' >
                        <NavMenu.Link className='link' href="/learn/aboutus">About Us</NavMenu.Link>
                        <NavMenu.Link className='link' href="/learn/3d-printing-guide">3D Printing Guide</NavMenu.Link>
                        <NavMenu.Link className='link' href="/learn/laser-engraving-guide">Laser Engraving Guide</NavMenu.Link>
                        <NavMenu.Link className='link' href="/learn/sticker-preparation">Sticker Preparation</NavMenu.Link>
                        <NavMenu.Link className='link' href="/learn/troubleshooting">Troubleshooting</NavMenu.Link>
                    </NavMenu.Content>
                </NavMenu.Item>
                <NavMenu.Item className='list-item'>
                    <NavMenu.Link className='link' href="/hours">Hours</NavMenu.Link>
                </NavMenu.Item>

                <div className='separator horizontal' />

                <UserMenu user={user} setAuth={setAuth}/>

                <NavMenu.Indicator className='indicator'>
                    <div className='arrow' />
                </NavMenu.Indicator>

            </NavMenu.List>



            {/* Need to put User Icon and Dropdown here which replaces the SignInButton after Logged in */}


        </NavMenu.Root>
    )
};

