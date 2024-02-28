import React from 'react';
import styled from 'styled-components';
import { NavBar } from './components/NavBar/NavBar';
import background from 'src/assets/img/anvil_with_benchys_right.png'
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';


const Content = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: column;
    // background: url(${background}), #E00000;
    // background-size: cover;
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
