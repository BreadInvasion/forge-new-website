import React, { createContext, useContext, useState } from 'react';

interface MachineDetails {
    id: string;
    name: string;
    in_use: boolean | undefined;
    usage_start: string | undefined;
    usage_duration: number | undefined;
    user: string | undefined;
    maintenance_mode: boolean | undefined;
    disabled: boolean | undefined;
    failed: boolean | undefined;
    failed_at: string | undefined;
    material: string | undefined;
    weight: number | undefined;
}

interface SelectedMachineContextProps {
    selectedMachine: MachineDetails | null;
    setSelectedMachine: React.Dispatch<React.SetStateAction<MachineDetails | null>>;
}

const SelectedMachineContext = createContext<SelectedMachineContextProps | undefined>(undefined);

export const SelectedMachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(null);

    return (
        <SelectedMachineContext.Provider value={{ selectedMachine, setSelectedMachine }}>
            {children}
        </SelectedMachineContext.Provider>
    );
};

export const useSelectedMachine = () => {
    const context = useContext(SelectedMachineContext);
    if (!context) {
        throw new Error('useSelectedMachine must be used within a SelectedMachineProvider');
    }
    return context;
};