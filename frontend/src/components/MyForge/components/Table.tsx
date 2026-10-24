import React, { ReactNode, useEffect, useState } from 'react';

import '../styles/Table.scss';
import { Pencil2Icon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { ColumnDef, createColumnHelper, OnChangeFn, PaginationState, RowData, rowPaginationFeature, tableFeatures, useTable } from '@tanstack/react-table';
import { UseQueryResult } from '@tanstack/react-query';

interface TData {
    id: string,
    name: string
}

export const features = tableFeatures({
    rowPaginationFeature,
    manualPagination: true,
});

interface TableProps<T extends TData> {
    columns: readonly ColumnDef<typeof features, T>[];
    queryFn: (pagination: PaginationState) => UseQueryResult<T[], Error>;
    rowCount?: number;
    canEdit?: boolean;
    canDelete?: boolean;
    onEdit?: (activeItem: T) => void;
    onDelete?: (id: string) => void;
}

export const ITEMS_PER_PAGE = 10;

interface TableHeadProps<T extends TData> {
    heading: string; 
    type?: string;
    updateExisting?: boolean;
    activeItem?: T;
    aemenu?: ReactNode;
}

export function TableHead<T extends TData>(props: TableHeadProps<T>) {
    const { heading, type, aemenu } = props;
    return(
        <div className="table-head">
            <h2>{heading}</h2>
            { type == null ? "" : aemenu }
        </div>
    );
}

function Table<T extends TData>(props: TableProps<T>) {
    const { columns, queryFn, rowCount, onDelete, onEdit, canEdit, canDelete } = props;

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // initial page index
        pageSize: ITEMS_PER_PAGE, // default page size
    });
    const {data: raw} = queryFn(pagination);
    const data = raw ?? [];
    console.debug(data);

    const hasDelete = !!(canDelete && onDelete);
    const hasEdit = !!(canEdit && onEdit);
    const hasEditOrDelete = hasEdit || hasDelete;

    const table = useTable({
        features,
        columns,
        data,
        state: {pagination},
        onPaginationChange: setPagination,
        rowCount,
        autoResetAll: false
    });

    return (
        <div className="table-container">
            <table className={hasEditOrDelete ? 'has-actions' : undefined}>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <table.FlexRender header={header} />
                                    )}
                                </th>
                            ))}
                            {hasEditOrDelete && <th id="edit-col"></th>}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row, rowIndex) => (
                        <tr key={row.id}>
                            {row.getAllCells().map(cell => (
                                <td key={cell.id}>
                                    <div className="cell-content">
                                        <table.FlexRender cell={cell}/>
                                    </div>
                                </td>
                            ))}
                            {hasEditOrDelete && (
                                <td className="icon">
                                    {hasEdit && (
                                        <Pencil2Icon
                                            className="edit"
                                            onClick={() => onEdit(data[rowIndex])}
                                        />
                                    )}
                                    {hasDelete && (
                                        <TrashIcon
                                            className="trash"
                                            onClick={() => {
                                                if (!confirm(`Confirm delete ${data[rowIndex].name}?`)) return
                                                onDelete(data[rowIndex].id)
                                            }}
                                        />
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='pagination-container'>
                <div className='pagination'>
                    <button onClick={table.previousPage} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
                        <ArrowLeftIcon />
                    </button>

                    <button className="active" aria-current="page">
                        {pagination.pageIndex+1}
                    </button>

                    <button onClick={table.nextPage} disabled={!table.getCanNextPage()} aria-label="Next page" >
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;