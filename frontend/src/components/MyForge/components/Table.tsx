import React, { ReactNode, useEffect, useState } from 'react';

import '../styles/Table.scss';
import { Pencil2Icon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { OmniAPI } from 'src/apis/OmniAPI';

interface TableProps<T> {
    columns: (keyof T)[];
    data: T[];
    canEdit?: boolean;
    onEdit?: (activeItem: T) => void;
    onDelete?: (index_local: number, index_real:number) => void;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    resourceType?: string;
}

export const ITEMS_PER_PAGE = 10;

function toTitle(snakeStr: string): string {
    return snakeStr
        .replace("_rpi", "_RPI") // Fixed like a true CS major 😎
        .replace("rpi_", "RPI") // Same here 💅💅
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');
}

interface TableHeadProps<T> {
    heading: string; 
    type?: string;
    updateExisting?: boolean;
    activeItem?: T;
    aemenu?: ReactNode;
}

// calls the api to delete an item from the database. type parameter is the backend type not frontend
export function DeleteItem(type: string, obj: any, onSuccess: () => void) {
    if (!confirm(`Really delete ${obj.name}?`)) return;
    OmniAPI.delete(type, obj.id)
        .then(() => {
            onSuccess();
        }).catch(e => alert("Failed to delete " + type + ": " + e.response?.data?.detail));
}

export function TableHead<T>(props: TableHeadProps<T>) {
    const { heading, type, aemenu } = props;
    return(
        <div className="table-head">
            <h2>{heading}</h2>
            { type == null ? "" : aemenu }
        </div>
    );
}

function Table<T>(props: TableProps<T>) {
    const { columns, data, onDelete, onEdit, canEdit } = props;
    const {
        currentPage: currentPageProp,
        onPageChange,
        resourceType
    } = props;

    const hasEditOrDelete = !!(canEdit || onDelete);

    const currentPage = currentPageProp ?? 1;
    const [hasNext, setHasNext] = useState(false);

    // check for next page by pulling next item 
    const checkHasNext = React.useCallback(() => {
        if (!resourceType) {
            setHasNext(false);
            return;
        }
        const nextOffset = currentPage * ITEMS_PER_PAGE;

        OmniAPI.getAll(resourceType, {limit: 1, offset: nextOffset}).then(res => {
                setHasNext(Array.isArray(res) && res.length > 0);
        }).catch(() => setHasNext(false));
    }, [resourceType, currentPage]);

    useEffect(() => {
        checkHasNext();
    }, [checkHasNext, data]);

    useEffect(() => {
        if (currentPage > 1 && data.length === 0) {
            onPageChange?.(currentPage - 1);
        }
    }, [data.length, currentPage]);


    const handlePrevious = () => {
        if (currentPage === 1) return;
        onPageChange?.(currentPage - 1);
    };

    const handleNext = () => {
        if (!hasNext) return;
        onPageChange?.(currentPage + 1);
    };

    // arrow keys work like the buttons
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const active = document.activeElement as HTMLElement | null;
            const tag = active?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || active?.isContentEditable) return;

            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [currentPage, hasNext]);

    if (data.length === 0) {
        return (
            <div>
                <br />
                <i>No items are present.</i>
            </div>
        );
    } else {
        return (
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={String(column) + index}>{toTitle(String(column))}</th>
                            ))}
                            {hasEditOrDelete && <th id="edit-col"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map(column => (
                                    <td key={String(column)}>
                                        {Array.isArray(row[column])
                                            ? row[column].join(', ')
                                            : String(row[column])}
                                    </td>
                                ))}
                                {hasEditOrDelete && (
                                    <td className="icon">
                                        {canEdit && (
                                            <Pencil2Icon
                                                className="edit"
                                                onClick={() => onEdit?.(row)}
                                            />
                                        )}
                                        {onDelete && (
                                            <TrashIcon
                                                className="trash"
                                                onClick={() => onDelete(rowIndex, rowIndex)}
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
                        <button onClick={handlePrevious} disabled={currentPage === 1} aria-label="Previous page">
                            <ArrowLeftIcon />
                        </button>

                        <button className="active" aria-current="page">
                            {currentPage}
                        </button>

                        <button onClick={handleNext} disabled={!hasNext} aria-label="Next page" >
                            <ArrowRightIcon />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Table;