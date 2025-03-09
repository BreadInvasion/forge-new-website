import React, { createContext, useContext, useState } from 'react';
import { Status } from './generateMockStatusData';

interface MachineDetails {
    name: string;
    icon?: string;
    user: string | undefined;
    material: string | undefined;
    weight: number | undefined;
    startTime: string | undefined;
    totalTime: number | undefined;
    status: Status;
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