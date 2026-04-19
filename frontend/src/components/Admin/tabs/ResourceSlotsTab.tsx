import React, { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Resource, ResourceSlot } from 'src/interfaces';
import { OmniAPI } from 'src/apis/OmniAPI';
import useAuth from '../../Auth/useAuth';
import { UserPermission } from 'src/enums';
import bgPattern from 'src/assets/img/background.svg?url';
import AdminTable from './AdminTable';
import { resourceSlotColumns } from './tableDefs';

// Reuses the same Figma-matching dialog chrome as MachineTypesTab — the
// "Adding a Resource Slot" mock is visually identical (navy frame, red Save
// button, checkbox lists). Keeping one copy of those styles.
import '../styles/MachineTypeDialog.scss';

/**
 * ResourceSlotsTab
 *
 * Lists all resource slots and lets admins create, edit, or delete them
 * via the Figma "Adding a Resource Slot" dialog.
 *
 * Form fields (matches the Figma mock):
 *   • Slot Name   — sent as both `db_name` and `display_name` on the
 *                   backend to match the existing MyForge precedent.
 *   • Resources   — a checkbox per existing Resource (PLA, Vinyl, Resin…)
 *                   which populates `resource_ids`.
 *   • Restrictions:
 *       • Allow empty        → `allow_empty`
 *       • Allow own material → `allow_own_material`
 *
 * Wires into the existing OmniAPI CRUD endpoints:
 *   POST   /resourceslots/new    create
 *   POST   /resourceslots/{id}   edit
 *   DELETE /resourceslots/{id}   delete
 *   GET    /resourceslots/{id}   used to prefill the edit form
 */
