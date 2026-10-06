export interface Machine {
    id: string;
    name: string;
    group: string;
    group_id: string;
    type: string;
    type_id: string;
    in_use: boolean;
    usage_start?: Date;
    usage_duration?: number;
    user?: string;
    failed?: boolean;
    failed_at?: Date;
    maintenance_mode: boolean;
    disabled: boolean;
};

export const emptyMachine: Machine = {
    id: '_',
    name: '',
    group_id: '',
    type_id: '',
    in_use: false,
    usage_start: undefined,
    usage_duration: undefined,
    user: undefined,
    failed: false,
    failed_at: undefined,
    maintenance_mode: false,
    disabled: false,
};

export interface MachineSchemas {
    [key: string]: any;
}

export interface MachineType {
    id: string;
    name: string;
    resource_slots: number;
    count: number;
    cost_per_hour: number;
    resource_slot_ids: string[];
    resource_types: string[];
};

export interface MachineGroup {
    id: string;
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