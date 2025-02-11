import React from 'react';
import styled from 'styled-components';


const HighlightCard = styled.div`
    grid-area: highlight;
    background-color: red;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
`;

const Highlight: React.FC = () => {
    return (
        <HighlightCard>
            <h2>Highlight</h2>
            
        </HighlightCard>
    );
};

export default Highlight;