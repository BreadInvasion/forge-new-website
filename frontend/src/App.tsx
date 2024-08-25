import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Status from './components/Status/Status';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ComingSoon from './components/Home/ComingSoon';

const Content = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    position: relative;
`;

/**
 * 
 * Ideas:
 * - Add a way to email all students (Include an opt in/out feature in registration)
 *    - This could be used to send out updates, reminders, EVENTS WE"RE HOLDING, etc.
 */

/**
 * TO DO:
 * [X] Home Page
 * [X] Status Page
 * [X] Login Page
 * [X] Register Page
 * [ ] Hours Page
 * [ ] MyForge Page
 * 
 * Optional: 
 * [ ] Create/3dprint page
 * [ ] Create/laser page
 * [ ] Create/sticker page
 * [ ] learn/3d-printing-guide page
 * [ ] learn/laser-engraving-guide page
 * [ ] learn/sticker-preparation page
 * [ ] learn/troubleshooting page
 */

export default function App() {
    return (
        <Router>
            <Content>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/status" element={<Status/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/learn/aboutus" element={<ComingSoon/>} />
                    <Route path="/learn/3d-printing-guide" element={<ComingSoon/>} />
                    <Route path="/learn/laser-engraving-guide" element={<ComingSoon/>} />
                    <Route path="/learn/sticker-preparation" element={<ComingSoon/>} />
                    <Route path="/learn/troubleshooting" element={<ComingSoon/>} />
                    <Route path="/hours" element={<ComingSoon/>} />
                    <Route path="/create/3dprint" element={<ComingSoon/>} />
                    <Route path="/create/laser" element={<ComingSoon/>} />
                    <Route path="/create/sticker" element={<ComingSoon/>} />
                    <Route path="/create/all" element={<ComingSoon/>} />
                    <Route path="/myforge" element={<ComingSoon/>} />
                </Routes>
                {/* <Footer /> */}
            </Content>
        </Router>
    );
}
