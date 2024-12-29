import React from 'react';
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';
import { CaretDownIcon } from '@radix-ui/react-icons';

// import './styles/Avatar.scss';
import './styles/UserMenu.scss';
import './styles/NavBar.scss';

export const NavBar: React.FC = () => {

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

                <NavMenu.Item className='sign-in-button'>
                    <NavMenu.Link className='link' href="/login">Sign In</NavMenu.Link>
                </NavMenu.Item>

                <NavMenu.Indicator className='indicator'>
                    <div className='arrow' />
                </NavMenu.Indicator>

            </NavMenu.List>



            {/* Need to put User Icon and Dropdown here which replaces the SignInButton after Logged in */}


        </NavMenu.Root>
    )
};

