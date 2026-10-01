import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetBlogs() {
  const url = endpoints.resource.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      // Checks if data exists, then looks for .blogs array or defaults to empty
      blogs: data || [],
      blogsLoading: isLoading,
      blogsError: error,
      blogsValidating: isValidating,
      blogsEmpty: !isLoading && !isValidating && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBlog(blogId) {
  // SWR will skip the request if url is null
  const url = blogId ? endpoints.resource.details(blogId) : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      blog: data,
      blogLoading: isLoading,
      blogError: error,
      blogValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}