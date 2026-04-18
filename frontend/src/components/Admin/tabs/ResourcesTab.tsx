import React, { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Resource } from 'src/interfaces';
import { OmniAPI } from 'src/apis/OmniAPI';
import useAuth from '../../Auth/useAuth';
import { UserPermission } from 'src/enums';
import bgPattern from 'src/assets/img/background.svg?url';
import AdminTable from './AdminTable';
import { resourceColumns } from './tableDefs';

// Reuses the same Figma-matching dialog chrome as MachineTypesTab — the
// "Adding a Resource" mock is visually identical (navy frame, red Save
// button, stacked labelled inputs). Keeping one copy of those styles.
import '../styles/MachineTypeDialog.scss';

/**
 * ResourcesTab
 *
 * Lists all resources (e.g. PLA, Vinyl, Resin) and lets admins create,
 * edit, or delete them via the Figma "Adding a Resource" dialog.
 *
 * Form fields (matches the Figma mock):
 *   • Resource Name
 *   • Resource Brand
 *   • Resource Color
 *   • Resource Units   (e.g. "g", "ft", "mL")
 *   • Resource Cost    (per-unit cost, stored as DECIMAL(10, 5))
 *
 * Wires into the existing OmniAPI CRUD endpoints:
 *   POST   /resources/new    create
 *   POST   /resources/{id}   edit
 *   DELETE /resources/{id}   delete
 *   GET    /resources/{id}   used to prefill the edit form
 */
const ResourcesTab: React.FC = () => {
    const { user } = useAuth();

    const canCreate =
        user?.permissions?.includes(UserPermission.CAN_CREATE_RESOURCES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canEdit =
        user?.permissions?.includes(UserPermission.CAN_EDIT_RESOURCES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);
    const canDelete =
        user?.permissions?.includes(UserPermission.CAN_DELETE_RESOURCES) ||
        user?.permissions?.includes(UserPermission.IS_SUPERUSER);

    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog state. When `editingId` is null the dialog is in "create" mode;
    // otherwise it's editing the resource with that id.
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [units, setUnits] = useState<string>('');
    const [cost, setCost] = useState<string>('');

    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await OmniAPI.getAll('resources');
            setResources(Array.isArray(res) ? (res as Resource[]) : []);
        } catch (err) {
            console.error('Failed to load resources:', err);
            setError('Unable to load resources. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const openCreateDialog = () => {
        setEditingId(null);
        setName('');
        setBrand('');
        setColor('');
        setUnits('');
        setCost('');
        setIsOpen(true);
    };

    // Edit flow: fetch the resource by id (so we can pre-fill any fields
    // the list endpoint might not return), then open the dialog.
    const openEditDialog = (r: Resource) => {
        if (!canEdit) {
            alert('You do not have permission to edit resources.');
            return;
        }
        OmniAPI.get('resources', r.id)
            .then((full: any) => {
                setEditingId(r.id);
                setName(full?.name ?? r.name ?? '');
                setBrand(full?.brand ?? r.brand ?? '');
                setColor(full?.color ?? r.color ?? '');
                setUnits(full?.units ?? r.units ?? '');
                setCost(
                    full?.cost != null
                        ? String(full.cost)
                        : r.cost != null
                          ? String(r.cost)
                          : '',
                );
                setIsOpen(true);
            })
            .catch((err: any) => {
                console.error('Failed to load resource for edit:', err);
                alert('Could not load resource for editing.');
            });
    };

    // Delete flow: confirm, call API, refresh list. Backend may refuse if
    // the resource is still referenced by a resource slot.
    const onDelete = (r: Resource) => {
        if (!canDelete) {
            alert('You do not have permission to delete resources.');
            return;
        }
        const label = r.name || 'this resource';
        if (!window.confirm(`Really delete "${label}"? This cannot be undone.`)) return;

        OmniAPI.delete('resources', r.id)
            .then(() => {
                fetchResources();
            })
            .catch((err: any) => {
                alert(
                    'Failed to delete resource: ' +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    const onSave = () => {
        if (!name.trim()) {
            alert('Resource name is required.');
            return;
        }
        if (!units.trim()) {
            alert('Resource units are required.');
            return;
        }

        const costNumber = Number(cost);
        if (!Number.isFinite(costNumber) || costNumber < 0) {
            alert('Resource cost must be a non-negative number.');
            return;
        }

        // Send cost as a string to preserve decimal precision through JSON,
        // matching the existing MachineTypes flow and the backend's
        // DECIMAL(10, 5) column. Brand / Color are optional on the backend.
        const payload: Record<string, unknown> = {
            name: name.trim(),
            units: units.trim(),
            cost: costNumber.toString(),
        };
        if (brand.trim()) payload.brand = brand.trim();
        if (color.trim()) payload.color = color.trim();

        const request =
            editingId != null
                ? OmniAPI.edit('resources', editingId, payload)
                : OmniAPI.create('resources', payload);

        const actionVerb = editingId != null ? 'edit' : 'create';

        request
            .then(() => {
                setIsOpen(false);
                fetchResources();
            })
            .catch((err: any) => {
                alert(
                    `Failed to ${actionVerb} resource: ` +
                        (err?.response?.data?.detail || err?.message || 'unknown error'),
                );
            });
    };

    // The + button floats into the data-card's title row via `.mtd-open-btn`.
    const addButton = canCreate ? (
        <Dialog.Trigger asChild>
            <button
                type="button"
                className="mtd-open-btn"
                aria-label="Add resource"
                onClick={openCreateDialog}
            >
                <PlusIcon />
            </button>
        </Dialog.Trigger>
    ) : null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="mtd-tab-wrap">
                <AdminTable<Resource>
                    title="Resources"
                    columns={resourceColumns}
                    rows={resources}
                    rowKey={(r) => r.id}
                    loading={loading}
                    error={error}
                    emptyMessage="No resources found."
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
                        {editingId != null ? 'Editing' : 'Adding'} a Resource
                    </Dialog.Title>
                    <div className="mtd-title-divider" />

                    <div className="mtd-form">
                        <div className="mtd-name-row">
                            <label className="mtd-name-label" htmlFor="rd-name">
                                Resource Name
                            </label>
                            <input
                                id="rd-name"
                                className="mtd-name-input"
                                type="text"
                                value={name}
                                maxLength={100}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mtd-name-row">
                            <label className="mtd-name-label" htmlFor="rd-brand">
                                Resource Brand
                            </label>
                            <input
                                id="rd-brand"
                                className="mtd-name-input"
                                type="text"
                                value={brand}
                                maxLength={100}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </div>

                        <div className="mtd-name-row">
                            <label className="mtd-name-label" htmlFor="rd-color">
                                Resource Color
                            </label>
                            <input
                                id="rd-color"
                                className="mtd-name-input"
                                type="text"
                                value={color}
                                maxLength={50}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>

                        <div className="mtd-name-row">
                            <label className="mtd-name-label" htmlFor="rd-units">
                                Resource Units
                            </label>
                            <input
                                id="rd-units"
                                className="mtd-name-input"
                                type="text"
                                value={units}
                                maxLength={20}
                                placeholder="e.g. g, ft, mL"
                                onChange={(e) => setUnits(e.target.value)}
                            />
                        </div>

                        <div className="mtd-cost-row">
                            <label className="mtd-cost-label" htmlFor="rd-cost">
                                Resource Cost
                            </label>
                            <input
                                id="rd-cost"
                                className="mtd-cost-input"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
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

export default ResourcesTab;
