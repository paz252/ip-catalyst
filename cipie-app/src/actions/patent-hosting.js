import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';


const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};


// create id
export async function createIPHosting() {
    const URL = endpoints.patentHosting.createUserId;
    const response = await axios.post(URL);

    return response.data;
}

// get all patents
export function useGetPatentHostings() {
    const url = endpoints.patentHosting.getAll;

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
            patentHostings: sortedData,
            patentHostingsLoading: isLoading,
            patentHostingsError: error,
            patentHostingsValidating: isValidating,
            patentHostingsEmpty:
                !isLoading && !isValidating && !sortedData.length,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

// delete patent hosting 
export async function deletePatentHosting(id, remark) {
    const URL = endpoints.patentHosting.details(id);

    const config = {};

    if (remark?.trim()) {
        config.data = {
            remark,
        };
    }

    const response = await axios.delete(URL, config);

    return response.data;
}

// get specific id detailed data
export async function getIPHostingDetails(id) {
    // console.trace('getIPHostingDetails');
    const URL = endpoints.patentHosting.details(id);

    const response = await axios.get(URL);

    return response.data;
}

// save and update header section
export async function updateIPHostingHeader(id, data) {
    const URL = endpoints.patentHosting.header(id);

    const formData = new FormData();

    if (data.title !== undefined) {
        formData.append('title', data.title);
    }

    if (data.summary !== undefined) {
        formData.append('summary', data.summary);
    }

    if (data.legalStatusCurrent !== undefined) {
        formData.append('legalStatusCurrent', data.legalStatusCurrent);
    }

    if (data.bannerImage) {
        formData.append('bannerImage', data.bannerImage);
    }

    if (data.removeBannerImage) {
        formData.append('removeBannerImage', data.removeBannerImage);
    }

    const response = await axios.patch(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

// save and update patent information
export async function updateIPHostingPatentInformation(id, data) {
    const URL = endpoints.patentHosting.patentInformation(id);
    const response = await axios.patch(URL, data);

    return response.data;
}

// save, update and delete document
export async function uploadPatentDocuments(id, formData) {
    const URL = endpoints.patentHosting.document(id);

    const response = await axios.patch(
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

// save, update and delete media(images, video file, video url)
export async function uploadPatentMedia(id, formData) {
    const URL = endpoints.patentHosting.media(id);

    const response = await axios.patch(
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

export function useGetIPHostingDetails(id) {
    const URL = id ? endpoints.patentHosting.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            ipHosting: data?.data,
            ipHostingLoading: isLoading,
            ipHostingError: error,
            ipHostingValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// submit for approval
export async function submitPatentHostingForApproval(id) {
    const URL = endpoints.patentHosting.submitForApproval(id);

    const response = await axios.patch(URL);

    return response.data;
}

// reusable hook to get patent hosting details
export function useGetPatentHostingDetails(id) {
    const shouldFetch = Boolean(id && id !== 'new');

    return useSWR(
        shouldFetch ? ['hosting-details', id] : null,
        ([, hostingId]) => getIPHostingDetails(hostingId),
        {
            revalidateOnFocus: false,
        }
    );
}