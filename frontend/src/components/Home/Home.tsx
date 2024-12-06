import React from 'react';
import { ExclamationTriangleIcon, Component1Icon } from '@radix-ui/react-icons';

import './Home.scss';



export default function Home() {

    return (
        <div className='home-container flex-column-cover'>
            <div className='home-cover flex-column-cover'>
                <h1>Ever wonder what magic feels like? Come to The Forge and find out!</h1>
                <h2>
                    Learn the maker magic behind:
                    <ul>
                        <li>- 3D Printing</li>
                        <li>- Laser Engraving</li>
                        <li>- Sticker Printing</li>
                        <li>- And More!</li>
                    </ul>
                </h2>
                <div className='home-button-container flex-column-cover'>
                    <div className='home-button'>
                        <Component1Icon />
                        <span>Use a Machine</span>
                    </div>
                    <div className='home-button'>
                        <ExclamationTriangleIcon />
                        <span>Machine Status</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
