import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

import './App.scss';
import useAuth from './components/Auth/useAuth';
import { NavBar } from './components/NavBar/NavBar';

const Home = lazy(() => import('./components/Home/Home'));
const Footer = lazy(() => import('./components/Footer/Footer'));
const Status = lazy(() => import('./components/Status/Status'));
const Login = lazy(() => import('./components/Forms/Login'));
const Register = lazy(() => import('./components/Forms/Register'));
const ComingSoon = lazy(() => import('./components/Home/ComingSoon'));
const NewStatus = lazy(() => import('./components/Status/NewStatus'));
const MyForge = lazy(() => import('./components/MyForge/MyForge'));

// import Home from './components/Home/Home';
// import NewStatus from './components/Status/NewStatus';
// import Login from './components/Forms/Login';
// import Register from './components/Forms/Register';
// import ComingSoon from './components/Home/ComingSoon';

export default function App() {

    const { isAuthenticated, user, setAuth } = useAuth();

    return (
        <Router>
            <NavBar user={user} setAuth={setAuth} isAuthed={isAuthenticated}/>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/status" Component={NewStatus} />
                    <Route path="/login" Component={Login} />
                    <Route path="/register" Component={Register} />
                    <Route path="/learn" Component={ComingSoon} />
                    <Route path="/learn/about" Component={ComingSoon} />
                    <Route path="/learn/3d-printing-guide" Component={ComingSoon} />
                    <Route path="/learn/laser-engraving-guide" Component={ComingSoon} />
                    <Route path="/learn/sticker-preparation" Component={ComingSoon} />
                    <Route path="/learn/troubleshooting" Component={ComingSoon} />
                    <Route path="/hours" Component={ComingSoon} />
                    <Route path="/myforge/*" element={
                        <ProtectedRoute>
                            <MyForge />
                        </ProtectedRoute>
                    }/>
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
            </Suspense>
            {/* <Footer /> */}
        </Router>
    );
}
