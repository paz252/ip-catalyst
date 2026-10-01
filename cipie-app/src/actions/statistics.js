import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

export function useCount(endpoint) {
    const { data, isLoading, error, isValidating } = useSWR(endpoint, fetcher);

    return useMemo(
        () => ({
            count: data?.data?.length || 0,
            isLoading,
            error,
            isValidating,
            isEmpty: !isLoading && !data?.data?.length,
        }),
        [data?.data, isLoading, error, isValidating]
    );
}

export const useMyIndianPatentsCount = () => useCount(endpoints.indianPatentfiling.my);
export const useMyInternationalPatentsCount = () => useCount(endpoints.internationalPatentfiling.my);
export const useMyPriorArtCount = () => useCount(endpoints.priorArtSearch.my);
export const useMyCopyrightCount = () => useCount(endpoints.copyright.my);
export const useMyTrademarkCount = () => useCount(endpoints.trademark.my);

// Combined hook for dashboard
export function useDashboardCounts() {
    const indianPatents = useMyIndianPatentsCount();
    const internationalPatents = useMyInternationalPatentsCount();
    const priorArt = useMyPriorArtCount();
    const copyrights = useMyCopyrightCount();
    const trademarks = useMyTrademarkCount();

    return useMemo(() => ({
        counts: {
            patents: indianPatents.count,
            internationalPatents: internationalPatents.count,
            priorArt: priorArt.count,
            copyrights: copyrights.count,
            trademarks: trademarks.count,
        },
        isLoading: indianPatents.isLoading || priorArt.isLoading || copyrights.isLoading || trademarks.isLoading,
        errors: {
            patents: indianPatents.error,
            internationalPatents: internationalPatents.error,
            priorArt: priorArt.error,
            copyrights: copyrights.error,
            trademarks: trademarks.error,
        },
        isEmpty: indianPatents.isEmpty && priorArt.isEmpty && copyrights.isEmpty && trademarks.isEmpty,
    }), [
        indianPatents.count, indianPatents.isLoading, indianPatents.error, indianPatents.isEmpty,
        internationalPatents.count, internationalPatents.isLoading, internationalPatents.error, internationalPatents.isEmpty,
        priorArt.count, priorArt.isLoading, priorArt.error, priorArt.isEmpty,
        copyrights.count, copyrights.isLoading, copyrights.error, copyrights.isEmpty,
        trademarks.count, trademarks.isLoading, trademarks.error, trademarks.isEmpty
    ]);
}



