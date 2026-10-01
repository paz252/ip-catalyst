import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// get all logos
export function useGetUserLogoList() {
    const url = endpoints.challenge.logo.getAll;

    const { data, isLoading, error, isValidating } = useSWR(
        url,
        fetcher,
        swrOptions
    );

    const memoizedValue = useMemo(() => {
        const rawData = data?.data || [];

        const sortedData = [...rawData].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return {
            logoList: sortedData,
            logoListLoading: isLoading,
            logoListError: error,
            logoListValidating: isValidating,
            logoListEmpty:
                !isLoading && !isValidating && !sortedData.length,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export function useGetLogoList(isAdmin = false) {
    const url = isAdmin
        ? endpoints.admin.challenge.logo.getAll
        : endpoints.challenge.logo.getAll;

    const { data, isLoading, error, isValidating } = useSWR(
        url,
        fetcher,
        swrOptions
    );

    const memoizedValue = useMemo(() => {
        const rawData = data?.data || [];

        const sortedData = [...rawData].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return {
            logoList: sortedData,
            logoListLoading: isLoading,
            logoListError: error,
            logoListValidating: isValidating,
            logoListEmpty:
                !isLoading && !isValidating && !sortedData.length,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

// logo details
export function useGetLogoDetails(id,) {
    const url = endpoints.challenge.logo.details(id);

    const { data, isLoading, error, isValidating } = useSWR(
        url,
        fetcher,
        swrOptions
    );

    const memoizedValue = useMemo(
        () => ({
            logoDetails: data?.data || null,
            logoDetailsLoading: isLoading,
            logoDetailsError: error,
            logoDetailsValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// delete logo 
export async function deleteLogo(id, remark) {
    const URL = endpoints.challenge.logo.details(id);

    const config = {};

    if (remark?.trim()) {
        config.data = {
            remark,
        };
    }

    const response = await axios.delete(URL, config);

    return response.data;
}

export async function createLogoChallenge(formData) {
    const URL = endpoints.challenge.logo.create;

    const response = await axios.post(
        URL,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
}

// admin 
export async function updateLogoStatus(payload) {
    const URL = endpoints.admin.challenge.logo.updateStatus;

    const response = await axios.post(URL, payload);

    return response.data;
}