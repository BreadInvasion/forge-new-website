import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { clearMachine, fetchMachines, fetchMachineSchema, fetchMachineStatus, useMachine } from "src/apis/MachinesAPI";

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
            }
            alert(`Failed to clear machine: ${error.message}`);
        }
    });
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
                alert(error.response?.status);
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
            }
            alert(`Failed to use machine: ${error.message}`);
        },
        
    });
}