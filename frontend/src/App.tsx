import React from 'react';
import styled from 'styled-components';
import { NavBar } from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Status from './components/Status/Status';


const Content = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: column;

`;

export default function App() {

    return (
        <Content>
            <NavBar />
            <Home />
            <Footer />
        </Content>
    );
}
