import React, { ReactNode, useState } from 'react';
import Table, { DeleteItem, TableHead, ITEMS_PER_PAGE } from '../components/Table';
import { OmniAPI } from 'src/apis/OmniAPI';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';

import '../styles/TabStyles.scss';

import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import * as Dialog from '@radix-ui/react-dialog';
import { Semester } from 'src/interfaces';

const SEMESTER_TYPE_MAP: { [key: number]: string } = {
    0: 'Fall',
    1: 'Spring',
    2: 'Summer',
};
const SEMESTER_TYPE_REVERSE: { [key: string]: number } = {
    'Fall': 0,
    'Spring': 1,
    'Summer': 2,
};

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    semester: Semester | null;
    setSemester: (semester: Semester | null) => void;
    refresh: () => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, sem: Semester | null) => void] => {
    let { isDialogOpen, setIsDialogOpen, semester, setSemester, refresh } = props;

    const { user } = useAuth();
    const canCreate = user.permissions.includes(UserPermission.CAN_CREATE_SEMESTERS) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canEdit = user.permissions.includes(UserPermission.CAN_EDIT_SEMESTERS) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [semesterType, setSemesterType] = useState<number>(0);
    const [calendarYear, setCalendarYear] = useState<number>(0);

    const setOpenExtra = (state: boolean, sem: Semester | null) => {
        setSemester(sem);
        if (sem != null) {
            let stype = 0;
            if (typeof sem.semester_type === 'number') {
                stype = sem.semester_type;
            } else if (typeof sem.semester_type === 'string') {
                stype = (SEMESTER_TYPE_REVERSE[sem.semester_type] ?? (parseInt(sem.semester_type) || 0));
            }
            setSemesterType(stype);
            setCalendarYear(sem.calendar_year);
        } else {
            setSemesterType(0);
            setCalendarYear(0);
        }
        if (isDialogOpen !== state) setIsDialogOpen(state);
    };

    function create() {
        if (!canCreate) {
            alert('You do not have the permissions to create semesters');
            return;
        }
        if (semesterType === undefined || calendarYear === undefined) {
            alert('All fields must be populated!');
            return;
        }
        OmniAPI.create('semesters', { semester_type: semesterType, calendar_year: calendarYear })
            .then(() => {
                refresh();
                setOpenExtra(false, null);
            });
    }

    function edit() {
        if (!canEdit) {
            alert('You do not have the permissions to edit semesters');
            return;
        }
        if (semester == null) return;
        OmniAPI.edit('semesters', semester.id, { semester_type: semesterType, calendar_year: calendarYear })
            .then(() => {
                refresh();
                setOpenExtra(false, null);
            });
    }

    if (!canCreate && !canEdit) return [null, () => {}];
    return [
        <Dialog.Root open={isDialogOpen} onOpenChange={(e: boolean) => { setOpenExtra(e, semester); }}>
            {canCreate && (
                <button className="addbtn" onClick={() => { setOpenExtra(true, null); }}><PlusIcon /></button>
            )}
            {(canCreate || canEdit) && (
                <Dialog.Portal>
                    <div className='AEdiv'>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Close asChild>
                                <button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </button>
                            </Dialog.Close>
                            <Dialog.Title className="DialogTitle">{semester == null ? 'Adding' : 'Editing'} Semester</Dialog.Title>
                            <fieldset className="Fieldset">
                                <label className="Label" htmlFor="semester_type">Semester Type</label>
                                <select className="Input" id="semester_type" value={semesterType} onChange={e => setSemesterType(Number(e.target.value))}>
                                    {Object.entries(SEMESTER_TYPE_MAP).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                                <label className="Label" htmlFor="calendar_year">Year</label>
                                <input className="Input" id="calendar_year" type="number" value={calendarYear} min={2000} max={2200} onChange={e => setCalendarYear(Number(e.target.value))} />
                            </fieldset>
                            <Dialog.Close asChild>
                                <button className="Button SaveBtn" onClick={semester == null ? create : edit}>Save</button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            )}
        </Dialog.Root>,
        setOpenExtra
    ];
};

const Semesters: React.FC = () => {
    const { user } = useAuth();
    const canDelete = user.permissions.includes(UserPermission.CAN_DELETE_SEMESTERS) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canEdit = user.permissions.includes(UserPermission.CAN_EDIT_SEMESTERS) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canOfficer = user.permissions.includes(UserPermission.CAN_CHANGE_SEMESTER) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [data, setData] = useState<Semester[]>([]);
    const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
    const columns: (keyof Semester)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Semester)[]).filter((key) => key !== 'id') : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll('semesters', { limit: ITEMS_PER_PAGE, offset }).then((data) => {
            setData(data);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
        if (canOfficer) {
            OmniAPI.get('semesters', 'current').then((sem) => setCurrentSemester(sem)).catch(() => setCurrentSemester(null));
        }
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number, index_real: number) => {
        if (!canDelete) {
            alert('You do not have the permissions to delete semesters');
            return;
        }
        DeleteItem('semesters', data[index_real], refreshPage);
    };

    let [semester, setSemester]: [Semester | null, (semester: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({ isDialogOpen, setIsDialogOpen, semester, setSemester, refresh: refreshPage });

    // Set+Advance Semester buttons
    const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);
    const [showSetDialog, setShowSetDialog] = useState(false);
    const [setSemesterId, setSetSemesterId] = useState<string>("");
    const [setSemesterError, setSetSemesterError] = useState<string>("");

    const handleAdvanceSemester = async () => {
        try {
            await OmniAPI.exec('next_semester');
            setShowAdvanceDialog(false);
            OmniAPI.get('semesters', 'current').then((sem) => setCurrentSemester(sem)).catch(() => setCurrentSemester(null));
        } catch (e) {
            alert("Failed to advance semester");
        }
    };

    const handleSetSemester = async () => {
        if (!setSemesterId) {
            setSetSemesterError("Please enter a semester ID");
            return;
        }
        try {
            await OmniAPI.exec('set_semester', { semester_id: setSemesterId });
            setShowSetDialog(false);
            setSetSemesterId("");
            setSetSemesterError("");
            refreshPage();
        } catch (e) {
            setSetSemesterError("Failed to set semester. Check the ID.");
        }
    };

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Semesters"
                type="semesters"
                aemenu={ae}
            />
            {canOfficer && (
                <div className="current-semester-label">
                    Current Semester: {currentSemester ? `${SEMESTER_TYPE_MAP[typeof currentSemester.semester_type === 'number' ? currentSemester.semester_type : SEMESTER_TYPE_REVERSE[currentSemester.semester_type as string]]} ${currentSemester.calendar_year}` : 'None'}
                </div>
            )}
            {canOfficer && (
                <div className="semester-actions-row">
                    <button className="Button OfficerBtn" onClick={() => setShowAdvanceDialog(true)}>
                        Advance Semester
                    </button>
                    <Dialog.Root open={showAdvanceDialog} onOpenChange={setShowAdvanceDialog}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="DialogOverlay" />
                            <Dialog.Content className="DialogContent">
                                <Dialog.Title className="DialogTitle">Are you sure?</Dialog.Title>
                                <div className="advance-warning">This will advance to the next semester. This action cannot be undone.</div>
                                <div className="dialog-actions">
                                    <button className="Button CancelBtn" onClick={() => setShowAdvanceDialog(false)}>Cancel</button>
                                    <button className="Button SaveBtn" onClick={handleAdvanceSemester}>Confirm</button>
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>

                    <button className="Button OfficerBtn" onClick={() => setShowSetDialog(true)}>
                        Set Semester
                    </button>
                    <Dialog.Root open={showSetDialog} onOpenChange={setShowSetDialog}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="DialogOverlay" />
                            <Dialog.Content className="DialogContent">
                                <Dialog.Title className="DialogTitle">Set Active Semester</Dialog.Title>
                                <div className="set-semester-select">
                                    <label htmlFor="set-semester-id">Select Semester:</label>
                                    <select id="set-semester-id" className="Input" value={setSemesterId} onChange={e => { setSetSemesterId(e.target.value); setSetSemesterError(""); }}>
                                        <option value="">Select a semester</option>
                                        {data.map((sem) => (
                                            <option key={sem.id} value={sem.id}>
                                                {SEMESTER_TYPE_MAP[typeof sem.semester_type === 'number' ? sem.semester_type : SEMESTER_TYPE_REVERSE[sem.semester_type as string]]} {sem.calendar_year}
                                            </option>
                                        ))}
                                    </select>
                                    {setSemesterError && <div className="set-semester-error">{setSemesterError}</div>}
                                </div>
                                <div className="dialog-actions">
                                    <button className="Button CancelBtn" onClick={() => { setShowSetDialog(false); setSetSemesterError(""); }}>Cancel</button>
                                    <button className="Button SaveBtn" onClick={handleSetSemester}>Confirm</button>
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </div>
            )}
            <Table<Semester>
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={(e) => { setOpen(true, e); }}
                canEdit={canEdit}
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="semesters"
            />
        </div>
    );
};

export default Semesters;
