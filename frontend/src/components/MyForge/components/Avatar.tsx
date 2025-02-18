import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { User } from 'src/interfaces';

interface AvatarData {
    user: User;
    isNav: boolean;
}

const Avatar : React.FC<AvatarData> = ({user, isNav}) => {
    var navstr:string = "";
    if (isNav) {
        navstr = "nav-"
    }
    var fname:string = "" + user.first_name;
    var lname:string = "" + user.last_name;
    return (
        <AvatarPrimitive.Root className={navstr + "avatar-root"}>
            <AvatarPrimitive.Fallback className={navstr + "avatar-fallback"}>
                {fname[0] + lname[0]}
            </AvatarPrimitive.Fallback>
            <AvatarPrimitive.Image
                className={navstr + "avatar-image"}
                src="/TB_Logo.png" // replace this with user avatar later
                alt="User Avatar"
            />
        </AvatarPrimitive.Root>
    );
};

export default Avatar;