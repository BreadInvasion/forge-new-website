import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { UserCharge, Semester } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { userChargeColumns, getSemesterName } from './tableDefs';

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
    const users = useOmniList<UserCharge>('users', 'users');
    const semesters = useOmniList<Semester>('semesters', 'semesters');

    const [semesterId, setSemesterId] = useState<string>('');
    const [membershipCharge, setMembershipCharge] = useState<string>('');
    const [generating, setGenerating] = useState<boolean>(false);

    useEffect(() => {
        if (semesterId || semesters.rows.length === 0) return;
        (async () => {
            try {
                const current = await OmniAPI.get('semesters', 'current');
                if (current && current.id) {
                    setSemesterId(current.id);
                    return;
                }
            } catch {
                // fall through to default
            }
            setSemesterId(semesters.rows[0].id);
        })();
    }, [semesters.rows, semesterId]);

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
            const semName = getSemesterName(
                semesters.rows.find((s) => String(s.id) === String(semesterId)),
            );

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
                disabled={semesters.rows.length === 0}
                aria-label="Semester"
            >
                {semesters.rows.length === 0 && <option value="">No semesters</option>}
                {semesters.rows.map((s) => (
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
                className="btn-action btn-action--red"
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
            columns={userChargeColumns}
            rows={users.rows}
            rowKey={(c) => `${c.RIN}-${c.first_name}-${c.last_name}`}
            loading={users.loading}
            error={users.error}
            emptyMessage="No users found."
            actions={actions}
        />
    );
};

export default ChargeSheetsTab;
