import React, { useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { Semester } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { semesterColumns } from './tableDefs';

const SemestersTab: React.FC = () => {
    const { rows, loading, error } = useOmniList<Semester>('semesters', 'semesters');
    const [advancing, setAdvancing] = useState<boolean>(false);

    const handleAdvance = async () => {
        if (!confirm('Advance to the next semester? This cannot be undone.')) return;
        setAdvancing(true);
        try {
            await OmniAPI.exec('next_semester');
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
            className="btn-action btn-action--red"
            onClick={handleAdvance}
            disabled={advancing}
        >
            {advancing ? 'Advancing…' : 'Advance Semester'}
        </button>
    );

    return (
        <AdminTable<Semester>
            title="Semesters"
            columns={semesterColumns}
            rows={rows}
            rowKey={(s) => s.id}
            loading={loading}
            error={error}
            emptyMessage="No semesters found."
            actions={actions}
        />
    );
};

export default SemestersTab;
