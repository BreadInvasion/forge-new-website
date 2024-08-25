import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Status from './components/Status/Status';
import Login from './components/Login/Login';

const Content = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    position: relative;
`;

export default function App() {
    return (
        <Router>
            <Content>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/status" element={<Status/>} />
                    <Route path="/login" element={<Login/>} />
                </Routes>
                {/* <Footer /> */}
            </Content>
        </Router>
    );
}
