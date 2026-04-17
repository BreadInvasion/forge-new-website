import React, { ReactNode } from 'react';

export interface AdminTableColumn<T> {
    /** Column header label (UPPERCASE, matches Figma). */
    label: string;
    /** Cell renderer for a single row. */
    render: (row: T) => React.ReactNode;
    /** Optional explicit width (e.g. "200px", "20%"). */
    width?: string;
}

interface AdminTableProps<T> {
    title: string;
    columns: AdminTableColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    loading: boolean;
    error: string | null;
    emptyMessage?: string;
    /** Optional action buttons (green/purple) rendered under the title. */
    actions?: ReactNode;
}

/**
 * Shared table scaffold for the Admin tabs.
 *
 * Uses the global `.data-card` / `.data-table` classes from `styles/globals.scss`
 * so that every table on the site shares the same visual design.
 *
 * Header row uses the navy bar with the first (leftmost) column label highlighted
 * white, while the remaining column labels are muted (#4a6080) — matching the
 * Figma design.
 */
export function AdminTable<T>({
    title,
    columns,
    rows,
    rowKey,
    loading,
    error,
    emptyMessage = 'No records found.',
    actions,
}: AdminTableProps<T>): React.ReactElement {
    const colCount = columns.length;

    return (
        <div className="data-card">
            <h2 className="data-card-title">{title}</h2>

            {actions && <div className="data-card-actions">{actions}</div>}

            <div className="data-table-wrapper">
                <table className="data-table">
                    <colgroup>
                        {columns.map((col, i) => (
                            <col
                                key={i}
                                style={col.width ? { width: col.width } : undefined}
                            />
                        ))}
                    </colgroup>

                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={col.label + i}
                                    className={i === 0 ? 'data-th--active' : undefined}
                                    scope="col"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td
                                    colSpan={colCount}
                                    className="data-table-empty"
                                >
                                    Loading…
                                </td>
                            </tr>
                        )}

                        {!loading && error && (
                            <tr>
                                <td
                                    colSpan={colCount}
                                    className="data-table-empty data-table-error"
                                >
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!loading && !error && rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={colCount}
                                    className="data-table-empty"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !error &&
                            rows.map((row) => (
                                <tr key={rowKey(row)}>
                                    {columns.map((col, i) => (
                                        <td key={i}>{col.render(row)}</td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTable;
