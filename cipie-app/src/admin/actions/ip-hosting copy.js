import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};


// export function useGetPatents(domain, category, page = 1, pageSize = 10, options = {}) {
//     const { enabled = true } = options;
//     const domainConfig = PATENT_DOMAINS[domain];

//     const mainTechnologyDomain = domainConfig?.label;
//     const techSubDomain = domainConfig?.subDomains?.[category];

//     // console.log({
//     //     domain,
//     //     category,
//     //     mainTechnologyDomain,
//     //     techSubDomain,
//     // });

//     const shouldFetch =
//         enabled && mainTechnologyDomain && techSubDomain;

//     const url =
//         shouldFetch
//             ? [
//                 endpoints.patent.byDomain,
//                 {
//                     params: {
//                         mainTechnologyDomain,
//                         techSubDomain,
//                         pageNumber: page,
//                         pageSize,
//                     },
//                 },
//             ]
//             : null;

//     const { data, isLoading, error, isValidating } = useSWR(url, fetcher,
//         {
//             revalidateOnFocus: false,
//         }
//     );
//     const { totalRecords, totalPages, currentPage, recordsCount, content } = data || {};

//     return useMemo(
//         () => ({
//             patents: content || [],
//             totalRecords: totalRecords || 0,
//             totalPages: totalPages || 0,
//             currentPage: currentPage || 1,
//             recordsCount: recordsCount || 0,
//             patentsLoading: isLoading,
//             patentsError: error,
//             patentsValidating: isValidating,
//             patentsEmpty:
//                 !isLoading && !isValidating && !data?.content?.length,
//         }),
//         [data, error, isLoading, isValidating]
//     );
// }

// export function useGetAllPatents(page = 1, pageSize = 10, options = {}) {
//     const { enabled = true } = options;

//     const url = enabled ? [
//         endpoints.patent.allPatents,
//         {
//             params: {
//                 pageNumber: page,
//                 pageSize,
//             },
//         },
//     ] : null; // this stops the request from being made when enabled is false

//     const { data, isLoading, error, isValidating } = useSWR(url, fetcher,
//         {
//             revalidateOnFocus: false,
//         }
//     );
//     const { totalRecords, totalPages, currentPage, recordsCount, content } = data || {};

//     return useMemo(
//         () => ({
//             patents: content || [],
//             totalRecords: totalRecords || 0,
//             totalPages: totalPages || 0,
//             currentPage: currentPage || 1,
//             recordsCount: recordsCount || 0,
//             patentsLoading: isLoading,
//             patentsError: error,
//             patentsValidating: isValidating,
//             patentsEmpty:
//                 !isLoading && !isValidating && !data?.content?.length,
//         }),
//         [data, error, isLoading, isValidating]
//     );
// }

export function useGetAllPatents() {

    const url = [
        endpoints.admin.ipHosting.allUserPatents, { method: 'GET' }
    ]

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    // const { totalRecords, totalPages, currentPage, recordsCount, data } = data || {};

    return useMemo(
        () => ({
            patents: data?.data || [],
            totalRecords: data?.data?.length || 0,
            // totalPages: totalPages || 0,
            // currentPage: currentPage || 1,
            // recordsCount: recordsCount || 0,
            patentsLoading: isLoading,
            patentsError: error,
            patentsValidating: isValidating,
            patentsEmpty:
                !isLoading && !isValidating && !data?.content?.length,
        }),
        [data, error, isLoading, isValidating]
    );
}

// export function useGetPatentDomainsCount() {
//     const url = [endpoints.patent.domainWisePatentCount, { method: 'GET' }];

//     const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
//         revalidateOnFocus: false,
//     });

//     const { total, domains } = data || {};

//     return useMemo(
//         () => ({
//             domains: domains || [],
//             total: total || 0,

//             domainLoading: isLoading,
//             domainError: error,
//             domainValidating: isValidating,
//             domainEmpty: !isLoading && !isValidating && !domains?.length,
//         }),
//         [data, isLoading, error, isValidating]
//     );
// }

export function useGetPatent(id) {
    // const url = id ? endpoints.patent.details(id) : null;
    const url = [endpoints.admin.ipHosting.details(id), { method: 'GET' }];
    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            patent: data?.data || {},// Adjusted based on your existing response structure
            patentLoading: isLoading,
            patentError: error,
            patentValidating: isValidating,
            // applicationEmpty: !isLoading && !isValidating && !data?.data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetActivity(id) {
    const url = [endpoints.admin.ipHosting.activityLogs(id), { method: 'GET' }];
    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            activity: data?.data || {},// Adjusted based on your existing response structure
            activityLoading: isLoading,
            activityError: error,
            activityValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

const handleResponse = async (request, mutateUrls = []) => {
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

export const reviewIpHosting = async (id, payload) => {
    const IpHostingList = [
        endpoints.admin.ipHosting.allUserPatents,
        {
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
        },
    ];

    const url = endpoints.admin.ipHosting.review(id);

    return handleResponse(
        axios.patch(url, payload),
        [IpHostingList]
    );
}


