import React, { useEffect, useMemo, useState } from 'react';
import useAuth from '../../Auth/useAuth';
import { Link } from 'react-router-dom';
import { Machine, MachineType, MachineUsage } from 'src/interfaces';
import { OmniAPI } from 'src/apis/OmniAPI';
import { UserPermission } from '../../../enums';
import '../styles/Summary.scss';

const PAGE_SIZE = 5;

const pad = (n: number) => String(n).padStart(2, '0');

const formatTime = (value: Date | string | undefined): string => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    let hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes}${suffix}`;
};

const formatElapsed = (seconds: number | string | undefined): string => {
    const n = Number(seconds);
    if (!Number.isFinite(n) || n <= 0) return '00:00';
    const total = Math.floor(n);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${pad(mins)}:${pad(secs)}`;
};

const formatShortDate = (value: Date | string | undefined): string => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(d.getFullYear()).slice(-2)}`;
};

const formatMoney = (value: number | string | undefined | null): string => {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n)) return '0.00';
    return n.toFixed(2);
};

const Summary: React.FC = () => {
    const { user } = useAuth();

    const hasPermission = (p: UserPermission) =>
        user.permissions.includes(p) ||
        user.permissions.includes(UserPermission.IS_SUPERUSER);

    const isVolunteer = hasPermission(UserPermission.CAN_FAIL_MACHINES);
    const canUseMachines =
        hasPermission(UserPermission.CAN_USE_MACHINES) ||
        hasPermission(UserPermission.CAN_USE_MACHINES_BETWEEN_SEMESTERS);
    // Admin access = anyone with an admin-ish permission. Admins and superusers
    // get the volunteer layout plus the extra "Admin" button.
    const isAdmin =
        hasPermission(UserPermission.CAN_SEE_MACHINE_TYPES) ||
        hasPermission(UserPermission.CAN_SEE_MACHINE_GROUPS) ||
        hasPermission(UserPermission.CAN_SEE_MACHINES) ||
        hasPermission(UserPermission.CAN_SEE_RESOURCES) ||
        hasPermission(UserPermission.CAN_SEE_RESOURCE_SLOTS) ||
        hasPermission(UserPermission.CAN_SEE_USERS) ||
        hasPermission(UserPermission.CAN_SEE_SEMESTERS) ||
        hasPermission(UserPermission.CAN_GET_CHARGES);

    const [machineUsages, setMachineUsages] = useState<MachineUsage[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
    const [currentUsage, setCurrentUsage] = useState<MachineUsage | null>(null);
    const [nowMs, setNowMs] = useState<number>(Date.now());
    const [semesterFilter, setSemesterFilter] = useState<string>('all');
    const [page, setPage] = useState<number>(0);

    // Load all usages for the current user.
    useEffect(() => {
        (async () => {
            try {
                const response = await OmniAPI.get('usages', 'me');
                setMachineUsages(Array.isArray(response) ? response : []);
            } catch (err) {
                console.error('Error fetching machine usages:', err);
            }
        })();
    }, []);

    // Load all machines + machine types once so we can map each usage's
    // machine_name to a real machine-type label for the spending chart.
    // machine_types may 403 for plain members — that's fine, we still fall
    // back to the `type` name on the Machine record itself.
    useEffect(() => {
        (async () => {
            try {
                const response = await OmniAPI.getAll('machines');
                setMachines(Array.isArray(response) ? response : []);
            } catch (err) {
                console.error('Error fetching machines:', err);
            }
        })();
        (async () => {
            try {
                const response = await OmniAPI.getAll('machine_types');
                setMachineTypes(Array.isArray(response) ? response : []);
            } catch (err) {
                // Non-fatal: members without CAN_SEE_MACHINE_TYPES land here.
                // The chart will still resolve types via Machine.type / group.
            }
        })();
    }, []);

    // Load current (in-progress) usage if any. Only the single most recent
    // session is shown, even if the API returns more than one.
    useEffect(() => {
        (async () => {
            try {
                const response = await OmniAPI.get('usages/current', 'me');
                const data: MachineUsage[] = Array.isArray(response) ? response : [];
                setCurrentUsage(data[0] ?? null);
            } catch (err) {
                console.error('Error fetching current usage:', err);
            }
        })();
    }, []);

    // Tick clock every second so the "Elapsed Time" stays live while a session is open.
    useEffect(() => {
        if (!currentUsage) return;
        const id = window.setInterval(() => setNowMs(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [currentUsage]);

    const liveElapsedSeconds = useMemo(() => {
        if (!currentUsage) return 0;
        const started = new Date(currentUsage.time_started).getTime();
        if (Number.isNaN(started)) return Number(currentUsage.duration ?? 0);
        return Math.max(0, Math.floor((nowMs - started) / 1000));
    }, [currentUsage, nowMs]);

    // type_id -> type name. Built from the (optional) machine_types list.
    const typeIdToName = useMemo(() => {
        const map: Record<string, string> = {};
        machineTypes.forEach((t) => {
            if (t.id) map[String(t.id)] = t.name || '';
        });
        return map;
    }, [machineTypes]);

    // machine_name -> { typeKey, typeLabel }
    //   - `typeKey` is stable across machines of the same type (prefers
    //     `type_id`, then normalized type name) so every machine of a given
    //     type shares the same chart bucket.
    //   - `typeLabel` is the human-readable type name shown on the bar.
    // Machines whose type we cannot determine are intentionally omitted from
    // the map so their usages don't land in a machine-name bucket.
    const machineNameToType = useMemo(() => {
        const map: Record<string, { typeKey: string; typeLabel: string }> = {};
        machines.forEach((m) => {
            if (!m.name) return;

            const typeName =
                (m.type && String(m.type).trim()) ||
                (m.type_id && typeIdToName[String(m.type_id)]) ||
                '';

            if (!m.type_id && !typeName) return; // no type info, skip

            const typeKey = m.type_id
                ? String(m.type_id)
                : typeName.toLowerCase();
            const typeLabel = typeName || 'Unknown Type';

            map[m.name] = { typeKey, typeLabel };
        });
        return map;
    }, [machines, typeIdToName]);

    // Spending per machine TYPE (for the horizontal bar chart).
    // Aggregates strictly by machine type — individual machine names are
    // never shown. Usages whose machine type cannot be resolved are grouped
    // under a single "Unknown Type" bucket instead of leaking machine names.
    const spendingByMachine = useMemo(() => {
        const totals: Record<string, { label: string; amount: number }> = {};
        machineUsages.forEach((u) => {
            const resolved = u.machine_name
                ? machineNameToType[u.machine_name]
                : undefined;
            const typeKey = resolved?.typeKey ?? '__unknown__';
            const typeLabel = resolved?.typeLabel ?? 'Unknown Type';

            if (!totals[typeKey]) {
                totals[typeKey] = { label: typeLabel, amount: 0 };
            }
            totals[typeKey].amount += Number(u.cost || 0);
        });
        const entries = Object.values(totals)
            .map(({ label, amount }) => ({ machine: label, amount }))
            .sort((a, b) => b.amount - a.amount);
        const max = entries.reduce((m, e) => Math.max(m, e.amount), 0);
        return { entries, max };
    }, [machineUsages, machineNameToType]);

    // Semester options for the filter dropdown.
    const semesterOptions = useMemo(() => {
        const set = new Set<string>();
        machineUsages.forEach((u) => {
            if (u.semester) set.add(String(u.semester));
        });
        return Array.from(set).sort((a, b) => b.localeCompare(a));
    }, [machineUsages]);

    // Table rows after filtering.
    const filteredRows = useMemo(() => {
        const rows =
            semesterFilter === 'all'
                ? machineUsages
                : machineUsages.filter((u) => String(u.semester) === semesterFilter);
        return [...rows].sort((a, b) => {
            const ta = new Date(a.time_started).getTime();
            const tb = new Date(b.time_started).getTime();
            return tb - ta;
        });
    }, [machineUsages, semesterFilter]);

    // Reset pagination when the filter changes.
    useEffect(() => {
        setPage(0);
    }, [semesterFilter]);

    const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
    const pageRows = filteredRows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">My Dashboard</h1>
                    <p className="dashboard-welcome">
                        Welcome back, {user.first_name || 'friend'}!
                    </p>
                </div>
                <div className="dashboard-actions">
                    {isAdmin && (
                        <Link to="/admin" className="dash-btn dash-btn--navy-dark">
                            Admin
                        </Link>
                    )}
                    {isVolunteer && (
                        <Link to="/myforge/fail" className="dash-btn dash-btn--navy">
                            Failure Form
                        </Link>
                    )}
                    {canUseMachines && (
                        <Link to="/myforge/create" className="dash-btn dash-btn--red">
                            + Use a Machine
                        </Link>
                    )}
                </div>
            </header>

            <section className="dashboard-stats">
                <div className="stat-card stat-card--cost">
                    <div className="stat-label">SEMESTER COST</div>
                    <div className="stat-value">${formatMoney(user.semester_balance)}</div>
                    <div className="stat-sub">Total spent this semester</div>
                </div>

                <div className="stat-card stat-card--session">
                    <div className="session-head">
                        <span className="stat-label">CURRENT SESSION</span>
                        {currentUsage && <span className="live-badge">Live</span>}
                    </div>

                    {currentUsage ? (
                        <>
                            <div className="session-body">
                                <div className="session-machine">
                                    <div className="session-machine-name">
                                        <span className="dot" />
                                        {currentUsage.machine_name}
                                    </div>
                                </div>
                                <div className="session-started">
                                    Started at {formatTime(currentUsage.time_started)}
                                </div>
                            </div>
                            <div className="session-foot">
                                <div>
                                    <div className="session-foot-label">Elapsed Time</div>
                                    <div className="session-foot-value">
                                        {formatElapsed(liveElapsedSeconds)}
                                    </div>
                                </div>
                                <div>
                                    <div className="session-foot-label">Semester Cost</div>
                                    <div className="session-foot-value">
                                        ${formatMoney(currentUsage.cost)}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="session-empty">No sessions</div>
                    )}
                </div>
            </section>

            <section className="dashboard-spending">
                <div className="section-head">
                    <h2 className="section-title">Your Spending my Machine</h2>
                    <span className="section-meta">This Semester</span>
                </div>
                <div className="spending-card">
                    {spendingByMachine.entries.length === 0 ? (
                        <div className="spending-empty">No spending yet this semester.</div>
                    ) : (
                        <ul className="spending-list">
                            {spendingByMachine.entries.map(({ machine, amount }) => {
                                const pct = spendingByMachine.max > 0
                                    ? Math.max(4, Math.round((amount / spendingByMachine.max) * 100))
                                    : 0;
                                return (
                                    <li className="spending-row" key={machine}>
                                        <span className="spending-label">{machine}</span>
                                        <span className="spending-bar-track">
                                            <span
                                                className="spending-bar-fill"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </span>
                                        <span className="spending-amount">
                                            ${formatMoney(amount)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </section>

            <section className="dashboard-activity">
                <div className="section-head">
                    <h2 className="section-title activity-title">Recent Activity</h2>
                    <label className="activity-filter">
                        <span className="activity-filter-label">Filter:</span>
                        <select
                            className="activity-filter-select"
                            value={semesterFilter}
                            onChange={(e) => setSemesterFilter(e.target.value)}
                        >
                            <option value="all">All semesters</option>
                            {semesterOptions.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="activity-card">
                    <table className="activity-table">
                        <thead>
                            <tr>
                                <th>SEMESTER</th>
                                <th>DATE</th>
                                <th>MACHINE</th>
                                <th>COST</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="activity-empty">
                                        No machine usage recorded.
                                    </td>
                                </tr>
                            ) : (
                                pageRows.map((u, i) => (
                                    <tr key={`${u.time_started}-${u.machine_name}-${i}`}>
                                        <td>{u.semester}</td>
                                        <td>{formatShortDate(u.time_started)}</td>
                                        <td className="activity-machine">{u.machine_name}</td>
                                        <td>${formatMoney(u.cost)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="activity-foot">
                        <span className="activity-count">
                            Displaying {pageRows.length} machine log
                            {pageRows.length === 1 ? '' : 's'}
                        </span>
                        <div className="activity-pager">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                aria-label="Previous page"
                            >
                                &lt;
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                                disabled={page >= pageCount - 1}
                                aria-label="Next page"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Summary;
