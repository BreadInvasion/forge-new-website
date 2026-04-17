import React from 'react';
import { styled } from 'styled-components';
import MachineCard from '../MachineCard';
import { useSelectedMachine } from '../SelectedMachineContext';

const Panel = styled.div`
    background: #ffffff;
    border: 1px solid #2d4a80;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(17,28,54,0.10);
    flex-shrink: 0;
`;

const PanelHeader = styled.div`
    background: #111c36;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;

    h2 {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-weight: 700;
        font-size: 13px;
        color: #ffffff;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin: 0;
    }
`;

const StatusDot = styled.div<{ $active: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${p => p.$active ? '#4ade80' : '#64748b'};
    flex-shrink: 0;
`;

const PanelBody = styled.div`
    padding: 0;
    width: 100%;

    p {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-size: 12px;
        color: #64748b;
        margin: 0;
        text-align: center;
        padding: 16px;
    }
`;

const Highlight: React.FC = () => {
    const { selectedMachine } = useSelectedMachine();

    return (
        <Panel>
            <PanelHeader>
                <StatusDot $active={!!selectedMachine} />
                <h2>Selected Machine</h2>
            </PanelHeader>
            <PanelBody>
                {selectedMachine ? (
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
                ) : (
                    <p>Click a machine to see details</p>
                )}
            </PanelBody>
        </Panel>
    );
};

export default Highlight;
