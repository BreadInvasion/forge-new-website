import React from 'react';
import Home from './components/Home/Home';
import Hours from './components/Hours/Hours';
import Status from './components/Status/Status';
import { useRecoilValue } from 'recoil';
import { pageState } from './GlobalAtoms';
import { PageValues } from './Constants';
import styled from 'styled-components';

import background from './assets/img/background.jpg';
import Login from './components/Login/Login';
import HomeRevamped from './components/Home/HomeRevamped';
import Footer from './components/Footer/Footer';
import { NavBar } from './components/NavBar/old_navbar';

const Content = styled.div`
    height: 100vh;
    weight: 100vw;
`;

export default function App() {

    const page = useRecoilValue(pageState);

    return (
        <Content>
            <NavBar />
            {page === PageValues.HOME && <HomeRevamped />}
            {page === PageValues.HOMENEW && <HomeRevamped />}
            {page === PageValues.HOURS && <Hours />}
            {page === PageValues.STATUS && <Status />}
            {page === PageValues.LOGIN && <Login />}
            {page === PageValues.HOME && <Footer />}
        </Content>
    );
}
