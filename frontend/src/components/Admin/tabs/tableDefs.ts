import {
    Machine,
    MachineGroup,
    MachineType,
    Resource,
    ResourceSlot,
    Semester,
    User,
    UserCharge,
} from 'src/interfaces';
import { AdminTableColumn } from './AdminTable';

// ─────────────────────────────────────────────────────────────────────────────
// Small formatting helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatCost = (cost: number | undefined | null): string => {
    if (cost === undefined || cost === null || Number.isNaN(Number(cost))) return '0.000000';
    return Number(cost).toFixed(6);
};

const joinList = (items: unknown): string => {
    if (!Array.isArray(items) || items.length === 0) return '—';
    return items.filter(Boolean).join(', ');
};

const SEMESTER_TYPE_MAP: { [key: number]: string } = {
    0: 'Fall',
    1: 'Spring',
    2: 'Summer',
};

const SEMESTER_TYPE_REVERSE: { [key: string]: number } = {
    Fall: 0,
    Spring: 1,
    Summer: 2,
};

export const formatSemesterType = (t: number | string): string => {
    if (typeof t === 'number') return SEMESTER_TYPE_MAP[t] ?? String(t);
    if (t in SEMESTER_TYPE_REVERSE) return t;
    return SEMESTER_TYPE_MAP[Number(t)] ?? String(t);
};

export const getSemesterName = (sem: Semester | null | undefined): string => {
    if (!sem) return 'Semester';
    const typeStr = formatSemesterType(sem.semester_type);
    return `${typeStr}_${sem.calendar_year}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions — one per resource. Each admin tab imports whichever
// column sets it needs so it can stack multiple AdminTables on one page.
// ─────────────────────────────────────────────────────────────────────────────

export const machineColumns: AdminTableColumn<Machine>[] = [
    { label: 'NAME', render: (m) => m.name },
    { label: 'GROUP NAME', render: (m) => m.group_name || m.group || '—' },
    { label: 'TYPE NAME', render: (m) => m.type_name || m.type || '—' },
    { label: 'MAINTENANCE MODE', render: (m) => String(Boolean(m.maintenance_mode)) },
    { label: 'DISABLED', render: (m) => String(Boolean(m.disabled)) },
];

export const machineTypeColumns: AdminTableColumn<MachineType>[] = [
    { label: 'NAME', render: (t) => t.name },
    { label: 'NUM MACHINES', render: (t) => String(t.num_machines ?? t.count ?? 0) },
    { label: 'RESOURCE NAMES', render: (t) => joinList(t.resource_names ?? t.resource_types) },
    { label: 'RESOURCE SLOT NAMES', render: (t) => joinList(t.resource_slot_names) },
    { label: 'COST BY HOUR', render: (t) => formatCost(t.cost_per_hour) },
];

export const machineGroupColumns: AdminTableColumn<MachineGroup>[] = [
    { label: 'NAME', render: (g) => g.name || 'None' },
    { label: 'MACHINES', render: (g) => joinList(g.machines) },
];

export const resourceColumns: AdminTableColumn<Resource>[] = [
    { label: 'NAME', render: (r) => r.name },
    { label: 'BRAND', render: (r) => r.brand || '—' },
    { label: 'COLOR', render: (r) => r.color || '—' },
    { label: 'UNITS', render: (r) => r.units || '—' },
    { label: 'COST', render: (r) => formatCost(r.cost) },
];

export const resourceSlotColumns: AdminTableColumn<ResourceSlot>[] = [
    { label: 'NAME', render: (s) => s.display_name || s.name || '—' },
    { label: 'RESOURCES', render: (s) => joinList(s.resource_names ?? []) },
    { label: 'ALLOW OWN MATERIAL', render: (s) => (s.allow_own_material ? 'Yes' : 'No') },
    { label: 'ALLOW EMPTY', render: (s) => (s.allow_empty ? 'Yes' : 'No') },
];

export const userColumns: AdminTableColumn<User>[] = [
    { label: 'IS RPI STAFF', render: (u) => (u.is_rpi_staff ? 'Yes' : 'No') },
    { label: 'RCSID', render: (u) => u.RCSID || '—' },
    { label: 'RIN', render: (u) => u.RIN || '—' },
    { label: 'FIRST NAME', render: (u) => u.first_name || '—' },
    { label: 'LAST NAME', render: (u) => u.last_name || '—' },
    { label: 'MAJOR', render: (u) => u.major || '—' },
    { label: 'PRONOUNS', render: (u) => u.pronouns || '—' },
    { label: 'DISPLAY ROLE', render: (u) => u.display_role || '—' },
    { label: 'IS GRADUATING', render: (u) => (u.is_graduating ? 'Yes' : 'No') },
    { label: 'SEMESTER BALANCE', render: (u) => u.semester_balance ?? '—' },
];

export const semesterColumns: AdminTableColumn<Semester>[] = [
    { label: 'SEMESTER', render: (s) => `${formatSemesterType(s.semester_type)} ${s.calendar_year}` },
    { label: 'TYPE', render: (s) => formatSemesterType(s.semester_type) },
    { label: 'YEAR', render: (s) => String(s.calendar_year) },
];

export const userChargeColumns: AdminTableColumn<UserCharge>[] = [
    { label: 'RIN', render: (c) => c.RIN || '—' },
    { label: 'FIRST NAME', render: (c) => c.first_name || '—' },
    { label: 'LAST NAME', render: (c) => c.last_name || '—' },
    {
        label: 'SEMESTER BALANCE',
        render: (c) =>
            c.semester_balance === undefined || c.semester_balance === null
                ? '—'
                : String(c.semester_balance),
    },
    { label: 'IS GRADUATING', render: (c) => (c.is_graduating ? 'Yes' : 'No') },
];
