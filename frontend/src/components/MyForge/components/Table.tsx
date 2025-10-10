import React, { ReactNode, useEffect, useState } from 'react';
import { Dialog } from 'radix-ui'

import '../styles/Table.scss';
import { Pencil2Icon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

interface TableProps<T> {
    columns: (keyof T)[];
    data: T[];
    canEdit?: boolean;
    onEdit?: (activeItem: T) => void;
    onDelete?: (index_local: number, index_real:number) => void;
}

const ITEMS_PER_PAGE = 8;
const MAX_PAGE_BUTTONS = 5;

function createPageRange(
    currentPage: number,
    totalPages: number,
    maxPages: number
) {
    // Start near the current page:
    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;
    if (end > totalPages) {
        end = totalPages;
        // If we’re at the last pages, shift the start so we still show maxPages
        start = Math.max(1, end - maxPages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
}

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
export function DeleteItem(type: string, obj: any, index: number, setData: (dat: any) => void) {
    if (!confirm(`Really delete ${obj.name}?`)) return;
    fetch(`http://localhost:3000/api/${type}/${obj.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    })
    .then(res => {
            if (res.status !== 200) {
                res.text().then((json) => {
                alert(JSON.parse(json)['detail']);
            });
            }
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log(`${type} deleted:`, data);
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
            document.location.reload(); // make this reload only table later
        })
        .catch(error => {
            console.error(`Error deleting ${type}:`, error);
        });
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

    const [activeItem, setActiveItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // 2. Calculate total pages
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    // 3. Slice the data for currentPage
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = data.slice(startIndex, endIndex);

    // 4. Pagination controls
    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Generate an array of pages to display (limited by MAX_PAGE_BUTTONS)
    const pagesToShow = createPageRange(currentPage, totalPages, MAX_PAGE_BUTTONS);

    if (data.length == 0) {
        return(
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
                            <th id="edit-col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row: T, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, index) => (
                                    <td key={String(column) + index + rowIndex}>
                                        {Array.isArray(row[column])
                                            ? row[column].join(', ')
                                            : String(row[column])}
                                    </td>
                                ))}
                                <td className="icon">
                                    &#8203;
                                    {!canEdit?'': <Pencil2Icon 
                                        className='edit'
                                        onClick={() => onEdit && onEdit(row)}
                                    />}
                                    {onDelete == null ?"":
                                        <TrashIcon
                                            className='trash'
                                            onClick={() => onDelete && onDelete(rowIndex, rowIndex + (currentPage - 1) * (MAX_PAGE_BUTTONS + 3))}
                                    />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='pagination-container'>
                    <div className='page-info'>
                        Page {currentPage} of {totalPages}
                    </div>

                    <div className='pagination'>
                        <button onClick={handlePrevious} disabled={currentPage === 1}>
                            <ArrowLeftIcon />
                        </button>

                        {/* Render each page button */}
                        {pagesToShow.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={page === currentPage ? 'active' : ''}
                            >
                                {page}
                            </button>
                        ))}

                        <button onClick={handleNext} disabled={currentPage === totalPages}>
                            <ArrowRightIcon />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Table;