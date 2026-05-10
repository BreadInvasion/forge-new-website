import React, { ReactNode, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import Table, { DeleteItem, ITEMS_PER_PAGE, TableHead } from '../components/Table';
import { Role } from 'src/interfaces';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
// @ts-ignore temporary: stylesheet module typing not configured in this project path yet // this'll get fixed soon
import '../styles/TabStyles.scss';

interface AEMenuProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    role: Role | null;
    setRole: (role: Role | null) => void;
    refresh: () => void;
}

const aemenu = (props: AEMenuProps): [ReactNode, (state: boolean, role: Role | null) => void] => {
    const { isDialogOpen, setIsDialogOpen, role, setRole, refresh } = props;

    const { user } = useAuth();
    const canCreate = user.permissions.includes(UserPermission.CAN_CREATE_ROLES) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canEdit = user.permissions.includes(UserPermission.CAN_EDIT_ROLES) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [name, setName] = useState('');
    const [priority, setPriority] = useState(0);
    const [displayRole, setDisplayRole] = useState(false);
    const [permissions, setPermissions] = useState<UserPermission[]>([]);
    const [inversePermissions, setInversePermissions] = useState<UserPermission[]>([]);

    const allPermissions = Object.values(UserPermission);

    const setOpenExtra = (state: boolean, activeRole: Role | null) => {
        setRole(activeRole);
        if (activeRole) {
            setName(activeRole.name);
            setPriority(activeRole.priority);
            setDisplayRole(activeRole.display_role);
            setPermissions((activeRole.permissions ?? []) as UserPermission[]);
            setInversePermissions((activeRole.inverse_permissions ?? []) as UserPermission[]);
        } else {
            setName('');
            setPriority(0);
            setDisplayRole(false);
            setPermissions([]);
            setInversePermissions([]);
        }
        if (isDialogOpen !== state) {
            setIsDialogOpen(state);
        }
    };

    const togglePermission = (perm: UserPermission) => {
        const hasPermission = permissions.includes(perm);
        if (hasPermission) {
            setPermissions((prev) => prev.filter((p) => p !== perm));
            return;
        }

        setPermissions((prev) => [...prev, perm]);
        setInversePermissions((prev) => prev.filter((p) => p !== perm));
    };

    const toggleInversePermission = (perm: UserPermission) => {
        const hasInversePermission = inversePermissions.includes(perm);
        if (hasInversePermission) {
            setInversePermissions((prev) => prev.filter((p) => p !== perm));
            return;
        }

        setInversePermissions((prev) => [...prev, perm]);
        setPermissions((prev) => prev.filter((p) => p !== perm));
    };

    const create = () => {
        if (!canCreate) {
            alert('You do not have the permissions to create roles');
            return;
        }
        if (!name.trim()) {
            alert('Role name is required');
            return;
        }

        OmniAPI.create('roles', {
            name: name.trim(),
            permissions: permissions,
            inverse_permissions: inversePermissions,
            display_role: displayRole,
            priority: priority,
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        });
    };

    const edit = () => {
        if (!canEdit) {
            alert('You do not have the permissions to edit roles');
            return;
        }
        if (!role) return;
        if (!name.trim()) {
            alert('Role name is required');
            return;
        }
        

        OmniAPI.edit('roles', role.id, {
            role_id: role.id,
            name: name.trim(),
            permissions: permissions,
            inverse_permissions: inversePermissions,
            display_role: displayRole,
            priority: priority,
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        });
    };

    if (!canCreate && !canEdit) return [null, () => {}];
    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(open) => setOpenExtra(open, role)}>
            {canCreate && (
                <button className="addbtn" onClick={() => setOpenExtra(true, null)}>
                    <PlusIcon />
                </button>
            )}
            {(canCreate || canEdit) && (
                <Dialog.Portal>
                    <div className='AEdiv'>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent" aria-describedby={undefined}>
                            <Dialog.Close asChild>
                                <button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </button>
                            </Dialog.Close>
                            <Dialog.Title className="DialogTitle">{role == null ? 'Adding' : 'Editing'} Role</Dialog.Title>

                            <fieldset className="Fieldset">
                                <label className="Label" htmlFor="role-name">Name</label>
                                <input
                                    className="Input"
                                    id="role-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={100}
                                />

                                <label className="Label" htmlFor="role-priority">Priority</label>
                                <input
                                    className="Input"
                                    id="role-priority"
                                    type="number"
                                    value={priority}
                                    onChange={(e) => setPriority(Number(e.target.value) || 0)}
                                />

                                <label className="Label" htmlFor="display-role">Display role?</label>
                                <input
                                    className="styled-checkbox"
                                    id="display-role"
                                    type="checkbox"
                                    checked={displayRole}
                                    onChange={(e) => setDisplayRole(e.target.checked)}
                                />

                                <label className="Label" htmlFor="permissions"><div>Permission Settings</div></label>
                                <div
                                    id="permissions"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '32px 32px minmax(0, 1fr)',
                                        columnGap: '10px',
                                        rowGap: '8px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <label className='checkbox-label' style={{ textAlign: 'center', margin: 0 }}>Y</label>
                                    <label className='checkbox-label' style={{ textAlign: 'center', margin: 0 }}>N</label>
                                    <label className='checkbox-label' style={{ margin: 0 }}>Permission</label>

                                    {allPermissions.map((permission) => (
                                        <React.Fragment key={`perm-${permission}`}>
                                            <input
                                                className='styled-checkbox'
                                                type="checkbox"
                                                checked={permissions.includes(permission)}
                                                onChange={() => togglePermission(permission)}
                                                style={{ margin: 0, justifySelf: 'center' }}
                                            />
                                            <input
                                                className='styled-checkbox'
                                                type="checkbox"
                                                checked={inversePermissions.includes(permission)}
                                                onChange={() => toggleInversePermission(permission)}
                                                style={{ margin: 0, justifySelf: 'center' }}
                                            />
                                            <label className='checkbox-label' style={{ margin: 0, overflowWrap: 'anywhere' }}>
                                                {permission}
                                            </label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </fieldset>

                            <Dialog.Close asChild>
                                <button className="Button SaveBtn" onClick={role == null ? create : edit}>Save</button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            )}
        </Dialog.Root>
    ), setOpenExtra];
};

