import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import styled from 'styled-components';

const AvatarRoot = styled(AvatarPrimitive.Root)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    overflow: hidden;
    width: 40px;
    height: 40px;
`;

const AvatarImage = styled(AvatarPrimitive.Image)`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
`;

const AvatarFallback = styled(AvatarPrimitive.Fallback)`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ccc;
    color: #fff;
    font-size: 1.5rem;
    line-height: 1;
    font-weight: bold;
`;

const Avatar = () => {
    return (
        <AvatarRoot className="avatar-root">
            <AvatarImage
                className="avatar-image"
                src="./TB_Logo.png"
                alt="User Avatar"
            />
            <AvatarFallback className="avatar-fallback">
                TB
            </AvatarFallback>
        </AvatarRoot>
    );
};

export default Avatar;