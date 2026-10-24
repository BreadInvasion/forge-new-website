import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clearMachine, newEditMachineType, failMachine, fetchMachineGroupsPublic, fetchMachines, fetchMachineSchema, fetchMachineStatus, useMachine, fetchMachineTypes, deleteMachineType, fetchMachineGroups, newEditMachineGroup, deleteMachineGroup} from "src/apis/MachinesAPI";

export function useMachines() {
    return useQuery({
        queryKey: ["machines"],
        queryFn: fetchMachines,
        initialData: [],
    });
}

export function useMachineSchema(machineId?: string) {
    return useQuery({
        queryKey: ["machine", "schema", machineId],
        queryFn: () => fetchMachineSchema(machineId!),
        initialData: undefined,
        enabled: machineId !== '0'
    })
}

export function useMachineGroupsPublic() {
    return useQuery({
        queryKey: ["machine", "status", "groups", "public"],
        queryFn: fetchMachineGroupsPublic,
        initialData: []
    })
}

export function useMachineStatus(refetchInterval?: number) {
    return useQuery({
        queryKey: ["machine", "status"],
        queryFn: fetchMachineStatus,
        initialData: [],
        refetchInterval
    });
}

export function useMachineClear() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearMachine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["machine", "status"] });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                alert(error.response?.status);
                switch (error.response?.status) {
                    case 404:
                        alert('Machine not found. Please check the machine ID.');
                        break;
                    case 403:
                        alert('Error, not authenticated. Must be logged in to clear machines.');
                        break;
                    default:
                        alert(`Failed to clear machine: ${error.response?.statusText}`);
                        break;
                }
            } else {
                alert(`Failed to clear machine: ${error.message}`);
            }
        }
    });
}

export function useMachineFail() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: failMachine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["machine", "status"] });
            navigate('/status');
        },
        onError: (error) => {
            console.error(error);
            alert("An error occurred, please try again.");
        }
    })
}

export function useMachineUse() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: useMachine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["machine", "status"] });
            navigate('/status');
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 409:
                        alert('This machine is already in use. Please clear it before submitting a new usage.');
                        break;
                    case 404:
                        alert('The selected machine does not exist.');
                        break;
                    case 403:
                        alert('You are not permitted to use this machine.');
                        break;
                    default:
                        console.error(error);
                        alert(`An error occurred. Please try again.`);
                        break;
                }
            } else {
                alert(`Failed to use machine: ${error.message}`);
            }
        },
    });
}

export function useMachineTypes({pageIndex, pageSize}: PaginationState) {
    return useQuery({
        queryKey: ["machine", "type", pageSize, pageIndex],
        queryFn: async () => await fetchMachineTypes(pageIndex*pageSize, pageSize),
        placeholderData: keepPreviousData,
        initialData: []
    })
}

export function useMachineTypesLength() {
    return useQuery({
        queryKey: ["machine", "type"],
        queryFn: async () => (await fetchMachineTypes()).length,
    })
}

export function useMachineTypeNewEdit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: newEditMachineType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["machine", "type"] });
        },
        onError: (error, {id}) => {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 422:
                        alert('Validation Failed.');
                        break;
                    default:
                        console.error(error);
                        alert(`An error occurred. Please try again.`);
                        break;
                }
            } else {
                alert(`Failed to ${id ? 'edit' : 'create'} machine type: ${error.message}`);
            }
        }
    });
}

export function useMachineTypeDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMachineType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["machine", "type"] });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 422:
                        alert('Validation Failed.');
                        break;
                    default:
                        console.error(error);
                        alert(`An error occurred. Please try again.`);
                        break;
                }
            } else {
                alert(`Failed to delete machine type: ${error.message}`);
            }
        }
    });
}

export function useMachineGroups({pageIndex, pageSize}: PaginationState) {
    return useQuery({
        queryKey: ['machine', 'group', pageSize, pageIndex],
        queryFn: async () => {
            const [groups, machines] = await Promise.all([
                await fetchMachineGroups(pageIndex*pageSize, pageSize),
                await fetchMachines()
            ]);
            const mappings = machines.reduce((pre, m) => ({
                ...pre,
                [m.id]: m.name
            }), {} as Record<string, string>);
            return groups.map(g => ({
                ...g,
                machines: g.machine_ids.map(id => ({
                    id,
                    name: mappings[id]
                })),
                machine_names: g.machine_ids.map(id => mappings[id])
            }));
        },
        placeholderData: keepPreviousData,
        initialData: []
    });
}

export function useMachineGroupsLength() {
    return useQuery({
        queryKey: ["machine", "group"],
        queryFn: async () => (await fetchMachineGroups()).length,
    })
}

export function useMachineGroupNewEdit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: newEditMachineGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["machine", "group"] });
        },
        onError: (error, {id}) => {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 422:
                        alert('Validation Failed.');
                        break;
                    default:
                        console.error(error);
                        alert(`An error occurred. Please try again.`);
                        break;
                }
            } else {
                alert(`Failed to ${id ? 'edit' : 'create'} machine group: ${error.message}`);
            }
        }
    });
}

export function useMachineGroupDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMachineGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["machine", "group"] });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 422:
                        alert('Validation Failed.');
                        break;
                    default:
                        console.error(error);
                        alert(`An error occurred. Please try again.`);
                        break;
                }
            } else {
                alert(`Failed to delete machine group: ${error.message}`);
            }
        }
    });
}