import { useEffect, useRef } from 'react';
import { useSearchParams } from "react-router";
import { isEqual } from 'lodash';
import { useAssignmentFilterStore } from './assignment-filter.store';

export function useSyncFiltersWithUrl() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get the state and actions from our Zustand store
    const { filters, setFilters } = useAssignmentFilterStore();
    
    // Use a ref to prevent unnecessary effect runs when filters object reference changes
    const isInitialLoad = useRef(true);

    // Effect 1: Initialize store from URL on initial page load
    useEffect(() => {
        // This effect runs only once
        if (isInitialLoad.current) {
            const paramsFromUrl = Object.fromEntries(searchParams.entries());

            // Convert numeric params from string to number
            if (paramsFromUrl.page) {
                paramsFromUrl.page = `${Number(paramsFromUrl.page)}`;
            }
            if (paramsFromUrl.pageSize) {
                paramsFromUrl.pageSize = `${Number(paramsFromUrl.pageSize)}`;
            }
            
            // Set the store's state with the values from the URL
            // Merging with initial defaults to ensure page/pageSize are present
            const initialFilters = {
                page: 1,
                pageSize: 10,
                ...paramsFromUrl
            };
            setFilters(initialFilters);
            isInitialLoad.current = false;
        }
    }, [searchParams, setFilters]);

    // Effect 2: Update URL when the store's filters change
    useEffect(() => {
        // Don't run this on the very first render
        if (isInitialLoad.current) {
            return;
        }
        
        // Create a new URLSearchParams object from the current filters
        const newSearchParams = new URLSearchParams();
        
        // Clean up the filters: remove undefined, null, or empty string values
        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                newSearchParams.set(key, String(value));
            }
        });
        
        // To avoid an infinite loop, only update the URL if the params have actually changed
        if (!isEqual(Object.fromEntries(newSearchParams.entries()), Object.fromEntries(searchParams.entries()))) {
           setSearchParams(newSearchParams);
        }

    }, [filters, setSearchParams, searchParams]);
}