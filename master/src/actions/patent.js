import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';
import { PATENT_DOMAINS } from 'src/config/patent-domain';

export function useGetPatents(domain, category, page = 1, pageSize = 10, options = {}) {
    const { enabled = true } = options;
    const domainConfig = PATENT_DOMAINS[domain];

    const mainTechnologyDomain = domainConfig?.label;
    const techSubDomain = domainConfig?.subDomains?.[category];

    // console.log({
    //     domain,
    //     category,
    //     mainTechnologyDomain,
    //     techSubDomain,
    // });

    const shouldFetch =
        enabled && mainTechnologyDomain && techSubDomain;

    const url =
        shouldFetch
            ? [
                endpoints.patent.byDomain,
                {
                    params: {
                        mainTechnologyDomain,
                        techSubDomain,
                        pageNumber: page,
                        pageSize,
                    },
                },
            ]
            : null;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { totalRecords, totalPages, currentPage, recordsCount, content } = data || {};

    return useMemo(
        () => ({
            patents: content || [],
            totalRecords: totalRecords || 0,
            totalPages: totalPages || 0,
            currentPage: currentPage || 1,
            recordsCount: recordsCount || 0,
            patentsLoading: isLoading,
            patentsError: error,
            patentsValidating: isValidating,
            patentsEmpty:
                !isLoading && !isValidating && !data?.content?.length,
        }),
        [data, error, isLoading, isValidating]
    );
}

export function useGetAllPatents(page = 1, pageSize = 10, options = {}) {
    const { enabled = true } = options;

    const url = enabled ? [
        endpoints.patent.allPatents,
        {
            params: {
                pageNumber: page,
                pageSize,
            },
        },
    ] : null; // this stops the request from being made when enabled is false

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { totalRecords, totalPages, currentPage, recordsCount, content } = data || {};

    return useMemo(
        () => ({
            patents: content || [],
            totalRecords: totalRecords || 0,
            totalPages: totalPages || 0,
            currentPage: currentPage || 1,
            recordsCount: recordsCount || 0,
            patentsLoading: isLoading,
            patentsError: error,
            patentsValidating: isValidating,
            patentsEmpty:
                !isLoading && !isValidating && !data?.content?.length,
        }),
        [data, error, isLoading, isValidating]
    );
}

export function useGetPatentDomainsCount() {
    const url = [endpoints.patent.domainWisePatentCount, { method: 'GET' }];

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
    });

    const { total, domains } = data || {};

    return useMemo(
        () => ({
            domains: domains || [],
            total: total || 0,

            domainLoading: isLoading,
            domainError: error,
            domainValidating: isValidating,
            domainEmpty: !isLoading && !isValidating && !domains?.length,
        }),
        [data, isLoading, error, isValidating]
    );
}


// export async function useGetPatentDetails(id) {
//     // console.trace('getIPHostingDetails');
//     const URL = endpoints.patent.details(id);

//     const response = await axios.get(URL);
//     console.log(response)
//     return response.data;
// }

export function useGetPatentDetails(id) {
    const URL = id
        ? endpoints.patent.details(id)
        : null;

    const { data, error, isLoading, mutate } = useSWR(URL, fetcher);

    return {
        data,
        isLoading,
        error,
        mutate,
    };
}