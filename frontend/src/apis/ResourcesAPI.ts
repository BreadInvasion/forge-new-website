import { ResourceSlot } from "src/interfaces";
import { API } from "./OmniAPI";

export async function fetchResourceSlots() {
    return await API.get('/resourceslots') as ResourceSlot[];
}

