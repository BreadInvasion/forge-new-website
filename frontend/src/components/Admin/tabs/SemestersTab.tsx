import React, { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { OmniAPI } from 'src/apis/OmniAPI';
import { Semester } from 'src/interfaces';
import useAuth from '../../Auth/useAuth';
import { UserPermission } from 'src/enums';
import bgPattern from 'src/assets/img/background.svg?url';
import AdminTable from './AdminTable';
import { semesterColumns, formatSemesterType } from './tableDefs';

// Reuses the same Figma-matching dialog chrome as MachineGroupsTab — the
// "Adding a Semester" form has the same structural pieces (navy frame, two
// labelled rows, red Save button) so we just piggyback on those styles.
import '../styles/MachineGroupsDialog.scss';

// Mirrors the backend SemesterType enum. Keep the order matching the table's
// `formatSemesterType` helper so display and submission stay in sync.
const SEMESTER_OPTIONS: { value: number; label: string }[] = [
    { value: 0, label: 'Fall' },
    { value: 1, label: 'Spring' },
    { value: 2, label: 'Summer' },
];

/**
 * SemestersTab
 *
 * Lists all semesters, supports creating a new one via a Figma-matching
 * dialog (season dropdown + calendar year input), and keeps the existing
 * "Advance Semester" action in the data-card title row.
 *
 * Wires into the existing backend endpoint:
 *   POST /semesters/new            create
 *   POST /exec/next_semester       advance active semester (unchanged)
 */
const SemestersTab: React.FC = () => {
    const { user } = useAuth();

    const canCreate =
        user?.permissions?.includes(UserPermission.CAN_CREATE_SEMESTERS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canDelete =
        user?.permissions?.includes(UserPermission.CAN_DELETE_SEMESTERS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canAdvance =
        user?.permissions?.includes(UserPermission.CAN_CHANGE_SEMESTER) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [advancing, setAdvancing] = useState<boolean>(false);

    // Dialog state. No edit flow yet — the backend `SEMESTER_CREATED` audit
    // is always a "create". Defaults to Fall + current calendar year.
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [semesterType, setSemesterType] = useState<number>(0);
    const [calendarYear, setCalendarYear] = useState<string>(
        String(new Date().getFullYear()),
    );

    const fetchSemesters = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await OmniAPI.getAll('semesters');
            setSemesters(Array.isArray(res) ? (res as Semester[]) : []);
        } catch (err) {
            console.error('Failed to load semesters:', err);
            setError('Unable to load semesters. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSemesters();
    }, [fetchSemesters]);

    const openCreateDialog = () => {
        setSemesterType(0);
        setCalendarYear(String(new Date().getFullYear()));
        setIsOpen(true);
    };

    // Delete flow: confirm, call API, refresh. The backend refuses deletion
    // when any MachineUsage rows reference this semester — surface that
    // error detail so officers know why the button didn't work.
    const onDelete = (s: Semester) => {
        if (!canDelete) {
            alert('You do not have permission to delete semesters.');
            return;
        }
        const label = `${formatSemesterType(s.semester_type)} ${s.calendar_year}`;
        if (!window.confirm(`Really delete "${label}"? This cannot be undone.`))
            return;

        OmniAPI.delete('semesters', s.id)
            .then(() => {
                fetchSemesters();
            })
            .catch((err: any) => {
                alert(
                    'Failed to delete semester: ' +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    const handleAdvance = async () => {
        if (!confirm('Advance to the next semester? This cannot be undone.')) return;
        setAdvancing(true);
        try {
            await OmniAPI.exec('next_semester');
            fetchSemesters();
        } catch (err) {
            console.error('Failed to advance semester:', err);
            alert('Failed to advance semester.');
        } finally {
            setAdvancing(false);
        }
    };

    const onSave = () => {
        const year = Number(calendarYear);
        if (!Number.isFinite(year) || year < 2020 || year > 9999) {
            alert('Calendar year must be between 2020 and 9999.');
            return;
        }

        OmniAPI.create('semesters', {
            semester_type: semesterType,
            calendar_year: year,
        })
            .then(() => {
                setIsOpen(false);
                fetchSemesters();
            })
            .catch((err: any) => {
                alert(
                    'Failed to create semester: ' +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    // Right-side controls on the data-card title row:
    //   • Advance Semester button (kept as-is from the previous implementation)
    //   • "+" button that opens the create dialog
    const titleActions = (
        <>
            {canAdvance && (
                <button
                    type="button"
                    className="btn-action btn-action--red"
                    onClick={handleAdvance}
                    disabled={advancing}
                >
                    {advancing ? 'Advancing…' : 'Advance Semester'}
                </button>
            )}
            {canCreate && (
                <Dialog.Trigger asChild>
                    <button
                        type="button"
                        className="mgd-open-btn"
                        style={{ position: 'static', marginLeft: 8 }}
                        aria-label="Add semester"
                        onClick={openCreateDialog}
                    >
                        <PlusIcon />
                    </button>
                </Dialog.Trigger>
            )}
        </>
    );

    // A custom chevron baked into the <select>'s background so it looks like
    // a styled input rather than the OS-native dropdown.
    const chevronBg =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'><path d='M3 5l4 4 4-4' fill='none' stroke='%23111c36' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")";

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="mgd-tab-wrap">
                <AdminTable<Semester>
                    title="Semesters"
                    columns={semesterColumns}
                    rows={semesters}
                    rowKey={(s) => s.id}
                    loading={loading}
                    error={error}
                    emptyMessage="No semesters found."
                    titleActions={titleActions}
                    onDelete={canDelete ? onDelete : undefined}
                />
            </div>

            <Dialog.Portal>
                <Dialog.Overlay className="mgd-overlay" />
                <Dialog.Content
                    className="mgd-content"
                    style={
                        {
                            ['--dialog-bg' as string]: `url(${bgPattern})`,
                        } as React.CSSProperties
                    }
                >
                    <Dialog.Close asChild>
                        <button type="button" className="mgd-close" aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>

                    <Dialog.Title className="mgd-title">Adding a Semester</Dialog.Title>
                    <div className="mgd-title-divider" />

                    <div className="mgd-form">
                        <div className="mgd-name-row">
                            <label className="mgd-name-label" htmlFor="smd-season">
                                Season
                            </label>
                            <select
                                id="smd-season"
                                className="mgd-name-input"
                                value={semesterType}
                                onChange={(e) => setSemesterType(Number(e.target.value))}
                                style={{
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    backgroundImage: chevronBg,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '14px 14px',
                                    paddingRight: 36,
                                    cursor: 'pointer',
                                }}
                            >
                                {SEMESTER_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mgd-name-row">
                            <label className="mgd-name-label" htmlFor="smd-year">
                                Calendar Year
                            </label>
                            <input
                                id="smd-year"
                                className="mgd-name-input"
                                type="number"
                                inputMode="numeric"
                                min={2020}
                                max={9999}
                                step={1}
                                value={calendarYear}
                                onChange={(e) => setCalendarYear(e.target.value)}
                            />
                        </div>

                        <div className="mgd-save-wrap">
                            <button
                                type="button"
                                className="mgd-save-btn"
                                onClick={onSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SemestersTab;
