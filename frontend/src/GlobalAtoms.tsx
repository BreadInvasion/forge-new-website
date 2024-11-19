import { atom, selector } from 'recoil';

interface UserInterface {
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
}

export const userState = atom<UserInterface>({
    key: 'userState',
    default: {
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
    }
});