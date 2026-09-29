import { useQuery } from "@tanstack/react-query";
import { fetchMachines } from "src/apis/MachinesAPI";

export function useMachines(refetchInterval?: number) {
    return useQuery({
        queryKey: ["machines"],
        queryFn: fetchMachines,
        initialData: [],
        refetchInterval
    });
}