const ResourceSlotsTab: React.FC = () => {
    const { user } = useAuth();

    const canCreate =
        user?.permissions?.includes(UserPermission.CAN_CREATE_RESOURCE_SLOTS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canEdit =
        user?.permissions?.includes(UserPermission.CAN_EDIT_RESOURCE_SLOTS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canDelete =
        user?.permissions?.includes(UserPermission.CAN_DELETE_RESOURCE_SLOTS) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);

    const [slots, setSlots] = useState<ResourceSlot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // All existing resources — populates the checkbox list in the dialog.
    const [resources, setResources] = useState<Resource[]>([]);

    // Dialog state. When `editingId` is null the dialog is in "create" mode.
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [resourceIDS, setResourceIDS] = useState<string[]>([]);
    const [allowEmpty, setAllowEmpty] = useState<boolean>(false);
    const [allowOwn, setAllowOwn] = useState<boolean>(false);

    // Fetch both slots + resources in parallel.
    const fetchSlots = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [slotsRes, resourcesRes] = await Promise.all([
                OmniAPI.getAll('resourceslots'),
                OmniAPI.getAll('resources'),
            ]);
            setSlots(Array.isArray(slotsRes) ? (slotsRes as ResourceSlot[]) : []);
            setResources(
                Array.isArray(resourcesRes) ? (resourcesRes as Resource[]) : [],
            );
        } catch (err) {
            console.error('Failed to load resource slots:', err);
            setError('Unable to load resource slots. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Just the resources checkbox list — cheap side-fetch so the dialog picks
    // up resources added in the sibling Resources tab without refetching the
    // whole slots table and flashing its loading state.
    const refreshResources = useCallback(async () => {
        try {
            const resourcesRes = await OmniAPI.getAll('resources');
            setResources(
                Array.isArray(resourcesRes) ? (resourcesRes as Resource[]) : [],
            );
        } catch (err) {
            console.error('Failed to refresh resources:', err);
        }
    }, []);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    const openCreateDialog = () => {
        setEditingId(null);
        setName('');
        setResourceIDS([]);
        setAllowEmpty(false);
        setAllowOwn(false);
        setIsOpen(true);
        refreshResources();
    };

    // Edit flow: fetch by id so we can prefill valid_resource_ids and flags.
    const openEditDialog = (s: ResourceSlot) => {
        if (!canEdit) {
            alert('You do not have permission to edit resource slots.');
            return;
        }
        // Refresh the resource checkbox list alongside the prefill fetch so
        // newly added resources show up when editing an existing slot.
        refreshResources();
        OmniAPI.get('resourceslots', s.id)
            .then((full: any) => {
                setEditingId(s.id);
                setName(full?.display_name ?? full?.name ?? s.display_name ?? s.name ?? '');
                setResourceIDS(
                    Array.isArray(full?.valid_resource_ids)
                        ? full.valid_resource_ids
                        : Array.isArray(s.valid_resource_ids)
                          ? s.valid_resource_ids
                          : [],
                );
                setAllowEmpty(Boolean(full?.allow_empty ?? s.allow_empty));
                setAllowOwn(
                    Boolean(full?.allow_own_material ?? s.allow_own_material),
                );
                setIsOpen(true);
            })
            .catch((err: any) => {
                console.error('Failed to load resource slot for edit:', err);
                alert('Could not load resource slot for editing.');
            });
    };

    const onDelete = (s: ResourceSlot) => {
        if (!canDelete) {
            alert('You do not have permission to delete resource slots.');
            return;
        }
        const label = s.display_name || s.name || 'this resource slot';
        if (!window.confirm(`Really delete "${label}"? This cannot be undone.`)) return;

        OmniAPI.delete('resourceslots', s.id)
            .then(() => {
                fetchSlots();
            })
            .catch((err: any) => {
                alert(
                    'Failed to delete resource slot: ' +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    const toggleResource = (id: string) => {
        setResourceIDS((prev) => {
            const p = prev ?? [];
            return p.includes(id) ? p.filter((i) => i !== id) : [...p, id];
        });
    };

    const onSave = () => {
        if (!name.trim()) {
            alert('Slot name is required.');
            return;
        }

        // The backend ResourceSlotCreate/EditRequest expects both `db_name`
        // and `display_name`. Matching the existing MyForge pattern where
        // the user-typed slot name is used for both fields.
        const payload = {
            db_name: name.trim(),
            display_name: name.trim(),
            resource_ids: resourceIDS,
            allow_empty: allowEmpty,
            allow_own_material: allowOwn,
        };

        const request =
            editingId != null
                ? OmniAPI.edit('resourceslots', editingId, payload)
                : OmniAPI.create('resourceslots', payload);

        const actionVerb = editingId != null ? 'edit' : 'create';

        request
            .then(() => {
                setIsOpen(false);
                fetchSlots();
            })
            .catch((err: any) => {
                alert(
                    `Failed to ${actionVerb} resource slot: ` +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    const addButton = canCreate ? (
        <Dialog.Trigger asChild>
            <button
                type="button"
                className="mtd-open-btn"
                aria-label="Add resource slot"
                onClick={openCreateDialog}
            >
                <PlusIcon />
            </button>
        </Dialog.Trigger>
    ) : null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="mtd-tab-wrap">
                <AdminTable<ResourceSlot>
                    title="Resource Slots"
                    columns={resourceSlotColumns}
                    rows={slots}
                    rowKey={(s) => s.id}
                    loading={loading}
                    error={error}
                    emptyMessage="No resource slots found."
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
                        {editingId != null ? 'Editing' : 'Adding'} a Resource Slot
                    </Dialog.Title>
                    <div className="mtd-title-divider" />

                    <div className="mtd-form">
                        <div className="mtd-name-row">
                            <label className="mtd-name-label" htmlFor="rsd-name">
                                Slot Name
                            </label>
                            <input
                                id="rsd-name"
                                className="mtd-name-input"
                                type="text"
                                value={name}
                                maxLength={100}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mtd-section-label">Resources</div>
                        <div className="mtd-slot-list">
                            {resources.length === 0 ? (
                                <div className="mtd-slot-empty">
                                    No resources available to assign.
                                </div>
                            ) : (
                                resources.map((r) => (
                                    <div className="mtd-checkbox-row" key={r.id}>
                                        <input
                                            id={`rsd-res-${r.id}`}
                                            className="mtd-checkbox"
                                            type="checkbox"
                                            checked={resourceIDS.includes(r.id)}
                                            onChange={() => toggleResource(r.id)}
                                        />
                                        <label
                                            htmlFor={`rsd-res-${r.id}`}
                                            className="mtd-checkbox-label"
                                        >
                                            {r.name}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mtd-section-label">Restrictions</div>
                        <div className="mtd-slot-list">
                            <div className="mtd-checkbox-row">
                                <input
                                    id="rsd-allow-empty"
                                    className="mtd-checkbox"
                                    type="checkbox"
                                    checked={allowEmpty}
                                    onChange={(e) => setAllowEmpty(e.target.checked)}
                                />
                                <label
                                    htmlFor="rsd-allow-empty"
                                    className="mtd-checkbox-label"
                                >
                                    Allow empty
                                </label>
                            </div>
                            <div className="mtd-checkbox-row">
                                <input
                                    id="rsd-allow-own"
                                    className="mtd-checkbox"
                                    type="checkbox"
                                    checked={allowOwn}
                                    onChange={(e) => setAllowOwn(e.target.checked)}
                                />
                                <label
                                    htmlFor="rsd-allow-own"
                                    className="mtd-checkbox-label"
                                >
                                    Allow own material
                                </label>
                            </div>
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

export default ResourceSlotsTab;
