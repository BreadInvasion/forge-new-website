import { useCallback, useEffect, useRef, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';

interface OmniListState<T> {
    rows: T[];
    loading: boolean;
    error: string | null;
    /**
     * Re-runs the fetch. Call after a create/edit/delete so rows reflect
     * the latest server state (e.g. when a machine is moved to a different
     * group, the machines table's GROUP NAME column updates).
     */
    refresh: () => Promise<void>;
    /** Allows tabs to manipulate rows locally (e.g. optimistic updates). */
    setRows: React.Dispatch<React.SetStateAction<T[]>>;
}

/**
 * Thin hook around `OmniAPI.getAll` that the Admin tabs share so they can
 * each render multiple tables without duplicating fetch/loading boilerplate.
 *
 * Returns `{ rows, loading, error, refresh, setRows }` for a given resource
 * type.
 */
export function useOmniList<T>(
    resource: string,
    errorLabel?: string,
): OmniListState<T> {
    const [rows, setRows] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Tracks whether the component is still mounted so we don't call setState
    // on an unmounted component after an async refresh completes.
    const mountedRef = useRef<boolean>(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const fetchRows = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await OmniAPI.getAll(resource);
            if (!mountedRef.current) return;
            setRows(Array.isArray(data) ? (data as T[]) : []);
        } catch (err) {
            if (!mountedRef.current) return;
            const label = errorLabel || resource;
            console.error(`Failed to load ${label}:`, err);
            setError(`Unable to load ${label}. Please try again later.`);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [resource, errorLabel]);

    useEffect(() => {
        fetchRows();
    }, [fetchRows]);

    return { rows, loading, error, refresh: fetchRows, setRows };
}

export default useOmniList;
