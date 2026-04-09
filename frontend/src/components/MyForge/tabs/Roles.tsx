import React, { useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import Table, { ITEMS_PER_PAGE, TableHead } from '../components/Table';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';
import '../styles/TabStyles.scss';

const Roles: React.FC = () => {

    const { user } = useAuth();
    const canSeeRoles = user.permissions.includes(UserPermission.CAN_SEE_ROLES) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [data, setData] = React.useState<Role[]>([]);
    const columns: (keyof Role)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Role)[]).filter((key) => key !== 'id') : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll('roles', { limit: ITEMS_PER_PAGE, offset }).then((res) => {
            setData(Array.isArray(res) ? (res as Role[]) : []);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    if (!canSeeRoles) return null;
    return (
        <div className='tab-column-cover align-center'>
            <TableHead heading="Roles" />
            <Table<Role>
                columns={columns}
                data={data}
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="roles"
            />
        </div>
    );
};

export default Roles;
