import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import './styles/Avatar.scss';

const Avatar = () => {
    return (
        <AvatarPrimitive.Root className="avatar-root">
            <AvatarPrimitive.Image
                className="avatar-image"
                src="./TB_Logo.png"
                alt="User Avatar"
            />
            <AvatarPrimitive.Fallback className="avatar-fallback">
                TB
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    );
};

export default Avatar;