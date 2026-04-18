import React, { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { MachineType, ResourceSlot } from 'src/interfaces';
import { OmniAPI } from 'src/apis/OmniAPI';
import useAuth from '../../Auth/useAuth';
import { UserPermission } from 'src/enums';
import bgPattern from 'src/assets/img/background.svg?url';
import AdminTable from './AdminTable';
import { machineTypeColumns } from './tableDefs';

import '../styles/MachineTypeDialog.scss';

/**
 * MachineTypesTab
 *
 * Lists all machine types and lets admins create, edit, or delete them.
 *
 * Form fields (matches the Figma mock):
 *   • Machine Type Name
 *   • Hourly Usage Cost
 *   • Resources — a checkbox per ResourceSlot (the backend stores the
 *     many-to-many relationship as resource_slot_ids, so the checkboxes
 *     are slots, not raw resource materials)
 *
 * Wires into the existing OmniAPI CRUD endpoints:
 *   POST   /machinetypes/new        create
 *   POST   /machinetypes/{id}       edit
 *   DELETE /machinetypes/{id}       delete
 *   GET    /machinetypes/{id}       used to prefill the edit form, since
 *                                   the list endpoint doesn't return slot
 *                                   ids on every row in some response shapes
 */
const MachineTypesTab: React.FC = () => {
    const { user } = useAuth();

    const canCreate =
        user?.permissions?.includes(UserPermission.CAN_CREATE_MACHINE_TYPES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canEdit =
        user?.permissions?.includes(UserPermission.CAN_EDIT_MACHINE_TYPES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canDelete =
        user?.permissions?.includes(UserPermission.CAN_DELETE_MACHINE_TYPES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);

    const [types, setTypes] = useState<MachineType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // All existing resource slots — used to populate the checkbox list in
    // the create/edit dialog.
    const [slots, setSlots] = useState<ResourceSlot[]>([]);

    // Dialog state. When `editingId` is null the dialog is in "create" mode;
    // otherwise it's editing the machine type with that id.
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [costPerHour, setCostPerHour] = useState<string>('');
    const [slotIDS, setSlotIDS] = useState<string[]>([]);

    // Fetches both machine types + resource slots in parallel.
    const fetchTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [typesRes, slotsRes] = await Promise.all([
                OmniAPI.getAll('machinetypes'),
                OmniAPI.getAll('resourceslots'),
            ]);

            setTypes(Array.isArray(typesRes) ? (typesRes as MachineType[]) : []);
            setSlots(Array.isArray(slotsRes) ? (slotsRes as ResourceSlot[]) : []);
        } catch (err) {
            console.error('Failed to load machine types:', err);
            setError('Unable to load machine types. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    const openCreateDialog = () => {
        setEditingId(null);
        setName('');
        setCostPerHour('');
        setSlotIDS([]);
        setIsOpen(true);
    };

    // Edit flow: fetch the machine type by id (so we can pre-fill
    // resource_slot_ids and the latest cost), then open the dialog.
    const openEditDialog = (mt: MachineType) => {
        if (!canEdit) {
            alert('You do not have permission to edit machine types.');
            return;
        }
        OmniAPI.get('machinetypes', mt.id)
            .then((full: any) => {
                setEditingId(mt.id);
                setName(full?.name ?? mt.name ?? '');
                setCostPerHour(
                    full?.cost_per_hour != null
                        ? String(full.cost_per_hour)
                        : mt.cost_per_hour != null
                          ? String(mt.cost_per_hour)
                          : '',
                );
                setSlotIDS(
                    Array.isArray(full?.resource_slot_ids)
                        ? full.resource_slot_ids
                        : Array.isArray(mt.resource_slot_ids)
                          ? mt.resource_slot_ids
                          : [],
                );
                setIsOpen(true);
            })
            .catch((err: any) => {
                console.error('Failed to load machine type for edit:', err);
                alert('Could not load machine type for editing.');
            });
    };

    // Delete flow: confirm with user, call API, refresh list. The backend
    // refuses deletion if any machines reference this type, so we surface
    // the server's error detail when that happens.
    const onDelete = (mt: MachineType) => {
        if (!canDelete) {
            alert('You do not have permission to delete machine types.');
            return;
        }
        const label = mt.name || 'this machine type';
        if (!window.confirm(`Really delete "${label}"? This cannot be undone.`)) return;

        OmniAPI.delete('machinetypes', mt.id)
            .then(() => {
                fetchTypes();
            })
            .catch((err: any) => {
                alert(
                    'Failed to delete machine type: ' +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    const handleCheckboxChange = (value: string) => {
        setSlotIDS((prev) => {
            const p = prev ?? [];
            return p.includes(value) ? p.filter((i) => i !== value) : [...p, value];
        });
    };

    const onSave = () => {
        if (!name.trim()) {
            alert('Machine type name is required.');
            return;
        }

        const cost = Number(costPerHour);
        if (!Number.isFinite(cost) || cost < 0) {
            alert('Hourly usage cost must be a non-negative number.');
            return;
        }

        // Send cost as a string to preserve decimal precision through JSON,
        // matching the existing MyForge MachineTypes flow and the backend's
        // DECIMAL(10, 5) column.
        const payload = {
            name: name.trim(),
            resource_slot_ids: slotIDS,
            cost_per_hour: cost.toString(),
        };

        const request =
            editingId != null
                ? OmniAPI.edit('machinetypes', editingId, payload)
                : OmniAPI.create('machinetypes', payload);

        const actionVerb = editingId != null ? 'edit' : 'create';

        request
            .then(() => {
                setIsOpen(false);
                fetchTypes();
            })
            .catch((err: any) => {
                alert(
                    `Failed to ${actionVerb} machine type: ` +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    // The + button is rendered inline after the AdminTable and absolute-
    // positioned into the data-card's title row via `.mtd-open-btn` CSS.
    const addButton = canCreate ? (
        <Dialog.Trigger asChild>
            <button
                type="button"
                className="mtd-open-btn"
                aria-label="Add machine type"
                onClick={openCreateDialog}
            >
                <PlusIcon />
            </button>
        </Dialog.Trigger>
    ) : null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="mtd-tab-wrap">
                <AdminTable<MachineType>
                    title="Machine Types"
                    columns={machineTypeColumns}
                    rows={types}
                    rowKey={(t) => t.id}
                    loading={loading}
                    error={error}
                    emptyMessage="No machine types found."
                    onEdit={canEdit ? openEditDialog : undefined}
                    onDelete={canDelete ? onDelete : undefined}
                />
                {addButton}
            </div>

            <Dialog.Portal>
                <Dialog.Overlay className="mtd-overlay" />
                <Dialog.Content
                    className="mtd-content"
                    style={
                        {
                            ['--dialog-bg' as string]: `url(${bgPattern})`,
                        } as React.CSSProperties
                    }
                >
                    <Dialog.Close asChild>
                        <button type="button" className="mtd-close" aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>

                    <Dialog.Title className="mtd-title">
                        {editingId != null ? 'Editing' : 'Adding'} a Machine Type
                    </Dialog.Title>
                    <div className="mtd-title-divider" />

                    <div className="mtd-form">
                        <div className="mtd-name-row">
                            <label className="mtd-name-label" htmlFor="mtd-name">
                                Machine Type Name
                            </label>
                            <input
                                id="mtd-name"
                                className="mtd-name-input"
                                type="text"
                                value={name}
                                maxLength={100}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mtd-cost-row">
                            <label className="mtd-cost-label" htmlFor="mtd-cost">
                                Hourly Usage Cost
                            </label>
                            <input
                                id="mtd-cost"
                                className="mtd-cost-input"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={costPerHour}
                                onChange={(e) => setCostPerHour(e.target.value)}
                            />
                        </div>

                        <div className="mtd-section-label">Resources</div>

                        <div className="mtd-slot-list">
                            {slots.length === 0 ? (
                                <div className="mtd-slot-empty">
                                    No resource slots available to assign.
                                </div>
                            ) : (
                                slots.map((s: ResourceSlot) => (
                                    <div className="mtd-checkbox-row" key={s.id}>
                                        <input
                                            id={`mtd-slot-${s.id}`}
                                            className="mtd-checkbox"
                                            type="checkbox"
                                            checked={slotIDS.includes(s.id)}
                                            onChange={() => handleCheckboxChange(s.id)}
                                        />
                                        <label
                                            htmlFor={`mtd-slot-${s.id}`}
                                            className="mtd-checkbox-label"
                                        >
                                            {s.display_name || s.name || s.id}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mtd-save-wrap">
                            <button
                                type="button"
                                className="mtd-save-btn"
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

export default MachineTypesTab;
