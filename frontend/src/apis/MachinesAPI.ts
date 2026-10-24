import { API } from "./OmniAPI";
import { AllMachinesStatusResponse, Machine, MachineGroup, MachineSchemas, MachineType } from "src/interfaces/machines";

export async function fetchMachines(offset?: number, limit?: number) {
    return await API.get("/machines", {offset, limit}) as Machine[];
}

export async function fetchMachineSchema(machineId: string) {
    return await API.get(`/use/${machineId}/schema`) as MachineSchemas;
}

export async function fetchMachineGroupsPublic() {
    const response = await API.getPublic("/machinestatus");
    const data: AllMachinesStatusResponse = response;
    return [...data.groups.map(g => ({ id: g.machines[0].group_id, name: g.name }))];
}

export async function fetchMachineStatus() {
    const response = await API.getPublic("/machinestatus");
    const data: AllMachinesStatusResponse = response;

    const groups = [...data.groups.map(g => ({ id: g.machines[0].group_id, name: g.name }))];
    const types = [0]; // yeah this is fucked for now
    
    const flattenedMachines = [
        ...data.loners,
        ...data.groups.flatMap((group) => group.machines),
    ];

    const transformedMachines = flattenedMachines.map((machine) => ({
        ...machine,
        group_id: machine.group_id,
        group: machine.group_id ? (groups.find(g => g.id === String(machine.group_id))?.name ?? 'Unknown Group') : 'No Group',
        type_id: machine.type_id,
        type: "Unknown Type",
        id: machine.id,
        name: machine.name,
        in_use: machine.in_use,
        usage_start: machine.usage_start ? new Date(machine.usage_start) : undefined, 
        usage_duration: machine.usage_duration,
        user: (machine as any).user_name ?? machine.user_id,
        maintenance_mode: machine.maintenance_mode,
        disabled: machine.disabled,
        failed: machine.failed,
        failed_at: machine.failed_at ? new Date(machine.failed_at) : undefined,
    }));

    return transformedMachines;
}

export async function clearMachine(machineId: string) {
    return await API.post(`/clear/${machineId}`);
}

export async function failMachine(machineId: string) {
    return await API.post(`/fail/${machineId}`);
}

export async function useMachine({machineId, data}: {
    machineId: string,
    data: Record<string, any>
}) {
    return await API.post(`/use/${machineId}`, data);
}

export async function newEditMachine({id, name, groupId, typeId, maintenance, disabled} : {
    id?: string,
    name: string,
    groupId: string,
    typeId: string,
    maintenance?: boolean,
    disabled?: boolean
}) {
    return await API.post(`/machines/${id ? id : 'new'}`, {
        name,
        group_id: groupId,
        type_id: typeId,
        maintenance_mode: maintenance,
        disabled
    });
}

export async function deleteMachine(id: string) {
    return await API.delete(`/machines/${id}`);
}

export async function fetchMachineTypes(offset?: number, limit?: number) {
    return await API.get('/machinetypes', {offset, limit}) as MachineType[];
}

export async function newEditMachineType({id, name, slots, cost} : {
    id?: string,
    name: string,
    slots: string[],
    cost: number
}) {
    return await API.post(`/machinetypes/${id ? id : 'new'}`, {
        name,
        resource_slot_ids: slots,
        cost_per_hour: cost.toString()
    });
}

export async function deleteMachineType(id: string) {
    return await API.delete(`/machinetypes/${id}`);
}

export async function fetchMachineGroups(offset?: number, limit?: number) {
    return await API.get(`/machinegroups`, {offset, limit}) as MachineGroup[];
}

export async function newEditMachineGroup({id, name, machineIds} : {
    id?: string,
    name: string,
    machineIds: string[]
}) {
    return await API.post(`/machinegroups/${id ? id : 'new'}`, {
        name,
        machine_ids: machineIds,
    });
}

export async function deleteMachineGroup(id: string) {
    return await API.delete(`/machinegroups/${id}`);
}