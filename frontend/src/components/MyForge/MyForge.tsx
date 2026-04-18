import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import bgPattern from 'src/assets/img/background.svg?url';

import './styles/MyForge.scss';
import './styles/TabStyles.scss';
import { DynamicMachineForm } from './tabs/UseAMachine';
import { FailAMachineForm } from './tabs/FailAMachine';

const Summary = lazy(() => import('./tabs/Summary'));
const Usages = lazy(() => import('./tabs/Usages'));

const MyForge: React.FC = () => {
    /** MyForge Component
     *  - Routes the logged-in user through their dashboard + related forms.
     *  - The Summary dashboard now matches the Member/Volunteer Figma frames:
     *    the action buttons (Failure Form, + Use a Machine, Admin) are rendered
     *    inline at the top of the dashboard, so the old sidebar has been
     *    removed. Volunteer = has CAN_FAIL_MACHINES. Admin/superuser also gets
     *    the Admin button.
     *  - A hex-pattern background (the same asset used on the Admin / Status /
     *    Hours pages) is painted behind the content to match the Figma.
    */

    return (
        <div className="myforge">
            <div
                className="myforge-bg-pattern"
                style={{ backgroundImage: `url(${bgPattern})` }}
                aria-hidden="true"
            />
            <div className="myforge-content">
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
