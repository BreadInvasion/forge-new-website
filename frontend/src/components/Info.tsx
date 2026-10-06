import React, { Children, PropsWithChildren } from 'react';
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';

import './Home/Home.scss';

export default function Info({children}: PropsWithChildren) {
    return (
        <div className='cs-container'>
            <ForgeSVG className='cs-logo'/>
            {Children.map(children, (child) => child)}
        </div>
    );
};

export const Loading = <Info>Loading...</Info>;