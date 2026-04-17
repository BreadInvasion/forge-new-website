import React, { useEffect, useMemo, useState } from 'react';
import useAuth from '../Auth/useAuth';
import { isAdmin } from '../Auth/roleUtils';
import bgPattern from 'src/assets/img/background.svg?url';
import MachinesTab from './tabs/MachinesTab';
import MachineTypesTab from './tabs/MachineTypesTab';
import MachineGroupsTab from './tabs/MachineGroupsTab';
import ResourcesTab from './tabs/ResourcesTab';
import ResourceSlotsTab from './tabs/ResourceSlotsTab';
import UsersTab from './tabs/UsersTab';
import SemestersTab from './tabs/SemestersTab';
import ChargeSheetsTab from './tabs/ChargeSheetsTab';

import './styles/Admin.scss';

// ── Figma asset (ruler) — same asset used on the Status / Hours pages ──────
const RULER_URL = 'https://www.figma.com/api/mcp/asset/bdc76774-85d6-41c4-8ea4-dad90eacaf1c';

type AdminTabKey =
    | 'machines'
    | 'types'
    | 'groups'
    | 'resources'
    | 'resource_slots'
    | 'users'
    | 'semesters'
    | 'charge_sheets';

interface TabDef {
    key: AdminTabKey;
    label: string;
    hash: string;
    /** 'blue' = manager-level, 'red' = eboard-level — matches user-page button colors. */
    accent?: 'blue' | 'red';
}

const TABS: TabDef[] = [
    { key: 'machines', label: 'Machines', hash: '#machines', accent: 'blue' },
    { key: 'types', label: 'Machine Types', hash: '#types', accent: 'blue' },
    { key: 'groups', label: 'Machine Groups', hash: '#groups', accent: 'red' },
    { key: 'resources', label: 'Resources', hash: '#resources', accent: 'red' },
    { key: 'resource_slots', label: 'Resource Slots', hash: '#resource_slots', accent: 'red' },
    { key: 'users', label: 'Users', hash: '#users', accent: 'red' },
    { key: 'semesters', label: 'Semesters', hash: '#semesters', accent: 'red' },
    { key: 'charge_sheets', label: 'Charge Sheets', hash: '#charge_sheets', accent: 'red' },
];

/**
 * Admin
 *
 * Single-page UI for users with admin / super-admin privileges. The page
 * hosts all management-level tabs that used to live on the MyForge user page
 * (the "blue" manager tabs and the "red" eboard tabs), so management
 * functionality is consolidated in one place.
 *
 * Access is additionally gated on the client via `isAdmin(user)`. A friendly
 * "Admin access required" fallback is shown for authenticated non-admins.
 * Server-side role enforcement is expected on the API as the source of truth.
 */
const Admin: React.FC = () => {
    const { user } = useAuth();
    const allowed = useMemo(() => isAdmin(user), [user]);

    const initialTab: AdminTabKey = useMemo(() => {
        const hash = (typeof window !== 'undefined' && window.location.hash) || '';
        const match = TABS.find((t) => t.hash === hash);
        return match ? match.key : 'machines';
    }, []);
    const [activeTab, setActiveTab] = useState<AdminTabKey>(initialTab);

    // Keep the URL hash in sync so tabs are shareable / bookmarkable
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const tab = TABS.find((t) => t.key === activeTab);
        if (tab && window.location.hash !== tab.hash) {
            window.history.replaceState(null, '', `${window.location.pathname}${tab.hash}`);
        }
    }, [activeTab]);

    if (!allowed) {
        return (
            <div className="admin-page">
                <div className="admin-forbidden">
                    <h1>Admin access required</h1>
                    <p>
                        You don&apos;t have permission to view this page. If you believe this is a
                        mistake, please contact a Forge administrator.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div
                className="admin-bg-pattern"
                style={{ backgroundImage: `url(${bgPattern})` }}
                aria-hidden="true"
            />
            <div
                className="admin-ruler"
                style={{ ['--ruler-url' as string]: `url(${RULER_URL})` } as React.CSSProperties}
                aria-hidden="true"
            />

            <nav className="admin-tabs" aria-label="Admin sections">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={
                            'admin-tab-button' +
                            (tab.accent ? ` admin-tab-button--${tab.accent}` : '') +
                            (activeTab === tab.key ? ' active' : '')
                        }
                        onClick={() => setActiveTab(tab.key)}
                        aria-current={activeTab === tab.key ? 'page' : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <div className="admin-tab-divider" aria-hidden="true" />

            <div className="admin-content">
                {activeTab === 'machines' && <MachinesTab />}
                {activeTab === 'types' && <MachineTypesTab />}
                {activeTab === 'groups' && <MachineGroupsTab />}
                {activeTab === 'resources' && <ResourcesTab />}
                {activeTab === 'resource_slots' && <ResourceSlotsTab />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'semesters' && <SemestersTab />}
                {activeTab === 'charge_sheets' && <ChargeSheetsTab />}
            </div>
        </div>
    );
};

export default Admin;
