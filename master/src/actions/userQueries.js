import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
// HOOKS
// ----------------------------------------------------------------------

export function useGetMyQueries() {
    const URL = endpoints.userQuery.my;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        revalidateOnFocus: true,
        revalidateOnMount: true,
    });

    // Manual refetch (no mutate)
    const refetchQueries = async () => {
        const res = await fetcher(URL);
        return res.data || [];
    };

     const memoizedValue = useMemo(() => {
        const rawData = data?.data || [];
        
        // Sort by date descending (Latest first)
        const sortedData = [...rawData].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        return {
            queries: sortedData,
            queriesLoading: isLoading,
            queriesError: error,
            queriesValidating: isValidating,
            queriesEmpty: !isLoading && !isValidating && !sortedData.length,
            refetchQueries,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetQuery(id) {
    const URL = id ? endpoints.userQuery.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    return useMemo(
        () => ({
            query: data?.data,
            queryLoading: isLoading,
            queryError: error,
            queryValidating: isValidating,
        }),
        [data?.data, error, isLoading, isValidating]
    );
}

// ----------------------------------------------------------------------
// API HANDLER
// ----------------------------------------------------------------------

const handleResponse = async (request) => {
    try {
        const res = await request;
        return res.data;
    } catch (error) {
        console.error('API Error:', error);

        return {
            success: false,
            message: error.message || 'Network Error',
            errors: error.response?.data?.errors || [error.message],
        };
    }
};

// ----------------------------------------------------------------------
// API CALLS
// ----------------------------------------------------------------------

export const createQuery = async (payload) => {
    const request = axios.post(endpoints.userQuery.create, payload);
    return handleResponse(request);
};

// ----------------------------------------------------------------------

export const submitQuery = async (id) => {
    const request = axios.post(`${endpoints.userQuery.root}/${id}/submit`, {
        remarks: 'Query submitted',
    });

    return handleResponse(request);
};

// ----------------------------------------------------------------------
// WORKFLOW
// ----------------------------------------------------------------------

export const createAndSubmitQuery = async (payload, isDraft, onProgress) => {
    try {
        // Step 1: Create
        if (onProgress) {
            onProgress(isDraft ? 'Saving draft...' : 'Creating query...');
        }

        const createRes = await createQuery(payload);

        const queryId = createRes.data;

        if (!createRes.success || !queryId) {
            return createRes;
        }

        // Step 2: Submit (if not draft)
        if (!isDraft) {
            if (onProgress) onProgress('Submitting query...');
            return await submitQuery(queryId);
        }

        return createRes;

    } catch (error) {
        console.error('User Query Workflow Error:', error);

        return {
            success: false,
            message: 'Query process failed',
            errors: [error.message],
        };
    }
};