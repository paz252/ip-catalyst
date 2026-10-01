import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

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
export function useGetDashboardSummary () {
    const url = endpoints.admin.summary;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            summary: data?.data || [], // Adjusted based on your existing response structure
            summaryLoading: isLoading,
            summaryError: error,
            summaryValidating: isValidating,
            summaryEmpty: !isLoading && !isValidating && !data?.data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
