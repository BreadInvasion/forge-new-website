import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { styled } from 'styled-components';
import { AuthProvider } from './components/Auth/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

import './App.scss';
import useAuth from './components/Auth/useAuth';
import { NavBar } from './components/NavBar/NavBar';

const Home = lazy(() => import('./components/Home/Home'));
import Footer from './components/Footer/Footer';
const Status = lazy(() => import('./components/Status/Status'));
const Login = lazy(() => import('./components/Forms/Login'));
const Register = lazy(() => import('./components/Forms/Register'));
const ComingSoon = lazy(() => import('./components/Home/ComingSoon'));
const GettingStarted = lazy(() => import('./components/GettingStarted/GettingStarted'));
const NewStatus = lazy(() => import('./components/Status/Status'));
const MyForge = lazy(() => import('./components/MyForge/MyForge'));
const Hours = lazy(() => import('./components/Hours/Hours'));
const Wiki = lazy(() => import('./components/FAQ/FAQ'));
const AboutUs = lazy(() => import('./components/FAQ/AboutUs'));
const FAQ = lazy(() => import('./components/FAQ/FAQ'));
const Etiquette = lazy(() => import('./components/FAQ/Etiquette'));
const Materials = lazy(() => import('./components/FAQ/Materials'));
<<<<<<< Updated upstream
=======
const Admin = lazy(() => import('./components/Admin/Admin'));
>>>>>>> Stashed changes

const AppWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const MainContent = styled.main`
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export default function App() {
    const { isAuthenticated, user, setAuth } = useAuth();

    return (
        <Router>
            <AppWrapper>
                <NavBar user={user} setAuth={setAuth} isAuthed={isAuthenticated} />

                <MainContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" Component={Home} />
                            <Route path="/status" Component={NewStatus} />
                            <Route path="/login" Component={Login} />
                            <Route path="/register" Component={Register} />
                            <Route path="/learn" Component={Wiki} />
                            <Route path="/learn/about" Component={AboutUs} />
                            <Route path="/faq/about" Component={AboutUs} />
                            <Route path="/learn/3d-printing-guide" Component={ComingSoon} />
                            <Route path="/learn/laser-engraving-guide" Component={ComingSoon} />
                            <Route path="/learn/sticker-preparation" Component={ComingSoon} />
                            <Route path="/learn/troubleshooting" Component={ComingSoon} />
                            <Route path="/hours" Component={Hours} />
                            <Route path="/faq" Component={FAQ} />
                            <Route path="/faq/etiquette" Component={Etiquette} />
                            <Route path="/faq/materials" Component={Materials} />
                            <Route path="/getting-started" Component={GettingStarted} />
                            <Route
                                path="/myforge/*"
                                element={
                                    <ProtectedRoute>
                                        <MyForge />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/create/3dprint"
                                element={
                                    <ProtectedRoute>
                                        <ComingSoon />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/create/laser"
                                element={
                                    <ProtectedRoute>
                                        <ComingSoon />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/create/sticker"
                                element={
                                    <ProtectedRoute>
                                        <ComingSoon />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/create/all"
                                element={
                                    <ProtectedRoute>
                                        <ComingSoon />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/user"
                                element={
                                    <ProtectedRoute>
                                        <ComingSoon />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
<<<<<<< Updated upstream
=======
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <Admin />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
>>>>>>> Stashed changes
                                path="*"
                                element={
                                    <div>
                                        <h1>404</h1>
                                        <p>Page not found</p>
                                    </div>
                                }
                            />
                        </Routes>
                    </Suspense>
                </MainContent>

                <Footer />
            </AppWrapper>
        </Router>
    );
}