import * as React from "react";
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

interface HamburgerProps {
    showAdmin?: boolean;
}

const Hamburger: React.FC<HamburgerProps> = ({ showAdmin = false }) => {
    return (
        <NavMenu.Item className='user-item'>
            <NavMenu.Trigger className='user-trigger'>
                <HamburgerMenuIcon className='hamburger-icon dropdown-spinner' aria-hidden/>
            </NavMenu.Trigger>
            <NavMenu.Content className='user-content' >
                <NavMenu.Link className='link' href="/getting-started">Create</NavMenu.Link>
                <NavMenu.Link className='link' href="/status">Status</NavMenu.Link>
                <NavMenu.Link className='link' href="/hours">Hours</NavMenu.Link>
                <NavMenu.Link className='link' href="/faq/etiquette">Etiquette</NavMenu.Link>
                <NavMenu.Link className='link' href="/faq/materials">Materials</NavMenu.Link>
                <NavMenu.Link className='link' href="/faq/about">About Us</NavMenu.Link>
                {showAdmin && (
                    <NavMenu.Link className='link' href="/admin">Admin</NavMenu.Link>
                )}
            </NavMenu.Content>
        </NavMenu.Item>
    );
}

export default Hamburger;