import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

export function useGetMyCopyrightFilingRequests() {
  const URL = endpoints.copyright.my;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const rawData = data?.data || [];

    // Sort by date descending (Latest first)
    const sortedData = [...rawData].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      copyrights: sortedData,
      copyrightsLoading: isLoading,
      copyrightsError: error,
      copyrightsValidating: isValidating,
      copyrightsEmpty: !isLoading && !isValidating && !sortedData.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function useGetCopyrightFilingRequest(id) {
  const URL = id ? endpoints.copyright.details(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return useMemo(
    () => ({
      copyright: data?.data,
      copyrightLoading: isLoading,
      copyrightError: error,
      copyrightValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
}

// ----------------------------------------------------------------------

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

export const deleteCopyright = async (id) => {
    const request = axios.delete(`${endpoints.copyright.root}/${id}`);

    return handleResponse(request, [endpoints.copyright.my]);
};

export const createCopyrightFilingRequest = async (formData) => {
  const request = axios.post(endpoints.copyright.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return handleResponse(request, [endpoints.copyright.my]);
};

export const submitCopyrightFilingRequest = async (id) => {
  const request = axios.post(`${endpoints.copyright.root}/${id}/submit`, {
    remarks: 'Application submitted',
  });

  return handleResponse(request, [
    endpoints.copyright.my,
    endpoints.copyright.details(id),
  ]);
};

export const updateCopyrightFilingRequest = async (applicationId, formData) => {
  const request = axios.put(endpoints.copyright.update(applicationId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return handleResponse(request, [
    endpoints.copyright.my,
    endpoints.copyright.details(applicationId),
  ]);
};

// ----------------------------------------------------------------------

/**
 * Integrated Workflow for international FilingRequest
 */
export const createAndSubmitCopyrightFilingRequest = async (formData, isDraft, onProgress) => {
  try {
    // Step 1: Create / Upload
    if (onProgress) onProgress(isDraft ? 'Saving draft...' : 'Uploading copyright documents...');
    const createRes = await createCopyrightFilingRequest(formData);

    const copyrightId = createRes.data?.id || createRes.data?.applicationId || createRes.data;

    if (!createRes.success || !copyrightId) {
      return createRes;
    }

    // Step 2: Submit
    if (!isDraft) {
      if (onProgress) onProgress('Finalizing submission...');
      return await submitCopyrightFilingRequest(copyrightId);
    }

    return createRes;
  } catch (error) {
    // console.error('international FilingRequest Workflow Error:', error);
    return {
      success: false,
      message: 'FilingRequest application process failed',
      errors: [error.message],
    };
  }
};