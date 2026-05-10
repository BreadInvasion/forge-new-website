import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeftIcon, ArrowRightIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons';

import { OmniAPI } from 'src/apis/OmniAPI';
import { Role, User } from 'src/interfaces';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';
import Table, { ITEMS_PER_PAGE, TableHead } from '../components/Table';

import '../styles/TabStyles.scss';

type RoleUserRow = Pick<User, 'id' | 'first_name' | 'last_name' | 'RCSID'>;

const UserRoles: React.FC = () => {
    const { user } = useAuth();

    const hasPermission = (permission: UserPermission) => (
        user.permissions.includes(permission) || user.permissions.includes(UserPermission.IS_SUPERUSER)
    );

    const canSeeRoles = hasPermission(UserPermission.CAN_SEE_ROLES);
    const canSeeUsers = hasPermission(UserPermission.CAN_SEE_USERS);
    const canChangeUserRoles = hasPermission(UserPermission.CAN_CHANGE_USER_ROLES);

    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [assignedUsers, setAssignedUsers] = useState<RoleUserRow[]>([]);

    const [showAddUsersPanel, setShowAddUsersPanel] = useState(false);
    const [addUsersPageIndex, setAddUsersPageIndex] = useState(1);
    const [addUsersPageData, setAddUsersPageData] = useState<RoleUserRow[]>([]);
    const [addUsersHasMore, setAddUsersHasMore] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    const fetchRoles = async () => {
        try {
            // shouldnt need pagination, since there wont be 1000+ roles
            const res = await OmniAPI.getAll('roles', { limit: 1000, offset: 0, order_by: 'priority' });
            const fetchedRoles = Array.isArray(res) ? (res as Role[]) : [];
            setAllRoles(fetchedRoles);
            if (!selectedRoleId && fetchedRoles.length > 0) {
                setSelectedRoleId(fetchedRoles[0].id);
            }
        } catch {
            setAllRoles([]);
        }
    };

    const fetchUsersForSelectedRole = () => {
        if (!selectedRoleId) {
            setAssignedUsers([]);
            return;
        }

        OmniAPI.get('users/role', selectedRoleId)
            .then((res) => {
                const users = Array.isArray(res) ? (res as User[]) : [];
                setAssignedUsers(users.map((activeUser) => ({
                    id: activeUser.id,
                    first_name: activeUser.first_name,
                    last_name: activeUser.last_name,
                    RCSID: activeUser.RCSID,
                })));
            })
            .catch(() => setAssignedUsers([]));
    };

    const fetchAddUsersPage = (pageIndex: number) => {
        if (!canSeeUsers) return;
        
        const offset = (pageIndex - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll('users', { limit: ITEMS_PER_PAGE + 1, offset, order_by: 'RCSID' })
            .then((res) => {
                const users = Array.isArray(res) ? (res as User[]) : [];
                setAddUsersHasMore(users.length > ITEMS_PER_PAGE);
                setAddUsersPageData(users.slice(0, ITEMS_PER_PAGE).map((activeUser) => ({
                    id: activeUser.id,
                    first_name: activeUser.first_name,
                    last_name: activeUser.last_name,
                    RCSID: activeUser.RCSID,
                })));
            })
            .catch(() => {
                setAddUsersPageData([]);
                setAddUsersHasMore(false);
            });
    };

    useEffect(() => {
        if (!canSeeRoles) return;
        void fetchRoles();
    }, [canSeeRoles]);

    useEffect(() => {
        if (!canSeeUsers || !canSeeRoles) return;
        fetchUsersForSelectedRole();
    }, [canSeeUsers, canSeeRoles, selectedRoleId]);

    useEffect(() => {
        if (showAddUsersPanel && canSeeUsers) {
            setAddUsersPageIndex(1);
            fetchAddUsersPage(1);
        }
    }, [showAddUsersPanel, canSeeUsers]);

    const onDelete = (index_local: number, index_real: number) => {
        if (!canChangeUserRoles) {
            alert('You do not have permissions to change user roles');
            return;
        }

        const activeUser = assignedUsers[index_real];
        if (!activeUser || !selectedRoleId) return;

        OmniAPI.edit('roles', 'user', {
            user_id: activeUser.id,
            role_id: selectedRoleId,
            should_have_role: false,
        }).then(() => {
            fetchUsersForSelectedRole();
        }).catch(() => {
            alert('Failed to remove role from user');
        });
    };

    const onAdd = (activeUser: RoleUserRow) => {
        if (!canChangeUserRoles) {
            alert('You do not have permissions to change user roles');
            return;
        }
        if (!selectedRoleId) return;

        OmniAPI.edit('roles', 'user', {
            user_id: activeUser.id,
            role_id: selectedRoleId,
            should_have_role: true,
        }).then(() => {
            fetchUsersForSelectedRole();
            if (showAddUsersPanel) {
                setAddUsersPageIndex(1);
                fetchAddUsersPage(1);
            }
        }).catch(() => {
            alert('Failed to add role to user');
        });
    };

    // user search
    const assignedUserIds = new Set(assignedUsers.map((activeUser) => activeUser.id));
    const normalizedSearchQuery = userSearchQuery.trim().toLowerCase();

    const filteredAddUsers = addUsersPageData
        .filter((activeUser) => {
            if (!normalizedSearchQuery) return true;
            return [activeUser.first_name, activeUser.last_name, activeUser.RCSID]
                .some((value) => value.toLowerCase().includes(normalizedSearchQuery));
        })
        .map((activeUser) => {
            if (!normalizedSearchQuery) {
                return { activeUser, score: 0 };
            }

            const firstName = activeUser.first_name.toLowerCase();
            const lastName = activeUser.last_name.toLowerCase();
            const rcsid = activeUser.RCSID.toLowerCase();

            let score = 3;
            if (rcsid === normalizedSearchQuery || firstName === normalizedSearchQuery || lastName === normalizedSearchQuery) {
                score = 0;
            } else if (rcsid.startsWith(normalizedSearchQuery) || firstName.startsWith(normalizedSearchQuery) || lastName.startsWith(normalizedSearchQuery)) {
                score = 1;
            } else if (rcsid.includes(normalizedSearchQuery)) {
                score = 2;
            }

            return { activeUser, score };
        })
        .sort((left, right) => {
            if (left.score !== right.score) return left.score - right.score;

            const leftName = `${left.activeUser.first_name} ${left.activeUser.last_name} ${left.activeUser.RCSID}`.toLowerCase();
            const rightName = `${right.activeUser.first_name} ${right.activeUser.last_name} ${right.activeUser.RCSID}`.toLowerCase();
            return leftName.localeCompare(rightName);
        })
        .map(({ activeUser }) => activeUser);

    const handlePreviousAddUsersPage = () => {
        if (addUsersPageIndex === 1) return;
        const newPage = addUsersPageIndex - 1;
        setAddUsersPageIndex(newPage);
        fetchAddUsersPage(newPage);
    };

    const handleNextAddUsersPage = () => {
        if (!addUsersHasMore) return;
        const newPage = addUsersPageIndex + 1;
        setAddUsersPageIndex(newPage);
        fetchAddUsersPage(newPage);
    };

    if (!canSeeRoles || !canSeeUsers) return null;

    return (
        <div className='tab-column-cover align-center'>
            <TableHead heading='User Roles' />
            <div className='Fieldset' style={{ width: '100%', maxWidth: '1100px' }}>
                <label className='Label' htmlFor='role-select'>Role</label>
                <select
                    className='Input'
                    id='role-select'
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                >
                    <option value='' disabled>Select a role</option>
                    {allRoles.map((activeRole) => (
                        <option key={activeRole.id} value={activeRole.id}>
                            {activeRole.name}
                        </option>
                    ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label className='Label' style={{ marginBottom: 0 }}>Users</label>
                    {canChangeUserRoles && (
                        <button className='addbtn' type='button' onClick={() => setShowAddUsersPanel(true)}>
                            <PlusIcon />
                        </button>
                    )}
                </div>

                <Table<RoleUserRow>
                    columns={['first_name', 'last_name', 'RCSID']}
                    data={assignedUsers}
                    onDelete={canChangeUserRoles ? onDelete : undefined}
                />
            </div>

            <Dialog.Root open={showAddUsersPanel} onOpenChange={setShowAddUsersPanel}>
                <Dialog.Portal>
                    <div className='AEdiv'>
                        <Dialog.Overlay className='DialogOverlay' />
                        <Dialog.Content className='DialogContent' aria-describedby={undefined}>
                            <Dialog.Close asChild>
                                <button className='IconButton' aria-label='Close'>
                                    <Cross2Icon />
                                </button>
                            </Dialog.Close>
                            <Dialog.Title className='DialogTitle'>Add Users to Role</Dialog.Title>
                            <fieldset className='Fieldset'>
                                <label className='Label' htmlFor='user-search'>Search</label>
                                <input
                                    id='user-search'
                                    className='Input'
                                    value={userSearchQuery}
                                    onChange={(e) => {
                                        setUserSearchQuery(e.target.value);
                                        setAddUsersPageIndex(1);
                                        fetchAddUsersPage(1);
                                    }}
                                    placeholder='Search by first name, last name, or RCSID'
                                />
                                <label className='Label'>Users</label>
                                <div className='table-container' style={{ marginTop: '0.25rem', padding: 0, maxHeight: '30vh' }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>RCSID</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAddUsers.length > 0 ? filteredAddUsers.map((activeUser) => (
                                                <tr key={activeUser.id}>
                                                    <td>{activeUser.first_name}</td>
                                                    <td>{activeUser.last_name}</td>
                                                    <td>{activeUser.RCSID}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {assignedUserIds.has(activeUser.id) ? '' : (
                                                            <button
                                                                className='Button SaveBtn'
                                                                type='button'
                                                                onClick={() => onAdd(activeUser)}
                                                            >
                                                                Add
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} style={{ textAlign: 'center' }}>No users are present.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='pagination-container'>
                                    <div className='pagination'>
                                        <button onClick={handlePreviousAddUsersPage} disabled={addUsersPageIndex === 1} aria-label='Previous page'>
                                            <ArrowLeftIcon />
                                        </button>

                                        <button className='active' aria-current='page'>
                                            {addUsersPageIndex}
                                        </button>

                                        <button onClick={handleNextAddUsersPage} disabled={!addUsersHasMore} aria-label='Next page'>
                                            <ArrowRightIcon />
                                        </button>
                                    </div>
                                </div>
                            </fieldset>
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default UserRoles;
