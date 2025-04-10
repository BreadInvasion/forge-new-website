import React from 'react';
import styled from 'styled-components';
import MachineCard from '../MachineCard';
import { useSelectedMachine } from '../SelectedMachineContext';

const HighlightCard = styled.div`
    background-color:rgb(176, 0, 0);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    h2 { 
        margin-bottom: 1rem;
        color: white; 
        flex-shrink: 0;
    }
    @media screen and (max-width: 768px) {
        max-height: 300px;
        overflow-y: auto;
    }
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
            <h2>Selected Machine: </h2>
            <MachineCard
                id={selectedMachine.id}
                name={selectedMachine.name}
                in_use={selectedMachine.in_use}
                usage_start={selectedMachine.usage_start}
                usage_duration={selectedMachine.usage_duration}
                user={selectedMachine.user}
                maintenance_mode={selectedMachine.maintenance_mode}
                disabled={selectedMachine.disabled}
                failed={selectedMachine.failed}
                failed_at={selectedMachine.failed_at}
                weight={selectedMachine.weight}
                material={selectedMachine.material}
                machine={selectedMachine}
                $highlightFailed={false}
                $minimized={false}
            />
        </HighlightCard>
    );
};

export default Highlight;