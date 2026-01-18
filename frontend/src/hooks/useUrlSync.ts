import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseUrlSyncOptions {
    searchTerm?: string;
    selectedCategory?: string;
    sortBy?: string;
    page?: number;
    enabled?: boolean;
}

/**
 * Custom hook to sync state with URL query parameters
 * Updates URL when filters change, maintains browser history
 */
export function useUrlSync(options: UseUrlSyncOptions) {
    const { searchTerm, selectedCategory, sortBy, page, enabled = true } = options;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!enabled) return;

        const params = new URLSearchParams(location.search);
        let hasChanges = false;

        // Update search param
        if (searchTerm) {
            if (params.get('search') !== searchTerm) {
                params.set('search', searchTerm);
                hasChanges = true;
            }
        } else {
            if (params.has('search')) {
                params.delete('search');
                hasChanges = true;
            }
        }

        // Update category param
        if (selectedCategory) {
            if (params.get('category') !== selectedCategory) {
                params.set('category', selectedCategory);
                hasChanges = true;
            }
        } else {
            if (params.has('category')) {
                params.delete('category');
                hasChanges = true;
            }
        }

        // Update sortBy param
        if (sortBy) {
            if (params.get('sortBy') !== sortBy) {
                params.set('sortBy', sortBy);
                hasChanges = true;
            }
        } else {
            if (params.has('sortBy')) {
                params.delete('sortBy');
                hasChanges = true;
            }
        }

        // Update page param
        if (page && page > 1) {
            if (params.get('page') !== page.toString()) {
                params.set('page', page.toString());
                hasChanges = true;
            }
        } else {
            if (params.has('page')) {
                params.delete('page');
                hasChanges = true;
            }
        }

        // Only update URL if there are actual changes
        if (hasChanges) {
            const newSearch = params.toString();
            const newUrl = newSearch ? `?${newSearch}` : location.pathname;
            navigate(newUrl, { replace: true });
        }
    }, [searchTerm, selectedCategory, sortBy, page, enabled, navigate, location]);
}

/**
 * Parse URL query parameters into state
 */
export function useUrlParams() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    return {
        searchTerm: params.get('search') || '',
        selectedCategory: params.get('category') || '',
        sortBy: params.get('sortBy') || '',
        page: parseInt(params.get('page') || '1', 10),
    };
}
