import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number; // Distance from bottom to trigger load (in pixels)
    enabled?: boolean; // Enable/disable infinite scroll
}

interface UseInfiniteScrollReturn {
    isLoadingMore: boolean;
    hasMore: boolean;
    loadMore: () => void;
    reset: () => void;
    setHasMore: (value: boolean) => void;
    setIsLoadingMore: (value: boolean) => void;
}

/**
 * Custom hook for infinite scroll functionality
 * Automatically loads more content when user scrolls near bottom
 */
export function useInfiniteScroll(
    onLoadMore: () => Promise<void> | void,
    options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
    const { threshold = 500, enabled = true } = options;

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(false);

    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore || !enabled) return;

        loadingRef.current = true;
        setIsLoadingMore(true);

        try {
            await onLoadMore();
        } catch (error) {
            console.error('Error loading more items:', error);
        } finally {
            setIsLoadingMore(false);
            loadingRef.current = false;
        }
    }, [onLoadMore, hasMore, enabled]);

    const reset = useCallback(() => {
        setHasMore(true);
        setIsLoadingMore(false);
        loadingRef.current = false;
    }, []);

    useEffect(() => {
        if (!enabled || !hasMore) return;

        const handleScroll = () => {
            // Check if we're near the bottom
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

            if (distanceFromBottom < threshold && !loadingRef.current) {
                loadMore();
            }
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Check initial state (in case content doesn't fill screen)
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loadMore, threshold, enabled, hasMore]);

    return {
        isLoadingMore,
        hasMore,
        loadMore,
        reset,
        setHasMore,
        setIsLoadingMore,
    };
}
