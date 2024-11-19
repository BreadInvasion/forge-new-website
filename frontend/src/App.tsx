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
import NewStatus from './components/Status/NewStatus';
import { AuthProvider } from './components/Auth/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

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
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/status" element={<NewStatus />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/learn/aboutus" element={<ComingSoon />} />
                    <Route path="/learn/3d-printing-guide" element={<ComingSoon />} />
                    <Route path="/learn/laser-engraving-guide" element={<ComingSoon />} />
                    <Route path="/learn/sticker-preparation" element={<ComingSoon />} />
                    <Route path="/learn/troubleshooting" element={<ComingSoon />} />
                    <Route path="/hours" element={<ComingSoon />} />
                    <Route path="/myforge" element={
                        <ProtectedRoute>
                            <ComingSoon />
                        </ProtectedRoute>
                    } />
                    <Route path="/create/3dprint" element={
                        <ProtectedRoute>
                            <ComingSoon />
                        </ProtectedRoute>
                    } />
                    <Route path="/create/laser" element={
                        <ProtectedRoute>
                            <ComingSoon />
                        </ProtectedRoute>
                    } />
                    <Route path="/create/sticker" element={
                        <ProtectedRoute>
                            <ComingSoon />
                        </ProtectedRoute>
                    } />
                    <Route path="/create/all" element={
                        <ProtectedRoute>
                            <ComingSoon />
                        </ProtectedRoute>
                    } />
                    <Route path="/user" element={
                        <ProtectedRoute>
                            <ComingSoon />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={
                        <div>
                            <h1>404</h1>
                            <p>Page not found</p>
                        </div>
                    } />
                </Routes>
                {/* <Footer /> */}
            </Router>
        </AuthProvider>
    );
}
