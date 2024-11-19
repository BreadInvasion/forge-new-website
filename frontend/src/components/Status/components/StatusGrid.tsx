import React from 'react';
import styled from 'styled-components';
import { machines } from '../generateMockStatusData';
import CondensedCard from './CondensedCard';

const GridContainer = styled.div`
    grid-area: status;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 10px;
`;


const StatusGrid: React.FC = () => {
    return (
        <GridContainer>
            {machines.map((machine) => (
                <CondensedCard
                    key={machine.name}
                    name={machine.name}
                    icon={machine.icon}
                    user={machine.user}
                    startTime={machine.startTime}
                    totalTime={machine.totalTime}
                />
            ))}
        </GridContainer>
    );
};

export default StatusGrid;