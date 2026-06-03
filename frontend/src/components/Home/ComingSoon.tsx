import React from 'react';
import forgeLogoUrl from '../../assets/img/logo.svg?url';

import './Home.scss';

const ComingSoon = () => {

    return (
        <div className='cs-container'>
            <img className='cs-logo' src={forgeLogoUrl} alt='The Forge logo' />
            <h1>Coming Soon!</h1>
        </div>
    );
};

export default ComingSoon;