import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { Semester } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

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

const formatType = (t: number | string): string => {
    if (typeof t === 'number') return SEMESTER_TYPE_MAP[t] ?? String(t);
    if (t in SEMESTER_TYPE_REVERSE) return t;
    return SEMESTER_TYPE_MAP[Number(t)] ?? String(t);
};

const columns: AdminTableColumn<Semester>[] = [
    {
        label: 'SEMESTER',
        width: '40%',
        render: (s) => `${formatType(s.semester_type)} ${s.calendar_year}`,
    },
    {
        label: 'TYPE',
        width: '30%',
        render: (s) => formatType(s.semester_type),
    },
    {
        label: 'YEAR',
        width: '30%',
        render: (s) => String(s.calendar_year),
    },
];

const SemestersTab: React.FC = () => {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [advancing, setAdvancing] = useState<boolean>(false);

    const loadSemesters = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await OmniAPI.getAll('semesters');
            setSemesters(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load semesters:', err);
            setError('Unable to load semesters. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            await loadSemesters();
            if (cancelled) return;
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleAdvance = async () => {
        if (!confirm('Advance to the next semester? This cannot be undone.')) return;
        setAdvancing(true);
        try {
            await OmniAPI.exec('next_semester');
            await loadSemesters();
        } catch (err) {
            console.error('Failed to advance semester:', err);
            alert('Failed to advance semester.');
        } finally {
            setAdvancing(false);
        }
    };

    const actions = (
        <button
            type="button"
            className="btn-action btn-action--purple"
            onClick={handleAdvance}
            disabled={advancing}
        >
            {advancing ? 'Advancing…' : 'Advance Semester'}
        </button>
    );

    return (
        <AdminTable<Semester>
            title="Semesters"
            columns={columns}
            rows={semesters}
            rowKey={(s) => s.id}
            loading={loading}
            error={error}
            emptyMessage="No semesters found."
            actions={actions}
        />
    );
};

export default SemestersTab;
