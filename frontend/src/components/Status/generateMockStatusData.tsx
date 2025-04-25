export interface Machine {
    name: string;
    icon?: string; 
    user?: string;
    material: string;
    weight?: number; 
    totalTime?: number; 
    startTime?: string;
    status: Status;
}

export enum Status {
    "Idle",
    "InProgress",
    "Failed",
    "Maintenance",
}

export const machines: Machine[] = [
    {
        name: "Alpha",
        user: "Thomas B.",
        material: "PLA",
        weight: 212,
        totalTime: 180,
        startTime: "2022-03-12T21:01:00Z",
        status: Status.InProgress
    },
    {
        name: "Beta",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Gamma",
        user: "Andrew K.",
        material: "Personal",
        weight: 120,
        totalTime: 200,
        startTime: "2022-03-16T11:06:00Z",
        status: Status.Failed
    },
    {
        name: "Delta",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Epsilon",
        material: "PLA",
        status: Status.Maintenance
    },
    {
        name: "Theta",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Iota",
        material: "PLA",
        status: Status.Maintenance
    },
    {
        name: "Lambda",
        material: "PLA",
        status: Status.Maintenance
    },
    {
        name: "Mu",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Sigma",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Phi",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Omega",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mk2",
        icon: "Markforged",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Onyx",
        icon: "Markforged",
        user: "Deon R.",
        material: "Carbon Fiber",
        weight: 212,
        totalTime: 180,
        startTime: "2022-03-12T21:01:00Z",
        status: Status.InProgress
    },
    {
        name: "Form 3",
        icon: "Formlabs",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Laser",
        icon: "Laser",
        user: "Deon R.",
        material: "Wood",
        weight: 1000,
        totalTime: 180,
        startTime: "2022-03-12T21:01:00Z",
        status: Status.InProgress
    },
    {
        name: "Sticker",
        icon: "Sticker",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Russell XL",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Rish XL",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mini",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mini",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mini",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mini",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },

    
];

export const otherMachines: Machine[] = [
    {
        name: "Mk2",
        icon: "Markforged",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Onyx",
        icon: "Markforged",
        user: "Deon R.",
        material: "Carbon Fiber",
        weight: 212,
        totalTime: 180,
        startTime: "2022-03-12T21:01:00Z",
        status: Status.InProgress
    },
    {
        name: "Form 3",
        icon: "Formlabs",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Laser",
        icon: "Laser",
        user: "Deon R.",
        material: "Wood",
        weight: 1000,
        totalTime: 180,
        startTime: "2022-03-12T21:01:00Z",
        status: Status.InProgress
    },
    {
        name: "Sticker",
        icon: "Sticker",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Russell XL",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Rish XL",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mini",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mini",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    {
        name: "Mini",
        icon: "Prusa",
        material: "PLA",
        status: Status.Idle
    },
    
];