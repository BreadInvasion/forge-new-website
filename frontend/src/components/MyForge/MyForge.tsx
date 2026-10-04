import React, { lazy, Suspense, useEffect, useState } from 'react';
import UserMenu from './components/UserMenu';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import './styles/MyForge.scss';
import './styles/TabStyles.scss';
import { DynamicMachineForm } from './tabs/UseAMachine';
import { FailAMachineForm } from './tabs/FailAMachine';

const Summary = lazy(() => import('./tabs/Summary'));
const Machines = lazy(() => import('./tabs/Machines'));
const MachineTypes = lazy(() => import('./tabs/MachineTypes'));
const MachineGroups = lazy(() => import('./tabs/MachineGroups'));
const Resources = lazy(() => import('./tabs/Resources'));
const ResourceSlots = lazy(() => import('./tabs/ResourceSlots'));
const Users = lazy(() => import('./tabs/Users'));
const Usages = lazy(() => import('./tabs/Usages'));
const ComingSoon = lazy(() => import( '../Home/ComingSoon'));
const Semesters = lazy(() => import('./tabs/Semesters'));
const ChargeSheets = lazy(() => import('./tabs/ChargeSheets'));
const Roles = lazy(() => import('./tabs/Roles'));
const UserRoles = lazy(() => import('./tabs/UserRoles'));


interface MyForgeProps {

}

// Below this width the sidebar becomes a slide-out drawer (keep in sync with $mobile-breakpoint in MyForge.scss)
const MOBILE_QUERY = '(max-width: 900px)';
const isMobile = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;

const MyForge: React.FC = () => {
    /** MyForge Component
     *  - Operates as a functional Router for the subpage types. Which are defined in the App.tsx file.
     *  - All children share the same prop API, defined above, which is passed through context.
    */

    // Sidebar starts open on desktop and closed on phones
    const [menuOpen, setMenuOpen] = useState<boolean>(() => !isMobile());
    const location = useLocation();

    // On phones, close the drawer after picking a page
    useEffect(() => {
        if (isMobile()) setMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className={`myforge ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
            <UserMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            {menuOpen && <div className='sidebar-backdrop' onClick={() => setMenuOpen(false)} aria-hidden='true' />}
            {!menuOpen && (
                <button
                    type='button'
                    className='sidebar-toggle'
                    onClick={() => setMenuOpen(true)}
                    aria-label='Open menu'
                    aria-expanded={false}
                >
                    <HamburgerMenuIcon />
                    <span>Menu</span>
                </button>
            )}
            <div className='tab-container'>
                <Suspense fallback={<div></div>}>
                    <Routes>
                        <Route index element={<Summary />} />
                        <Route path="summary" element={<Summary />} />
                        <Route path="create" element={<DynamicMachineForm />} />
                        <Route path="fail" element={<FailAMachineForm />} />
                        <Route path="usages" element={<Usages />} />
                        <Route path="machines" element={<Machines />} />
                        <Route path="machine_types" element={<MachineTypes />} />
                        <Route path="machine_groups" element={<MachineGroups />} />
                        <Route path="machines" element={<Machines />} />
                        <Route path="resources" element={<Resources />} />
                        <Route path="resource_slots" element={<ResourceSlots />} />
                        <Route path="users" element={<Users />} />
                        <Route path="roles" element={<Roles />} />
                        <Route path="user_roles" element={<UserRoles />} />
                        <Route path="semesters" element={<Semesters />} />
                        <Route path="charge_sheets" element={<ChargeSheets />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};

export default MyForge;