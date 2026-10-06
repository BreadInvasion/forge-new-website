import { AllMachinesStatusResponse } from "src/interfaces";
import { get, getPublic, post } from "./OmniAPI";
import { Machine, MachineSchemas } from "src/interfaces/machines";

export async function fetchMachines() {
    return await get("/machines") as Machine[];
}

export async function fetchMachineSchema(machineId: string) {
    return await get(`/use/${machineId}/schema`) as MachineSchemas;
}

export async function fetchMachineStatus() {
    const response = await getPublic("/machinestatus");
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
    return await post(`/clear/${machineId}`);
}

type UseMachineArgs = {
    machineId: string,
    data: Record<string, any>
}
export async function useMachine({machineId, data}: UseMachineArgs) {
    return await post(`/use/${machineId}`, data)
}