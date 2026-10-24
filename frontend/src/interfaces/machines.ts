export interface Machine {
    id: string;
    name: string;
    group_name: string;
    group_id: string;
    type_name: string;
    type_id: string;
    active_usage_id?: string;
    maintenance_mode: boolean;
    disabled: boolean;
};

export interface MachineSchemas {
    [key: string]: any;
}

export interface MachineType {
    id: string;
    name: string;
    num_machines: number;
    resource_names: string[];
    resource_slot_ids: string[];
    resource_slot_names: string[];
    cost_per_hour: number;
};

export interface MachineGroup {
    id: string;
    name: string;
    machine_ids: string[];
    machine_names: string[];
};

export interface MachineUsage {
    semester: string
    time_started: Date
    duration: number
    machine_name: string
    cost: number
};

// MachineStatus block
export interface MachineStatus{
    id: string;
    group_id: string;
    type_id: string;
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