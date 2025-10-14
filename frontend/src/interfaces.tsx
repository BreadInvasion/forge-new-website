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
    semester_balance: '',
};

export interface Machine {
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

export interface MachineType {
    id: string;
    name: string;
    resource_slots: number;
    count: number;
    cost: number;
    resource_slot_ids: string[];
    resource_types: string[];
};

export interface MachineGroup {
    id: number;
    name: string;
    machines: string[];
};

export interface MachineUsage {
    semester: string
    time_started: Date
    duration: number
    machine_name: string
    cost: number
};

export interface Resource {
    id: string;
    name: string;
    brand?: string;
    color?: string;
    units: string;
    cost: string;
};

// MachineStatus block
export interface MachineStatus{
    id: string;
    name: string;
    in_use: boolean;
    usage_start: Date;
    usage_duration: number;
    user_id: string;
    maintenance_mode: boolean;
    disabled: boolean;
    failed: boolean;
    failed_at: Date;
}

export interface MachineStatusGroup{
    name: string;
    machines: MachineStatus[];
}

export interface AllMachinesStatusResponse{
    groups: MachineStatusGroup[];
    loners: MachineStatus[];
}


export interface ResourceSlot {
    id: string;
    db_name: string;
    display_name: string;
    resource_ids: string[];
    allow_own_material: boolean;
    allow_empty: boolean;
};