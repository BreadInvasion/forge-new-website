import React, { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Machine, MachineGroup, MachineType } from 'src/interfaces';
import { OmniAPI } from 'src/apis/OmniAPI';
import useAuth from '../../Auth/useAuth';
import { UserPermission } from 'src/enums';
import bgPattern from 'src/assets/img/background.svg?url';
import AdminTable from './AdminTable';
import { machineColumns } from './tableDefs';

import '../styles/MachineDialog.scss';

/**
 * MachinesTab
 *
 * Lists every machine and lets admins add new machines, edit existing ones,
 * and delete them. Matches the add/edit/delete pattern used by the adjacent
 * MachineGroupsTab and MachineTypesTab so the admin experience is uniform.
 *
 * Form fields:
 *   • Machine Name            (text)
 *   • Machine Type            (select — required)
 *   • Machine Group           (select — optional)
 *   • Maintenance Mode        (checkbox, edit only)
 *   • Disabled                (checkbox, edit only)
 *
 * Wires into the OmniAPI CRUD endpoints:
 *   POST   /machines/new      create  (name, type_id, group_id)
 *   POST   /machines/{id}     edit    (name, type_id, group_id,
 *                                      maintenance_mode, disabled)
 *   DELETE /machines/{id}     delete
 *   GET    /machines/{id}     used to prefill the edit form
 */
