import { atom, selector } from 'recoil';
import { User, defaultUser } from './interfaces';


export const userState = atom<User>({
    key: 'userState',
    default: defaultUser,
});

export const userNameState = selector<string>({
    key: 'userNameState',
    get: ({ get }) => {
        const user = get(userState);
        return user.RCSID || '';
    },
});

export const authState = atom<boolean | undefined>({
    key: 'authState',
    default: undefined,
});