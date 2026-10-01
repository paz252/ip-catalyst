import useSWR from 'swr';
import { useMemo } from 'react';


// ----------------------------------------------------------------------

// const API_URL = 'http://10.208.10.194:82/blogs';
const API_URL = 'https://cipie.in/blogs';

// ----------------------------------------------------------------------

export async function fetchBlog(url) {
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

export function useGetBlog(id) {
  // Use a conditional URL so SWR doesn't fetch if id is missing
  const url = id ? `${API_URL}/${id}` : null;

  // FIX: Pass fetchBlog as a reference, NOT fetchBlog(url)
  const { data, isLoading, error, isValidating } = useSWR(url, fetchBlog, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      post: data?.success ? data.data : null,
      postLoading: isLoading,
      postError: error || (data?.success === false ? data.error : null),
      postValidating: isValidating,
      postEmpty: !isLoading && !data?.data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}