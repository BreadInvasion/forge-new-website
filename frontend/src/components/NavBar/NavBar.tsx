import React from 'react';
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';
import * as Hamburger from './Hamburger';

// import './styles/Avatar.scss';
import './styles/UserMenu.scss';
import './styles/NavBar.scss';

export const NavBar: React.FC = () => {

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

                <NavMenu.Item className='sign-in-button'>
                    <NavMenu.Link className='link' href="/login">Sign In</NavMenu.Link>
                </NavMenu.Item>

                <NavMenu.Indicator className='indicator'>
                    <div className='arrow' />
                </NavMenu.Indicator>

            </NavMenu.List>
        </NavMenu.Root>
    )
};

