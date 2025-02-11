import * as React from "react";
import * as NavMenu from "@radix-ui/react-navigation-menu";
import { HamburgerMenuIcon } from '@radix-ui/react-icons';


const Hamburger: React.FC = () => {
    return (
        <NavMenu.Item className='user-item'>
            <NavMenu.Trigger className='user-trigger'>
                <HamburgerMenuIcon className='hamburger-icon dropdown-spinner' aria-hidden/>
            </NavMenu.Trigger>
            <NavMenu.Content className='user-content' >
                <NavMenu.Link className='link' href="/status">Status</NavMenu.Link>
                <NavMenu.Link className='link' href="/hours">Hours</NavMenu.Link>
                <NavMenu.Link className='link' href="/learn">Wiki</NavMenu.Link>
                <NavMenu.Link className='link' href="/learn/aboutus">About Us</NavMenu.Link>
            </NavMenu.Content>
        </NavMenu.Item>
    );
}

export default Hamburger;