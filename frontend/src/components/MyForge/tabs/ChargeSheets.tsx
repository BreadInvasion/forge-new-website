import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { OmniAPI } from 'src/apis/OmniAPI';
import { UserPermission } from 'src/enums';
import Table, { ITEMS_PER_PAGE, TableHead } from '../components/Table';
import useAuth from '../../Auth/useAuth';

import { UserCharge, Semester } from 'src/interfaces';
import { SEMESTER_TYPE_MAP } from './Semesters';

type ChargeSheetCsvRow = {
    rin: string;
    firstName: string;
    lastName: string;
    membershipCharge: string;
    usagesCharge: string;
    totalCharge: string;
};

const ChargeSheets: React.FC = () => {
    const { user } = useAuth();
    const canGetCharges = user.permissions.includes(UserPermission.CAN_GET_CHARGES) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [data, setData] = useState<UserCharge[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const columns: (keyof UserCharge)[] = ['RIN', 'first_name', 'last_name', 'semester_balance', 'is_graduating'];

    const [semesterId, setSemesterId] = useState<string | null>(null);
    const [semesters, setSemesters] = useState<Semester[]>([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [membershipCharge, setMembershipCharge] = useState<number | ''>('');

    useEffect(() => {
        Promise.all([
            OmniAPI.getAll('semesters', { limit: 1000 }),
            OmniAPI.get('semesters', 'current'),
        ]).then(([all, current]) => {
            setSemesters(Array.isArray(all) ? all : []);
            setSemesterId(current.id);
        });
    }, []);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll('users', { limit: ITEMS_PER_PAGE, offset }).then((res) => {
            setData(Array.isArray(res) ? res : []);
            setCurrentPage(page);
        });
    };

    useEffect(() => {
        fetchPage(1);
    }, [semesterId]);

    const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSemesterId(e.target.value);
    };

    // CSV CREATION
    function getSemesterName(semester: Semester | undefined | null): string {
        if (!semester) return 'Semester';
        let semTypeStr = '';
        if (typeof semester.semester_type === 'number') {
            semTypeStr = SEMESTER_TYPE_MAP[semester.semester_type] ?? String(semester.semester_type);
        } else {
            semTypeStr = SEMESTER_TYPE_MAP[Number(semester.semester_type)] ?? String(semester.semester_type);
        }
        return `${semTypeStr}_${semester.calendar_year}`;
    }

    function getRowsByGraduating(charges: UserCharge[], membership: number, isGraduating: boolean): ChargeSheetCsvRow[] {
        return charges.filter((row) => Boolean(row.is_graduating) === isGraduating).map((row) => {
            const usages = Number(row.semester_balance ?? 0);
            const total = membership + usages;
            return {
                rin: row.RIN,
                firstName: row.first_name,
                lastName: row.last_name,
                membershipCharge: membership.toFixed(2),
                usagesCharge: usages.toFixed(2),
                totalCharge: total.toFixed(2)
            };
        });
    }

    function downloadCSV(rows: ChargeSheetCsvRow[], semesterName: string, graduatingornot: string) {
        const csvHeader = ['RIN', 'First Name', 'Last Name', 'Membership Charge', 'Usages Charge', 'Total Charge'];
        const escapeCSV = (field: any) => {
            const str = String(field ?? '');
            if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };
        const csvRows = rows.map((row) => [
            row.rin,
            row.firstName,
            row.lastName,
            row.membershipCharge,
            row.usagesCharge,
            row.totalCharge
        ]);
        const csvContent = [csvHeader, ...csvRows]
            .map(r => r.map(escapeCSV).join(','))
            .join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${semesterName}_Forge_Charges_${graduatingornot}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const handleCreateChargeSheet = async () => {
        if (!semesterId || membershipCharge === '' || isNaN(Number(membershipCharge))) {
            alert('Please select a semester and enter a valid membership charge.');
            return;
        }
        try {
            const chargesResponse = await OmniAPI.exec('get_charges', { semester_id: semesterId });
            const charges: UserCharge[] = Array.isArray(chargesResponse) ? chargesResponse : [];
            const membership = Number(membershipCharge);

            const graduatingRows = getRowsByGraduating(charges, membership, true);
            const nongraduatingRows = getRowsByGraduating(charges, membership, false);

            const selectedSemester = semesters.find(s => String(s.id) === String(semesterId));
            const semesterName = getSemesterName(selectedSemester);

            if (graduatingRows.length > 0) downloadCSV(graduatingRows, semesterName, 'graduating');
            if (nongraduatingRows.length > 0) downloadCSV(nongraduatingRows, semesterName, 'nongraduating');
            setDialogOpen(false);
        } catch (err) {
            alert('Failed to create charge sheet.');
        }
    };

    if (!canGetCharges) return null;
    return (
        <div className='tab-column-cover align-center'>
            <TableHead heading="Charge Sheets" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%',  padding: 30}}>
                <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <Dialog.Trigger asChild>
                        <button type="button" className="Button OfficerBtn">
                            Create Charge Sheet
                        </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <div className='AEdiv'>
                            <Dialog.Overlay className="DialogOverlay" />
                            <Dialog.Content className="DialogContent" aria-describedby={undefined} style={{ minWidth: 320 }}>
                                <Dialog.Close asChild>
                                    <button className="IconButton" aria-label="Close">
                                        <Cross2Icon />
                                    </button>
                                </Dialog.Close>
                                <Dialog.Title className="DialogTitle">Create Semester Charge Sheet</Dialog.Title>
                                <fieldset className="Fieldset">
                                    <label className="Label" htmlFor="semester-select">Semester:</label>
                                    <select  id="semester-select" value={semesterId ?? ''} onChange={handleSemesterChange} disabled={semesters.length === 0} style={{ width: '100%' }} >
                                        {semesters.map((sem) => (
                                            <option key={sem.id} value={sem.id}>
                                                {getSemesterName(sem).replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </fieldset>
                                <fieldset className="Fieldset">
                                    <label className="Label" htmlFor="membership-charge-input">Semester membership charge:</label>
                                    <input className="Input" id="membership-charge-input" type="number"  min="0" value={membershipCharge} onChange={e => setMembershipCharge(e.target.value === '' ? '' : Number(e.target.value))} style={{ width: '100%' }}/>
                                </fieldset>
                                <div className="dialog-actions" style={{ marginTop: 16 }}>
                                    <button className="Button SaveBtn" style={{ minWidth: 80 }} onClick={handleCreateChargeSheet}>
                                        Download
                                    </button>
                                </div>
                            </Dialog.Content>
                        </div>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>

            <div style={{ color: 'red',  paddingLeft: 32, paddingRight: 32}}>
                Warning: The data below is a visual of the current semester. Export the csv for the charge sheet.
            </div>
            <Table<UserCharge>
                columns={columns}
                data={data}
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="users"
            />
        </div>
    );
};

export default ChargeSheets;