const MachinesTab: React.FC = () => {
    const { user } = useAuth();

    const canCreate =
        user?.permissions?.includes(UserPermission.CAN_CREATE_MACHINES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canEdit =
        user?.permissions?.includes(UserPermission.CAN_EDIT_MACHINES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canDelete =
        user?.permissions?.includes(UserPermission.CAN_DELETE_MACHINES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);

    const [machines, setMachines] = useState<Machine[]>([]);
    const [types, setTypes] = useState<MachineType[]>([]);
    const [groups, setGroups] = useState<MachineGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog state. When `editingId` is null the dialog is in "create" mode;
    // otherwise it's editing the machine with that id.
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [typeId, setTypeId] = useState<string>('');
    const [groupId, setGroupId] = useState<string>('');
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);

    // Load machines + the type / group lookup lists that populate the form's
    // dropdowns. Machine types may 403 for admins without CAN_SEE_MACHINE_TYPES
    // permission, so we tolerate that failure and just render an empty select.
    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const machinesRes = await OmniAPI.getAll('machines');
            setMachines(Array.isArray(machinesRes) ? (machinesRes as Machine[]) : []);

            try {
                const typesRes = await OmniAPI.getAll('machinetypes');
                setTypes(Array.isArray(typesRes) ? (typesRes as MachineType[]) : []);
            } catch {
                // 403 for admins without CAN_SEE_MACHINE_TYPES — non-fatal.
            }

            try {
                const groupsRes = await OmniAPI.getAll('machinegroups');
                setGroups(Array.isArray(groupsRes) ? (groupsRes as MachineGroup[]) : []);
            } catch {
                // 403 for admins without CAN_SEE_MACHINE_GROUPS — non-fatal.
            }
        } catch (err) {
            console.error('Failed to load machines:', err);
            setError('Unable to load machines. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const openCreateDialog = () => {
        setEditingId(null);
        setName('');
        setTypeId('');
        setGroupId('');
        setMaintenanceMode(false);
        setDisabled(false);
        setIsOpen(true);
    };

    // Edit flow: fetch the machine by id so we get the authoritative
    // type_id / group_id / maintenance_mode / disabled values (the list
    // endpoint's MachineInfo schema already returns these, but fetching
    // the single record keeps the behavior consistent with the other tabs).
    const openEditDialog = (machine: Machine) => {
        if (!canEdit) {
            alert('You do not have permission to edit machines.');
            return;
        }
        OmniAPI.get('machines', machine.id)
            .then((full: any) => {
                setEditingId(machine.id);
                setName(full?.name ?? machine.name ?? '');
                setTypeId(String(full?.type_id ?? machine.type_id ?? ''));
                setGroupId(String(full?.group_id ?? machine.group_id ?? ''));
                setMaintenanceMode(
                    Boolean(full?.maintenance_mode ?? machine.maintenance_mode),
                );
                setDisabled(Boolean(full?.disabled ?? machine.disabled));
                setIsOpen(true);
            })
            .catch((err: any) => {
                console.error('Failed to load machine for edit:', err);
                alert('Could not load machine for editing.');
            });
    };

    // Delete flow: confirm with user, call API, refresh list. The backend
    // refuses deletion if the machine has any usages on record.
    const onDelete = (machine: Machine) => {
        if (!canDelete) {
            alert('You do not have permission to delete machines.');
            return;
        }
        const label = machine.name || 'this machine';
        if (!window.confirm(`Really delete "${label}"? This cannot be undone.`)) return;

        OmniAPI.delete('machines', machine.id)
            .then(() => {
                fetchAll();
            })
            .catch((err: any) => {
                alert(
                    'Failed to delete machine: ' +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    const onSave = () => {
        if (!name.trim()) {
            alert('Machine name is required.');
            return;
        }
        if (!typeId) {
            alert('Please select a machine type.');
            return;
        }

        // Backend accepts a null group_id (optional FK), so we translate an
        // empty-string "— none —" selection into null rather than sending an
        // invalid UUID string.
        const groupPayload = groupId ? groupId : null;

        const createPayload = {
            name: name.trim(),
            type_id: typeId,
            group_id: groupPayload,
        };

        const editPayload = {
            name: name.trim(),
            type_id: typeId,
            group_id: groupPayload,
            maintenance_mode: maintenanceMode,
            disabled: disabled,
        };

        const request =
            editingId != null
                ? OmniAPI.edit('machines', editingId, editPayload)
                : OmniAPI.create('machines', createPayload);

        const actionVerb = editingId != null ? 'edit' : 'create';

        request
            .then(() => {
                setIsOpen(false);
                fetchAll();
            })
            .catch((err: any) => {
                alert(
                    `Failed to ${actionVerb} machine: ` +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    // The + button is rendered inline after the AdminTable and absolute-
    // positioned into the data-card's title row via `.mchd-open-btn` CSS.
    const addButton = canCreate ? (
        <Dialog.Trigger asChild>
            <button
                type="button"
                className="mchd-open-btn"
                aria-label="Add machine"
                onClick={openCreateDialog}
            >
                <PlusIcon />
            </button>
        </Dialog.Trigger>
    ) : null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="mchd-tab-wrap">
                <AdminTable<Machine>
                    title="Machines"
                    columns={machineColumns}
                    rows={machines}
                    rowKey={(m) => m.id}
                    loading={loading}
                    error={error}
                    emptyMessage="No machines found."
                    onEdit={canEdit ? openEditDialog : undefined}
                    onDelete={canDelete ? onDelete : undefined}
                />
                {addButton}
            </div>

            <Dialog.Portal>
                <Dialog.Overlay className="mchd-overlay" />
                <Dialog.Content
                    className="mchd-content"
                    style={
                        {
                            ['--dialog-bg' as string]: `url(${bgPattern})`,
                        } as React.CSSProperties
                    }
                >
                    <Dialog.Close asChild>
                        <button type="button" className="mchd-close" aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>

                    <Dialog.Title className="mchd-title">
                        {editingId != null ? 'Editing' : 'Adding'} a Machine
                    </Dialog.Title>
                    <div className="mchd-title-divider" />

                    <div className="mchd-form">
                        <div className="mchd-field-row">
                            <label className="mchd-field-label" htmlFor="mchd-name">
                                Machine Name
                            </label>
                            <input
                                id="mchd-name"
                                className="mchd-field-input"
                                type="text"
                                value={name}
                                maxLength={100}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mchd-field-row">
                            <label className="mchd-field-label" htmlFor="mchd-type">
                                Machine Type
                            </label>
                            <select
                                id="mchd-type"
                                className="mchd-field-input"
                                value={typeId}
                                onChange={(e) => setTypeId(e.target.value)}
                            >
                                <option value="">— select a type —</option>
                                {types.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mchd-field-row">
                            <label className="mchd-field-label" htmlFor="mchd-group">
                                Machine Group
                            </label>
                            <select
                                id="mchd-group"
                                className="mchd-field-input"
                                value={groupId}
                                onChange={(e) => setGroupId(e.target.value)}
                            >
                                <option value="">— none —</option>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {editingId != null && (
                            <>
                                <div className="mchd-section-label">Status</div>

                                <div className="mchd-checkbox-row">
                                    <input
                                        id="mchd-maintenance"
                                        className="mchd-checkbox"
                                        type="checkbox"
                                        checked={maintenanceMode}
                                        onChange={(e) =>
                                            setMaintenanceMode(e.target.checked)
                                        }
                                    />
                                    <label
                                        htmlFor="mchd-maintenance"
                                        className="mchd-checkbox-label"
                                    >
                                        Maintenance Mode
                                    </label>
                                </div>

                                <div className="mchd-checkbox-row">
                                    <input
                                        id="mchd-disabled"
                                        className="mchd-checkbox"
                                        type="checkbox"
                                        checked={disabled}
                                        onChange={(e) => setDisabled(e.target.checked)}
                                    />
                                    <label
                                        htmlFor="mchd-disabled"
                                        className="mchd-checkbox-label"
                                    >
                                        Disabled
                                    </label>
                                </div>
                            </>
                        )}

                        <div className="mchd-save-wrap">
                            <button
                                type="button"
                                className="mchd-save-btn"
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

export default MachinesTab;
