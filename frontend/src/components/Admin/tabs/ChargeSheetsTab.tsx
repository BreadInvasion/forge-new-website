import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { UserCharge, Semester } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

const SEMESTER_TYPE_MAP: { [key: number]: string } = {
    0: 'Fall',
    1: 'Spring',
    2: 'Summer',
};

const getSemesterName = (sem: Semester | null | undefined): string => {
    if (!sem) return 'Semester';
    const typeKey =
        typeof sem.semester_type === 'number'
            ? sem.semester_type
            : Number(sem.semester_type);
    const typeStr = SEMESTER_TYPE_MAP[typeKey] ?? String(sem.semester_type);
    return `${typeStr}_${sem.calendar_year}`;
};

const columns: AdminTableColumn<UserCharge>[] = [
    {
        label: 'RIN',
        width: '18%',
        render: (c) => c.RIN || '—',
    },
    {
        label: 'FIRST NAME',
        width: '22%',
        render: (c) => c.first_name || '—',
    },
    {
        label: 'LAST NAME',
        width: '22%',
        render: (c) => c.last_name || '—',
    },
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

type CsvRow = {
    rin: string;
    firstName: string;
    lastName: string;
    membershipCharge: string;
    usagesCharge: string;
    totalCharge: string;
};

const downloadCSV = (
    rows: CsvRow[],
    semesterName: string,
    graduatingOrNot: string,
): void => {
    const header = [
        'RIN',
        'First Name',
        'Last Name',
        'Membership Charge',
        'Usages Charge',
        'Total Charge',
    ];
    const escape = (field: unknown): string => {
        const str = String(field ?? '');
        if (
            str.includes('"') ||
            str.includes(',') ||
            str.includes('\n') ||
            str.includes('\r')
        ) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };
    const body = rows.map((r) => [
        r.rin,
        r.firstName,
        r.lastName,
        r.membershipCharge,
        r.usagesCharge,
        r.totalCharge,
    ]);
    const csv = [header, ...body].map((row) => row.map(escape).join(',')).join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${semesterName}_Forge_Charges_${graduatingOrNot}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const ChargeSheetsTab: React.FC = () => {
    const [data, setData] = useState<UserCharge[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [semesterId, setSemesterId] = useState<string>('');
    const [membershipCharge, setMembershipCharge] = useState<string>('');
    const [generating, setGenerating] = useState<boolean>(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const [users, allSemesters, current] = await Promise.all([
                    OmniAPI.getAll('users'),
                    OmniAPI.getAll('semesters', { limit: 1000 }),
                    OmniAPI.get('semesters', 'current').catch(() => null),
                ]);
                if (cancelled) return;
                setData(Array.isArray(users) ? users : []);
                const semList = Array.isArray(allSemesters) ? allSemesters : [];
                setSemesters(semList);
                if (current && current.id) {
                    setSemesterId(current.id);
                } else if (semList.length > 0) {
                    setSemesterId(semList[0].id);
                }
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load charge sheet data:', err);
                setError('Unable to load charge sheet data. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleCreate = async () => {
        if (!semesterId) {
            alert('Please select a semester.');
            return;
        }
        const membership = Number(membershipCharge);
        if (membershipCharge === '' || Number.isNaN(membership)) {
            alert('Please enter a valid membership charge.');
            return;
        }

        setGenerating(true);
        try {
            const resp = await OmniAPI.exec('get_charges', { semester_id: semesterId });
            const charges: UserCharge[] = Array.isArray(resp) ? resp : [];
            const makeRow = (row: UserCharge): CsvRow => {
                const usages = Number(row.semester_balance ?? 0);
                const total = membership + usages;
                return {
                    rin: row.RIN,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    membershipCharge: membership.toFixed(2),
                    usagesCharge: usages.toFixed(2),
                    totalCharge: total.toFixed(2),
                };
            };
            const graduating = charges.filter((c) => c.is_graduating).map(makeRow);
            const nongrad = charges.filter((c) => !c.is_graduating).map(makeRow);
            const semName = getSemesterName(semesters.find((s) => String(s.id) === String(semesterId)));

            if (graduating.length > 0) downloadCSV(graduating, semName, 'graduating');
            if (nongrad.length > 0) downloadCSV(nongrad, semName, 'nongraduating');
            if (graduating.length === 0 && nongrad.length === 0) {
                alert('No charges found for the selected semester.');
            }
        } catch (err) {
            console.error('Failed to generate charge sheet:', err);
            alert('Failed to create charge sheet.');
        } finally {
            setGenerating(false);
        }
    };

    const actions = (
        <>
            <select
                className="Input"
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                disabled={semesters.length === 0}
                aria-label="Semester"
            >
                {semesters.length === 0 && <option value="">No semesters</option>}
                {semesters.map((s) => (
                    <option key={s.id} value={s.id}>
                        {getSemesterName(s).replace('_', ' ')}
                    </option>
                ))}
            </select>
            <input
                className="Input"
                type="number"
                min={0}
                placeholder="Membership charge"
                value={membershipCharge}
                onChange={(e) => setMembershipCharge(e.target.value)}
                aria-label="Membership charge"
            />
            <button
                type="button"
                className="btn-action btn-action--purple"
                onClick={handleCreate}
                disabled={generating}
            >
                {generating ? 'Generating…' : 'Create Charge Sheet'}
            </button>
        </>
    );

    return (
        <AdminTable<UserCharge>
            title="Charge Sheets"
            columns={columns}
            rows={data}
            rowKey={(c) => `${c.RIN}-${c.first_name}-${c.last_name}`}
            loading={loading}
            error={error}
            emptyMessage="No users found."
            actions={actions}
        />
    );
};

export default ChargeSheetsTab;
