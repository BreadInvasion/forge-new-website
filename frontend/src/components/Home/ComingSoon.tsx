import React from 'react';
import { ReactComponent as ForgeSVG } from 'src/assets/img/logo.svg';

import './Home.scss';

const ComingSoon = () => {

    return (
        <div className='cs-container'>
            <ForgeSVG className='cs-logo'/>
            <h1>Coming Soon!</h1>
        </div>
    );
};

export default ComingSoon;