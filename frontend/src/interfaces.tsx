// src/interfaces.ts
import { UserPermission } from "./enums";

export interface User {
    id: string;
    is_rpi_staff: boolean;
    RCSID: string;
    RIN: string;
    first_name: string;
    last_name: string;
    major?: string;
    gender_identity: string;
    pronouns: string;
    permissions: UserPermission[];
    display_role: string;
    is_graduating: boolean;
    checked_graduating: string | null;
    is_email_verified: boolean;
    semester_balance: string;
};

export const defaultUser: User = {
    id: '',
    is_rpi_staff: false,
    RCSID: '',
    RIN: '',
    first_name: '',
    last_name: '',
    major: '',
    gender_identity: "notdisclosed",
    pronouns: '',
    permissions: [],
    display_role: '',
    is_graduating: false,
    checked_graduating: null,
    is_email_verified: false,
    semester_balance: '',
};

export interface UserCharge {
    RIN: string;
    first_name: string;
    last_name: string;
    semester_balance: string | number;
    is_graduating: boolean;
}

export interface Resource {
    id: string;
    name: string;
    brand?: string;
    color?: string;
    units: string;
    cost: number;
};

export interface Semester {
    id: string;
    semester_type: number | string;
    calendar_year: number;
}

export interface Role {
    id: string;
    name: string;
    permissions: UserPermission[];
    inverse_permissions: UserPermission[];
    display_role: boolean;
    priority: number;
}

export interface ResourceSlot {
    id: string;
    name: string;
    db_name: string; // this NEEDS to be changed
    display_name: string;
    valid_resource_ids: string[];
    allow_own_material: boolean;
    allow_empty: boolean;
};