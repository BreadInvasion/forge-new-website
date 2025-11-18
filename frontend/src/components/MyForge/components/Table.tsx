import React, { useState } from 'react';

import '../styles/Table.scss';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';

interface TableProps<T extends Record<string, any>> {
    columns: (keyof T)[];
    data: T[];
    editPath?: string;
    onDelete?: (index: number) => void;
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

function Table<T extends Record<string, any>>(props: TableProps<T>) {
    const { columns, data, editPath, onDelete } = props;

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

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={String(column) + index}>{String(column)}</th>
                        ))}
                        {editPath && <th id="edit-col">Edit</th>}
                        {editPath && <th id="delete-col">Delete</th>}
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
                            {editPath && (
                                <td className="icon">
                                    <a href={editPath}>
                                        <Pencil2Icon width={20} height={20} />
                                    </a>
                                </td>
                            )}
                            {editPath && (
                                <td className="icon">
                                    <TrashIcon
                                        width={20}
                                        height={20}
                                        onClick={() => onDelete && onDelete(rowIndex)}
                                    />
                                </td>
                            )}
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
                        Previous
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
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;