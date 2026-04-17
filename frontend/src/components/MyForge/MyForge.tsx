import React, { lazy, Suspense } from 'react';
import UserMenu from './components/UserMenu';
import { Route, Routes } from 'react-router-dom';

import './styles/MyForge.scss';
import './styles/TabStyles.scss';
import { DynamicMachineForm } from './tabs/UseAMachine';
import { FailAMachineForm } from './tabs/FailAMachine';

const Summary = lazy(() => import('./tabs/Summary'));
const Usages = lazy(() => import('./tabs/Usages'));


interface MyForgeProps {

}

const MyForge: React.FC = () => {
    /** MyForge Component
     *  - Operates as a functional Router for the subpage types. Which are defined in the App.tsx file.
     *  - Management-only tabs (Machines / Machine Types / Machine Groups / Resources /
     *    Resource Slots / Users / Semesters / Charge Sheets / Change Configuration)
     *    have been moved to the Admin page (/admin).
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
                        <Route path="usages" element={<Usages />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};

export default MyForge;