const Roles: React.FC = () => {

    const { user } = useAuth();
    const canSeeRoles = user.permissions.includes(UserPermission.CAN_SEE_ROLES) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canDelete = user.permissions.includes(UserPermission.CAN_DELETE_ROLES) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canEdit = user.permissions.includes(UserPermission.CAN_EDIT_ROLES) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [data, setData] = React.useState<Role[]>([]);
    const columns: (keyof Role)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Role)[]).filter((key) => key !== 'id') : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll('roles', { limit: ITEMS_PER_PAGE, offset, order_by: 'priority' }).then((res) => {
            setData(Array.isArray(res) ? (res as Role[]) : []);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number, index_real: number) => {
        if (!canDelete) {
            alert('You do not have the permissions to delete roles');
            return;
        }
        DeleteItem('roles', data[index_real], refreshPage);
    };

    const [role, setRole] = useState<Role | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ae, setOpen] = aemenu({ isDialogOpen, setIsDialogOpen, role, setRole, refresh: refreshPage });

    const onEdit = (activeRole: Role) => {
        if (!canEdit) {
            alert('You do not have the permissions to edit roles');
            return;
        }
        setOpen(true, activeRole);
    };

    if (!canSeeRoles) return null;
    return (
        <div className='tab-column-cover align-center'>
            <TableHead heading="Roles" type="roles" aemenu={ae} />
            <Table<Role>
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={onEdit}
                canEdit={canEdit}
                canDelete={canDelete}
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="roles"
            />
        </div>
    );
};

export default Roles;
