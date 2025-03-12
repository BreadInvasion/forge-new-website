// src/interfaces.ts

export interface User extends Record<string, any> {
    id: string;
    is_rpi_staff: boolean;
    RCSID: string;
    RIN: string;
    first_name: string;
    last_name: string;
    major?: string;
    gender_identity: string;
    pronouns: string;
    role_ids: string[];
    is_graduating: boolean;
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
    role_ids: [],
    is_graduating: false,
    semester_balance: '',
};

export interface Machine extends Record<string, any> {
    id: string;
    name: string;
    group: string;
    group_id: string;
    type: string;
    type_id: string;
    maintenance_mode: boolean;
    disabled: boolean;
};

export const emptyMachine: Machine = {
    id: '_',
    name: '',
    group: '',
    group_id: '',
    type: '',
    type_id: '',
    maintenance_mode: false,
    disabled: false,
};

export interface MachineType extends Record<string, any> {
    id: string;
    name: string;
    resource_slots: number;
    count: number;
    resource_slot_ids: string[];
    resource_types: string[];
};

export interface MachineGroup extends Record<string, any> {
    id: number;
    name: string;
    machines: string[];
};

export interface MachineUsage extends Record<string, any> {
    id: number;
    machine_id: number;
    machine_name: string;
    semester_id: number;
    semester: string;
    user_id: number;
    cost: number;
    time_started: Date;
    duration: number;
    failed: boolean;
    failed_at?: Date;
    notes: number;
    resources: string[];
};

export interface Resource extends Record<string, any> {
    id: string;
    name: string;
    resource_slots: number;
    count: number;
    resource_slot_ids: string[];
    resource_types: string[];
};
