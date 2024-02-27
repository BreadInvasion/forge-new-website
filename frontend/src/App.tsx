import React from 'react';
import styled from 'styled-components';
import { NavBar } from './components/NavBar/NavBar';
import {mauveDark} from '@radix-ui/colors';
import background from 'src/assets/img/anvil_with_benchys_right.png'
const Content = styled.div`
    height: 100vh;
    width: 100vw;
    background: url(${background}), #E00000;
    background-size: cover;
`;

export default function App() {

    return (
        <Content>
            <NavBar />
        </Content>
    );
}
