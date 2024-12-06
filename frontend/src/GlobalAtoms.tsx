import { atom, selector } from 'recoil';

export interface UserInterface {
    id: string
    is_rpi_staff: boolean
    RCSID: string
    RIN: string
    first_name: string
    last_name: string
    major: string
    gender_identity: number
    pronouns: string
    role_ids: string[]
    is_graduating: boolean
};

export const defaultUser: UserInterface = {
    id: '',
    is_rpi_staff: false,
    RCSID: '',
    RIN: '',
    first_name: '',
    last_name: '',
    major: '',
    gender_identity: 0,
    pronouns: '',
    role_ids: [],
    is_graduating: false
};

export const userState = atom<UserInterface>({
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