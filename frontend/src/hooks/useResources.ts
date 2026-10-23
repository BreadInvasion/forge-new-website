import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchResourceSlots } from "src/apis/ResourcesAPI";

export function useResourceSlots() {
    return useQuery({
        queryKey: ['resource', 'slots'],
        queryFn: fetchResourceSlots,
        initialData: []
    })
}