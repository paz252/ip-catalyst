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
export function useGetSubmittedApplications() {
    const url = endpoints.admin.list;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            applications: data?.data || [], // Adjusted based on your existing response structure
            applicationsLoading: isLoading,
            applicationsError: error,
            applicationsValidating: isValidating,
            applicationsEmpty: !isLoading && !isValidating && !data?.data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


/**
 * Hook to get specific Application details
 */
export function useGetApplication(id) {
    const url = id ? endpoints.admin.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            application: data?.data || {},// Adjusted based on your existing response structure
            applicationLoading: isLoading,
            applicationError: error,
            applicationValidating: isValidating,
            // applicationEmpty: !isLoading && !isValidating && !data?.data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function replyToQuery(data) {
    const {
        applicationId,
        replyText,
    } = data
    const response = await axios.post(
        endpoints.admin.replyToQuery(applicationId),
        {
            replyText,
        }
    );

    // Refresh details page
    mutate(endpoints.admin.details(applicationId));

    // Refresh list page
    mutate(endpoints.admin.list);

    return response.data;
}

export async function approveApplication({
    applicationId,
    remarks,
}) {
    const response = await axios.post(
        endpoints.admin.approve(applicationId),
        {
            remarks,
        }
    );

    // Refresh details page
    mutate(endpoints.admin.details(applicationId));

    // Refresh list page
    mutate(endpoints.admin.list);

    return response.data;
}

export async function rejectApplication({
    applicationId,
    remarks,
}) {
    const response = await axios.post(
        endpoints.admin.reject(applicationId),
        {
            remarks,
        }
    );

    mutate(endpoints.admin.details(applicationId));
    mutate(endpoints.admin.list);

    return response.data;
}