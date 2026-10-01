import useSWR from 'swr';
import { useMemo } from 'react';

import { CONFIG } from 'src/global-config';
import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

/**
 * Hook to get all Prior Art searches
 */
export function useGetResources() {
    // const url = endpoints.resource.list;

    const url = endpoints.resource.list;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            resources: data || [], // Adjusted based on your existing response structure
            resourcesLoading: isLoading,
            resourcesError: error,
            resourcesValidating: isValidating,
            resourcesEmpty: !isLoading && !isValidating && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


/**
 * Hook to get specific Application details
 */
export function useGetResource(id) {
    // const url = id ? endpoints.resource.details(id) : null;
    const url = id ? endpoints.resource.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            resource: data || {},// Adjusted based on your existing response structure
            resourceLoading: isLoading,
            resourceError: error,
            resourceValidating: isValidating,
            // resourceEmpty: !isLoading && !isValidating && !data?.data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}