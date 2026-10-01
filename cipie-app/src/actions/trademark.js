import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export function useGetMyTrademarks() {
    const URL = endpoints.trademark.my;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(() => {
        const rawData = data?.data || [];

        // Sort by date descending (Latest first)
        const sortedData = [...rawData].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        return {
            trademarks: sortedData,
            trademarksLoading: isLoading,
            trademarksError: error,
            trademarksValidating: isValidating,
            trademarksEmpty: !isLoading && !isValidating && !sortedData.length,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export function useGetTrademark(id) {
    const URL = id ? endpoints.trademark.details(id) : null;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    return useMemo(() => ({
        trademark: data?.data,
        trademarkLoading: isLoading,
        trademarkError: error,
        trademarkValidating: isValidating,
    }), [data?.data, error, isLoading, isValidating]);
}

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
        return {
            success: false,
            message: error.message || 'Network Error',
            errors: error.response?.data?.errors || [error.message],
        };
    }
};

export const createTrademark = async (payload) => {
    const formData = new FormData();

    // Basic fields
    formData.append("TrademarkName", payload.trademarkName);
    formData.append("Description", payload.description ?? "");

    // Organizations
    payload.organizations.forEach((org, index) => {
        formData.append(`Organizations[${index}].Name`, org.name || '');
        formData.append(`Organizations[${index}].Address`, org.address || '');
        formData.append(`Organizations[${index}].IsPrimary`, org.isPrimary ?? false);
    });

    // Inventors
    payload.inventors.forEach((inv, index) => {
        formData.append(`Inventors[${index}].FullName`, inv.fullName || '');
        formData.append(`Inventors[${index}].Email`, inv.email ?? "");
    });

    // Files
    if (payload.documents?.length) {
        payload.documents.forEach((file) => {
            if (file instanceof File) formData.append("Documents", file);
        });
    }

    const request = axios.post(endpoints.trademark.create, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    // Automatically refreshes the List View once created
    return handleResponse(request, [endpoints.trademark.my]);
};

export const submitTrademark = async (id) => {
    const request = axios.post(`${endpoints.trademark.root}/${id}/submit`, {
        remarks: "Application submitted",
    });

    // Refreshes the List AND the specific Details page
    return handleResponse(request, [
        endpoints.trademark.my,
        endpoints.trademark.details(id)
    ]);
};

export const deleteTrademark = async (id) => {
    const request = axios.delete(`${endpoints.trademark.root}/${id}`);

    return handleResponse(request, [endpoints.trademark.my]);
};

export const createAndSubmitTrademark = async (payload, isDraft, onProgress) => {
    try {
        // Step 1: Create the record (This already includes File Upload via FormData)
        if (onProgress) onProgress(isDraft ? 'Saving draft...' : 'Uploading and creating trademark...');

        const createRes = await createTrademark(payload);

        const trademarkId = createRes.data?.id || createRes.data?.applicationId || createRes.data;

        if (!createRes.success || !trademarkId) {
            return createRes;
        }

        // Step 2: Final Submission (only if isDraft is false)
        if (!isDraft) {
            if (onProgress) onProgress('Finalizing submission...');

            return await submitTrademark(trademarkId);
        }

        return createRes;

    } catch (error) {
        console.error('Trademark Workflow Error:', error);
        return {
            success: false,
            message: 'Trademark process failed',
            errors: [error.message],
        };
    }
};

export const updateTrademark = async (applicationId, payload) => {
    const formData = new FormData();

    formData.append('TrademarkName', payload.trademarkName || '');
    formData.append('Description', payload.description || '');

    payload.organizations?.forEach((organization, index) => {
        formData.append(`Organizations[${index}].Name`, organization.name || '');
        formData.append(`Organizations[${index}].Address`, organization.address || '');
    });
    payload.inventors?.forEach((inventor, index) => {
        formData.append(`Inventors[${index}].FullName`, inventor.fullName || '');
        formData.append(`Inventors[${index}].Email`, inventor.email || '');
    });
    payload.documents?.forEach((document) => {
        if (document instanceof File) formData.append('Documents', document);
    });

    payload.documentsToDelete?.forEach((id, index) => {
        formData.append(`DocumentsToDelete[${index}]`, id);
    });

    const request = axios.put(endpoints.trademark.update(applicationId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return handleResponse(request, [
        endpoints.trademark.my,
        endpoints.trademark.details(applicationId),
    ]);
};