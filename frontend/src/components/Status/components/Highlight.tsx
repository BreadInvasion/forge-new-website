import React from 'react';
import styled from 'styled-components';
import MachineCard from '../MachineCard';
import { useSelectedMachine } from '../SelectedMachineContext';

const HighlightCard = styled.div`
    background-color: red;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
`;

const Highlight: React.FC = () => {
    const { selectedMachine } = useSelectedMachine();

    if (!selectedMachine) {
        return (
            <HighlightCard>
                <h2>Selected Machine: </h2>
                <p>No machine selected</p>
            </HighlightCard>
        );
    }

    return (
        <HighlightCard>
            <h2>Highlighted Card: </h2>
            <MachineCard
                name={selectedMachine.name}
                icon={selectedMachine.icon}
                status={selectedMachine.status}
                user={selectedMachine.user}
                startTime={selectedMachine.startTime}
                totalTime={selectedMachine.totalTime}
                weight={selectedMachine.weight}
                material={selectedMachine.material}
                machine={selectedMachine}
                $highlight={false}
                $minimized={false}
                $clear={false}
            />
        </HighlightCard>
    );
};

export default Highlight;