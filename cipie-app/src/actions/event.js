import useSWR from 'swr';
import { useMemo } from 'react';

import { CONFIG } from 'src/global-config';
import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
const API_URL = `${CONFIG.event}/api/Events`;

export function useGetEvents() {
  const url = endpoints.event.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      events: data?.events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      // eventsEmpty: !isLoading && !data?.events.length,
    }),
    [data?.events, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function fetchEvent(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message || 'Failed to fetch blog'
    };
  }
}

// ----------------------------------------------------------------------

export function useGetEvent(id) {
  // Use a conditional URL so SWR doesn't fetch if id is missing
  const url = id ? `${API_URL}/${id}` : null;

  // FIX: Pass fetchBlog as a reference, NOT fetchBlog(url)
  const { data, isLoading, error, isValidating } = useSWR(url, fetchEvent, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      event: data?.success ? data.data : null,
      postLoading: isLoading,
      postError: error || (data?.success === false ? data.error : null),
      postValidating: isValidating,
      // postEmpty: !isLoading && !data?.data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}