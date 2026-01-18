import Fuse, { IFuseOptions } from 'fuse.js';

/**
 * Remove Vietnamese diacritics for better fuzzy matching
 */
export function removeVietnameseDiacritics(str: string): string {
    if (!str) return '';

    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .trim();
}

/**
 * Configure Fuse.js for menu item fuzzy search
 */
export function createMenuFuzzySearch<T>(items: T[]) {
    const options: IFuseOptions<T> = {
        keys: [
            { name: 'name', weight: 0.7 },
            { name: 'description', weight: 0.3 },
        ],
        threshold: 0.25, // Lower = stricter (0.25 allows ~25% difference)
        distance: 100,
        includeScore: true,
        minMatchCharLength: 2,
        // Custom function to normalize Vietnamese text
        getFn: (obj: any, path: string | string[]) => {
            const value = Fuse.config.getFn(obj, path);
            if (typeof value === 'string') {
                return removeVietnameseDiacritics(value);
            }
            return value;
        },
    };

    return new Fuse(items, options);
}

/**
 * Perform fuzzy search on menu items
 * Returns items sorted by relevance
 */
export function fuzzySearchMenuItems<T>(
    items: T[],
    searchTerm: string
): T[] {
    if (!searchTerm || searchTerm.trim() === '') {
        return items;
    }

    const normalizedSearch = removeVietnameseDiacritics(searchTerm);
    const fuse = createMenuFuzzySearch(items);
    const results = fuse.search(normalizedSearch);

    // Return items sorted by score (best matches first)
    return results.map(result => result.item);
}

/**
 * Highlight matching text in a string
 * Useful for showing which parts matched the search
 */
export function highlightMatch(text: string, searchTerm: string): string {
    if (!searchTerm || !text) return text;

    const normalizedText = removeVietnameseDiacritics(text);
    const normalizedSearch = removeVietnameseDiacritics(searchTerm);

    const index = normalizedText.indexOf(normalizedSearch);
    if (index === -1) return text;

    // Find the actual position in original text
    const before = text.substring(0, index);
    const match = text.substring(index, index + searchTerm.length);
    const after = text.substring(index + searchTerm.length);

    return `${before}<mark>${match}</mark>${after}`;
}
