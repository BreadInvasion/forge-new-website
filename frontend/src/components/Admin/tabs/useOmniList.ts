import { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';

interface OmniListState<T> {
    rows: T[];
    loading: boolean;
    error: string | null;
}

/**
 * Thin hook around `OmniAPI.getAll` that the Admin tabs share so they can
 * each render multiple tables without duplicating fetch/loading boilerplate.
 *
 * Returns `{ rows, loading, error }` for a given resource type.
 */
export function useOmniList<T>(
    resource: string,
    errorLabel?: string,
): OmniListState<T> {
    const [rows, setRows] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await OmniAPI.getAll(resource);
                if (cancelled) return;
                setRows(Array.isArray(data) ? (data as T[]) : []);
            } catch (err) {
                if (cancelled) return;
                const label = errorLabel || resource;
                console.error(`Failed to load ${label}:`, err);
                setError(`Unable to load ${label}. Please try again later.`);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [resource, errorLabel]);

    return { rows, loading, error };
}

export default useOmniList;
