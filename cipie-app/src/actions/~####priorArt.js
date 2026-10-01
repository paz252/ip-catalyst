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
export function useGetPriorArts() {
    const url = endpoints.priorArtSearch.list;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            priorArts: data?.data || [], // Adjusted based on your existing response structure
            priorArtsLoading: isLoading,
            priorArtsError: error,
            priorArtsValidating: isValidating,
            priorArtsEmpty: !isLoading && !isValidating && !data?.data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

/**
 * Hook to get personal Prior Art searches
 */
export function useGetMyPriorArts() {
    const url = endpoints.priorArtSearch.my;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const rawData = data?.data || [];

        // Sort by date descending (Latest first)
        const sortedData = [...rawData].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        return {
            myPriorArts: sortedData,
            myPriorArtsLoading: isLoading,
            myPriorArtsError: error,
            myPriorArtsValidating: isValidating,
            priorArtsEmpty: !isLoading && !isValidating && !sortedData.length,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

/**
 * Hook to get specific Prior Art details
 */
export function useGetPriorArt(id) {
    const url = id ? endpoints.priorArtSearch.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            priorArt: data?.data,
            priorArtLoading: isLoading,
            priorArtError: error,
            priorArtValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

const older_handleResponse = async (request, mutateUrls = []) => {
    try {
        const res = await request;
        const { success } = res.data;

        if (success && mutateUrls.length > 0) {
            mutateUrls.forEach((url) => mutate(url));
        }

        return res.data; // Returns { success, message, data, errors }
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            message: error.message || 'Network Error',
            errors: error.response?.data?.errors || [error.message],
        };
    }
};

const old_handleResponse = async (request, mutateUrls = []) => {
    try {
        const res = await request;
        const { success } = res.data;

        if (success && mutateUrls.length > 0) {
            mutateUrls.forEach((url) => mutate(url));
        }

        return res.data;
    } catch (error) {
        console.error('API Error:', error);

        const responseData = error.response?.data;

        // ASP.NET validation errors
        if (responseData?.errors) {
            const errors = Object.values(responseData.errors)
                .flat()
                .filter(Boolean);

            return {
                success: false,
                message: errors.join('\n'),
                errors,
            };
        }

        // Other API errors
        return {
            success: false,
            message:
                responseData?.message ||
                responseData?.Message ||
                responseData?.title ||
                error.message ||
                'Network Error',
            errors: [error.message],
        };
    }
};

const handleResponse = async (request, mutateUrls = []) => {
    try {
        const res = await request;
        const { success } = res.data;

        if (success && mutateUrls.length > 0) {
            mutateUrls.forEach((url) => mutate(url));
        }

        return res.data;
    } catch (error) {
        console.error('API Error:', error);

        const errors = error?.errors
            ? Object.values(error.errors).flat()
            : [];

        return {
            success: false,
            message:
                errors.length > 0
                    ? errors.join('\n')
                    : error?.message || 'Network Error',
            errors,
        };
    }
};

export const createPriorArtSearch = async (payload) =>
    handleResponse(
        axios.post(endpoints.priorArtSearch.create, payload),
        [endpoints.priorArtSearch.list, endpoints.priorArtSearch.my]
    );

export const updatePriorArtDetails = async (id, payload) =>
    handleResponse(
        axios.put(`${endpoints.priorArtSearch.root}/${id}`, payload),
        [endpoints.priorArtSearch.list, endpoints.priorArtSearch.my, endpoints.priorArtSearch.details(id)]
    );

export const deletePriorArt = async (id) =>
    handleResponse(
        axios.delete(`${endpoints.priorArtSearch.root}/${id}`),
        [endpoints.priorArtSearch.list, endpoints.priorArtSearch.my]
    );

export const submitPriorArt = async (id) =>
    handleResponse(
        axios.post(`${endpoints.priorArtSearch.root}/${id}/submit`, {
            remarks: "Application submitted"
        }),
        [endpoints.priorArtSearch.list, endpoints.priorArtSearch.details(id), endpoints.priorArtSearch.my]
    );

export const initializeFullSubmission = async (id, submissionData) => {
    const formData = new FormData();
    formData.append('ApplicationId', id);

    Object.keys(submissionData).forEach((key) => {
        const value = submissionData[key];
        if (value === null || value === undefined) return;

        if (key === 'documents' && Array.isArray(value)) {
            value.forEach((file) => formData.append('Documents', file));
        } else if (key.toLowerCase() !== 'applicationid') {
            const formalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            formData.append(formalizedKey, value);
        }
    });

    return handleResponse(
        axios.post(
            `${endpoints.priorArtSearch.root}/${id}/initialize-submission`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        ),
        [endpoints.priorArtSearch.details(id), endpoints.priorArtSearch.my]
    );
};


export const createAndSubmitPriorArt = async (payload, isDraft, onProgress) => {
    try {
        // console.log(isDraft)
        // Step 1: Create
        if (onProgress) onProgress('Creating prior art data...');
        const createRes = await createPriorArtSearch(payload);
        if (!createRes.success) return createRes;

        const applicationId = createRes.data;

        // Step 2: Initialize / Upload Documents
        if (onProgress) onProgress('Uploading documents...');
        const initRes = await initializeFullSubmission(applicationId, payload);
        if (!initRes.success) return initRes;

        // Step 3: Final Submission (if not draft)
        if (!isDraft) {
            if (onProgress) onProgress('Finalizing submission...');
            const submitRes = await submitPriorArt(applicationId);
            return submitRes;
        }

        return initRes;
    } catch (error) {
        return {
            success: false,
            message: 'Application failed',
            errors: [error.message],
        };
    }
};