import React, { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Machine, MachineGroup } from 'src/interfaces';
import { OmniAPI } from 'src/apis/OmniAPI';
import useAuth from '../../Auth/useAuth';
import { UserPermission } from 'src/enums';
import bgPattern from 'src/assets/img/background.svg?url';
import AdminTable from './AdminTable';
import { machineGroupColumns } from './tableDefs';

import '../styles/MachineGroupsDialog.scss';

/**
 * MachineGroupsTab
 *
 * Lists all machine groups and lets admins create a new one. The create flow
 * is matched to Figma node 91-373.
 *
 * Data loading mirrors the original MyForge MachineGroups tab: we fetch the
 * full machines list first so we can map `machine_ids[]` → machine name
 * strings when rendering each group row, because the `MACHINES` column in
 * `tableDefs.machineGroupColumns` displays human-readable names.
 */
const MachineGroupsTab: React.FC = () => {
    const { user } = useAuth();

    const canCreate =
        user?.permissions?.includes(UserPermission.CAN_CREATE_MACHINE_GROUPS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canEdit =
        user?.permissions?.includes(UserPermission.CAN_EDIT_MACHINE_GROUPS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canDelete =
        user?.permissions?.includes(UserPermission.CAN_DELETE_MACHINE_GROUPS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);

    const [groups, setGroups] = useState<MachineGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // All existing machines — used to both populate the checkbox list in the
    // create dialog and to translate machine_ids → machine names on each row.
    const [machines, setMachines] = useState<Machine[]>([]);

    // Dialog state. When `editingId` is null the dialog is in "create" mode;
    // otherwise it's editing the group with that id.
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [machineIDS, setMachineIDS] = useState<string[]>([]);

    // Fetches both machines + groups, then joins machine_ids to names so the
    // "MACHINES" column can render human-readable values.
    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [machinesRes, groupsRes] = await Promise.all([
                OmniAPI.getAll('machines'),
                OmniAPI.getAll('machinegroups'),
            ]);

            const machineList: Machine[] = Array.isArray(machinesRes) ? machinesRes : [];
            setMachines(machineList);

            const idToName: Record<string, string> = {};
            machineList.forEach((m) => {
                if (m?.id) idToName[m.id] = m.name || '';
            });

            const rawGroups: any[] = Array.isArray(groupsRes) ? groupsRes : [];
            const mapped: MachineGroup[] = rawGroups.map((g) => ({
                id: g.id,
                name: g.name,
                // Prefer the joined names; fall back to an empty array so the
                // column renderer shows "—" via joinList().
                machines: Array.isArray(g.machine_ids)
                    ? g.machine_ids
                          .map((id: string) => idToName[id])
                          .filter((v: string | undefined): v is string => Boolean(v))
                    : [],
            }));

            setGroups(mapped);
        } catch (err) {
            console.error('Failed to load machine groups:', err);
            setError('Unable to load machine groups. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const openCreateDialog = () => {
        setEditingId(null);
        setName('');
        setMachineIDS([]);
        setIsOpen(true);
    };

    // Edit flow: fetch the group by id (so we can pre-fill machine_ids),
    // then open the dialog pre-populated.
    const openEditDialog = (group: MachineGroup) => {
        if (!canEdit) {
            alert('You do not have permission to edit machine groups.');
            return;
        }
        OmniAPI.get('machinegroups', group.id)
            .then((full: any) => {
                setEditingId(group.id);
                setName(full?.name ?? group.name ?? '');
                setMachineIDS(Array.isArray(full?.machine_ids) ? full.machine_ids : []);
                setIsOpen(true);
            })
            .catch((err: any) => {
                console.error('Failed to load machine group for edit:', err);
                alert('Could not load machine group for editing.');
            });
    };

    // Delete flow: confirm with user, call API, refresh list.
    const onDelete = (group: MachineGroup) => {
        if (!canDelete) {
            alert('You do not have permission to delete machine groups.');
            return;
        }
        const label = group.name || 'this machine group';
        if (!window.confirm(`Really delete "${label}"? This cannot be undone.`)) return;

        OmniAPI.delete('machinegroups', group.id)
            .then(() => {
                fetchGroups();
            })
            .catch((err: any) => {
                alert(
                    'Failed to delete machine group: ' +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    const handleCheckboxChange = (value: string) => {
        setMachineIDS((prev) => {
            const p = prev ?? [];
            return p.includes(value) ? p.filter((i) => i !== value) : [...p, value];
        });
    };

    const onSave = () => {
        if (!name.trim()) {
            alert('Group name is required.');
            return;
        }

        const payload = {
            name: name.trim(),
            machine_ids: machineIDS,
        };

        const request =
            editingId != null
                ? OmniAPI.edit('machinegroups', editingId, payload)
                : OmniAPI.create('machinegroups', payload);

        const actionVerb = editingId != null ? 'edit' : 'create';

        request
            .then(() => {
                setIsOpen(false);
                // Refresh in place — no full page reload — so the updated
                // rows appear immediately with joined machine names.
                fetchGroups();
            })
            .catch((err: any) => {
                alert(
                    `Failed to ${actionVerb} machine group: ` +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    // The + button is rendered inline after the AdminTable and absolute-
    // positioned into the data-card's title row via `.mgd-open-btn` CSS.
    const addButton = canCreate ? (
        <Dialog.Trigger asChild>
            <button
                type="button"
                className="mgd-open-btn"
                aria-label="Add machine group"
                onClick={openCreateDialog}
            >
                <PlusIcon />
            </button>
        </Dialog.Trigger>
    ) : null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="mgd-tab-wrap">
                <AdminTable<MachineGroup>
                    title="Machines Groups"
                    columns={machineGroupColumns}
                    rows={groups}
                    rowKey={(g) => g.id}
                    loading={loading}
                    error={error}
                    emptyMessage="No machine groups found."
                    onEdit={canEdit ? openEditDialog : undefined}
                    onDelete={canDelete ? onDelete : undefined}
                />
                {addButton}
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

                    <Dialog.Title className="mgd-title">
                        {editingId != null ? 'Editing' : 'Adding'} Machine Group
                    </Dialog.Title>
                    <div className="mgd-title-divider" />

                    <div className="mgd-form">
                        <div className="mgd-name-row">
                            <label className="mgd-name-label" htmlFor="mgd-name">
                                Group Name
                            </label>
                            <input
                                id="mgd-name"
                                className="mgd-name-input"
                                type="text"
                                value={name}
                                maxLength={100}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mgd-machine-list">
                            {machines.length === 0 ? (
                                <div className="mgd-machine-empty">
                                    No machines available to assign.
                                </div>
                            ) : (
                                machines.map((m: Machine) => (
                                    <div className="mgd-checkbox-row" key={m.id}>
                                        <input
                                            id={`mgd-machine-${m.id}`}
                                            className="mgd-checkbox"
                                            type="checkbox"
                                            checked={machineIDS.includes(m.id)}
                                            onChange={() => handleCheckboxChange(m.id)}
                                        />
                                        <label
                                            htmlFor={`mgd-machine-${m.id}`}
                                            className="mgd-checkbox-label"
                                        >
                                            {m.name}
                                        </label>
                                    </div>
                                ))
                            )}
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

export default MachineGroupsTab;
