export function formatCost(cost: number|string) {
    switch (typeof cost) {
        case "number":
            return `$${cost.toFixed(2)}`;
        case "string":
            return `$${cost}`;
        default:
            return ''; 
    }
}