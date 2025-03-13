import React, { lazy, Suspense } from 'react';
import UserMenu from './components/UserMenu';
import { Outlet, Route, Routes } from 'react-router-dom';

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



interface MyForgeProps {

}

const MyForge: React.FC = () => {
    /** MyForge Component
     *  - Operates as a functional Router for the subpage types. Which are defined in the App.tsx file.
     *  - All children share the same prop API, defined above, which is passed through context.
    */

    return (
        <div className='myforge'>
            <UserMenu />
            <div className='tab-container'>
                <Suspense fallback={<div></div>}>
                    <Routes>
                        <Route index element={<Summary />} />
                        <Route path="summary" element={<Summary />} />
                        <Route path="create" element={<DynamicMachineForm />} />
                        <Route path="fail" element={<FailAMachineForm />} />
                        <Route path="machines" element={<Machines />} />
                        <Route path="machine_types" element={<MachineTypes />} />
                        <Route path="machine_groups" element={<MachineGroups />} />
                        <Route path="resources" element={<Resources />} />
                        <Route path="resource_slots" element={<ResourceSlots />} />
                        <Route path="users" element={<Users />} />
                        <Route path="usages" element={<Usages />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};

export default MyForge;