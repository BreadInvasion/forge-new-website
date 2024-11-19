import React from 'react';
import styled from 'styled-components';
import Toolbar from './components/Toolbar';
import StatusGrid from './components/StatusGrid';
import Highlight from './components/Highlight';

const Page = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto 4fr 1fr 1fr;
    grid-template-areas:
        "tools highlight"
        "status highlight"
        "status up-next"
        "status up-next";

    padding: 0.5rem 1rem;
`;



// add event listener for ESC key to unselect a tool. 
// When tool is clicked, set the selectedTool state to the tool name

const NewStatus: React.FC = () => {
    return (
        <Page>
            <Toolbar />
            <StatusGrid />
            <Highlight />
            <div style={{gridArea: "up-next", backgroundColor: "green"}}>Up Next</div>
        </Page>
    );
};

export default NewStatus;