import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// Upper bound for a single request. Without a timeout, a request the server
// never answers keeps the caller awaiting forever, and the form's loading
// overlay with it. Generous because uploads can be up to 10 x 5 MB.
const REQUEST_TIMEOUT_MS = 180000;

// ----------------------------------------------------------------------

/**
 * Hook to get all Prior Art searches
 */
export function useGetPriorArts() {
    const url = endpoints.priorArtSearch.list;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            priorArts: data?.data || [],
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
        const sortedData = [...rawData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

// ----------------------------------------------------------------------
// Response handling

const collectMessages = (body) => {
    if (!body) return [];
    if (typeof body === 'string') return [body];

    const collected = [];
    const { errors } = body;

    if (Array.isArray(errors)) {
        collected.push(...errors);
    } else if (errors && typeof errors === 'object') {
        collected.push(...Object.values(errors).flat());
    }

    if (collected.length === 0) {
        const single = body.message || body.Message || body.detail || body.title;
        if (single) collected.push(single);
    }

    return collected.filter(Boolean).map(String);
};

const handleResponse = async (request, mutateUrls = []) => {
    try {
        const res = await request;
        const body = res?.data;

        // Normal API envelope.
        if (body && typeof body === 'object' && 'success' in body) {
            if (body.success && mutateUrls.length > 0) {
                mutateUrls.forEach((url) => mutate(url));
            }
            return body;
        }

        mutateUrls.forEach((url) => mutate(url));
        return {
            success: true,
            message: typeof body === 'string' && body ? body : undefined,
            data: body || null,
            errors: [],
        };
    } catch (error) {
        console.error('API Error:', error);

        const body = error?.response?.data ?? error;
        const errors = collectMessages(body);
        const fallback = error?.message || 'Network Error';

        return {
            success: false,
            message: errors.length > 0 ? errors.join('\n') : fallback,
            errors: errors.length > 0 ? errors : [fallback],
        };
    }
};

// ----------------------------------------------------------------------

export const createPriorArtSearch = async (payload) => {
    const { documents, ...fields } = payload || {};

    return handleResponse(axios.post(endpoints.priorArtSearch.create, fields, { timeout: REQUEST_TIMEOUT_MS }), [
        endpoints.priorArtSearch.list,
        endpoints.priorArtSearch.my,
    ]);
};

export const updatePriorArtDetails = async (id, payload) => {
 
    const request = axios.put(
        endpoints.priorArtSearch.update(id),
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return handleResponse(
        request, [
        endpoints.priorArtSearch.my,
        endpoints.priorArtSearch.details(id)
    ]);
}

export const deletePriorArt = async (id) =>
    handleResponse(axios.delete(`${endpoints.priorArtSearch.root}/${id}`, { timeout: REQUEST_TIMEOUT_MS }), [
        endpoints.priorArtSearch.list,
        endpoints.priorArtSearch.my,
    ]);

export const submitPriorArt = async (id) =>
    handleResponse(
        axios.post(
            `${endpoints.priorArtSearch.root}/${id}/submit`,
            { remarks: 'Application submitted' },
            { timeout: REQUEST_TIMEOUT_MS }
        ),
        [endpoints.priorArtSearch.list, endpoints.priorArtSearch.details(id), endpoints.priorArtSearch.my]
    );

export const initializeFullSubmission = async (id, { documents, userId } = {}) => {
    const formData = new FormData();

    formData.append('ApplicationId', id);

    if (!userId) {
        // Fail loudly rather than repeat the silent "Draft not found." — this
        // means the caller didn't have a signed-in user id to send.
        return {
            success: false,
            message: 'Unable to determine the current user. Please sign in again.',
            errors: ['Unable to determine the current user. Please sign in again.'],
        };
    }
    formData.append('UserId', userId);

    if (Array.isArray(documents)) {
        documents.forEach((file) => {
            if (file instanceof File) formData.append('Documents', file);
        });
    }

    return handleResponse(
        axios.post(`${endpoints.priorArtSearch.root}/${id}/initialize-submission`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: REQUEST_TIMEOUT_MS,
        }),
        [endpoints.priorArtSearch.details(id), endpoints.priorArtSearch.my]
    );
};

export const createAndSubmitPriorArt = async (payload, isDraft, onProgress, userId) => {
    try {
        // Step 1: Create
        if (onProgress) onProgress('Creating prior art data...');

        const createRes = await createPriorArtSearch(payload);
        if (!createRes.success) return createRes;

        const applicationId = createRes.data?.id || createRes.data?.applicationId || createRes.data;

        if (!applicationId || typeof applicationId === 'object') {
            return {
                success: false,
                message: 'The application was created but no application id was returned.',
                errors: ['The application was created but no application id was returned.'],
            };
        }

        // Step 2: Initialize / Upload Documents
        if (onProgress) onProgress('Uploading documents...');

        const initRes = await initializeFullSubmission(applicationId, { documents: payload.documents, userId });

        if (!initRes.success) {
            // FIX: the record created in step 1 was left behind as an empty shell,
            // and because the form stays in "create" mode after a failure, every
            // retry created another one. Roll the shell back (handleResponse never
            // throws, so a failed delete just leaves things as they were).
            await deletePriorArt(applicationId);
            return initRes;
        }

        // Step 3: Final Submission (if not draft)
        if (!isDraft) {
            if (onProgress) onProgress('Finalizing submission...');

            const submitRes = await submitPriorArt(applicationId);

            if (!submitRes.success) {
                return {
                    ...submitRes,
                    applicationId,
                    errors: ['Your application was saved as a draft, but submitting it failed.', ...(submitRes.errors || [])],
                };
            }

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