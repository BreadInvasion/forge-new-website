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
    { label: 'NAME', width: '18%', render: (m) => m.name },
    { label: 'GROUP NAME', width: '20%', render: (m) => m.group || '—' },
    { label: 'TYPE NAME', width: '22%', render: (m) => m.type || '—' },
    {
        label: 'MAINTENANCE MODE',
        width: '22%',
        render: (m) => String(Boolean(m.maintenance_mode)),
    },
    { label: 'DISABLED', width: '18%', render: (m) => String(Boolean(m.disabled)) },
];

export const machineTypeColumns: AdminTableColumn<MachineType>[] = [
    { label: 'NAME', width: '18%', render: (t) => t.name },
    { label: 'NUM MACHINES', width: '16%', render: (t) => (t.count ?? 0).toString() },
    { label: 'RESOURCE NAMES', width: '24%', render: (t) => joinList(t.resource_types) },
    {
        label: 'RESOURCE SLOT NAMES',
        width: '24%',
        render: (t) => joinList(t.resource_slot_ids),
    },
    { label: 'COST BY HOUR', width: '18%', render: (t) => formatCost(t.cost_per_hour) },
];

export const machineGroupColumns: AdminTableColumn<MachineGroup>[] = [
    { label: 'NAME', width: '30%', render: (g) => g.name || 'None' },
    { label: 'MACHINES', width: '70%', render: (g) => joinList(g.machines) },
];

export const resourceColumns: AdminTableColumn<Resource>[] = [
    { label: 'NAME', width: '22%', render: (r) => r.name },
    { label: 'BRAND', width: '20%', render: (r) => r.brand || '—' },
    { label: 'COLOR', width: '18%', render: (r) => r.color || '—' },
    { label: 'UNITS', width: '20%', render: (r) => r.units || '—' },
    { label: 'COST', width: '20%', render: (r) => formatCost(r.cost) },
];

export const resourceSlotColumns: AdminTableColumn<ResourceSlot>[] = [
    {
        label: 'NAME',
        width: '24%',
        render: (s) => s.display_name || s.name || '—',
    },
    {
        label: 'VALID RESOURCES',
        width: '36%',
        render: (s) => joinList(s.valid_resource_ids),
    },
    {
        label: 'ALLOW OWN MATERIAL',
        width: '20%',
        render: (s) => (s.allow_own_material ? 'Yes' : 'No'),
    },
    {
        label: 'ALLOW EMPTY',
        width: '20%',
        render: (s) => (s.allow_empty ? 'Yes' : 'No'),
    },
];

export const userColumns: AdminTableColumn<User>[] = [
    { label: 'IS RPI STAFF', width: '12%', render: (u) => (u.is_rpi_staff ? 'Yes' : 'No') },
    { label: 'RCSID', width: '10%', render: (u) => u.RCSID || '—' },
    { label: 'RIN', width: '10%', render: (u) => u.RIN || '—' },
    { label: 'FIRST NAME', width: '10%', render: (u) => u.first_name || '—' },
    { label: 'LAST NAME', width: '10%', render: (u) => u.last_name || '—' },
    { label: 'MAJOR', width: '10%', render: (u) => u.major || '—' },
    { label: 'PRONOUNS', width: '10%', render: (u) => u.pronouns || '—' },
    { label: 'DISPLAY ROLE', width: '10%', render: (u) => u.display_role || '—' },
    { label: 'IS GRADUATING', width: '10%', render: (u) => (u.is_graduating ? 'Yes' : 'No') },
    {
        label: 'SEMESTER BALANCE',
        width: '8%',
        render: (u) => u.semester_balance ?? '—',
    },
];

export const semesterColumns: AdminTableColumn<Semester>[] = [
    {
        label: 'SEMESTER',
        width: '40%',
        render: (s) => `${formatSemesterType(s.semester_type)} ${s.calendar_year}`,
    },
    { label: 'TYPE', width: '30%', render: (s) => formatSemesterType(s.semester_type) },
    { label: 'YEAR', width: '30%', render: (s) => String(s.calendar_year) },
];

export const userChargeColumns: AdminTableColumn<UserCharge>[] = [
    { label: 'RIN', width: '18%', render: (c) => c.RIN || '—' },
    { label: 'FIRST NAME', width: '22%', render: (c) => c.first_name || '—' },
    { label: 'LAST NAME', width: '22%', render: (c) => c.last_name || '—' },
    {
        label: 'SEMESTER BALANCE',
        width: '22%',
        render: (c) =>
            c.semester_balance === undefined || c.semester_balance === null
                ? '—'
                : String(c.semester_balance),
    },
    {
        label: 'IS GRADUATING',
        width: '16%',
        render: (c) => (c.is_graduating ? 'Yes' : 'No'),
    },
];
