import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

export function useGetMyInternationalPatents() {
  const URL = endpoints.internationalPatentfiling.my;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const rawData = data?.data || [];

    // Sort by date descending (Latest first)
    const sortedData = [...rawData].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      patents: sortedData,
      patentsLoading: isLoading,
      patentsError: error,
      patentsValidating: isValidating,
      patentsEmpty: !isLoading && !isValidating && !sortedData.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function useGetInternationalPatent(id) {
  const URL = id ? endpoints.internationalPatentfiling.details(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return useMemo(
    () => ({
      patent: data?.data,
      patentLoading: isLoading,
      patentError: error,
      patentValidating: isValidating,
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

// ----------------------------------------------------------------------

export const createInternationalPatent = async (formData) => {
  const request = axios.post(endpoints.internationalPatentfiling.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return handleResponse(request, [endpoints.internationalPatentfiling.my]);
};

export const submitInternationalPatent = async (id) => {
  const request = axios.post(`${endpoints.internationalPatentfiling.root}/${id}/submit`, {
    remarks: 'Application submitted',
  });

  return handleResponse(request, [
    endpoints.internationalPatentfiling.my,
    endpoints.internationalPatentfiling.details(id),
  ]);
};

// ----------------------------------------------------------------------

/**
 * Integrated Workflow for international Patent
 * `formData` must already be a FormData instance built by the caller
 * (see InternationalPatentMsmeCreateEditForm's onSubmit).
 */
export const createAndSubmitInternationalPatent = async (formData, isDraft, onProgress) => {
  try {
    // Step 1: Create / Upload
    if (onProgress) onProgress(isDraft ? 'Saving draft...' : 'Uploading patent documents...');
    const createRes = await createInternationalPatent(formData);

    const patentId = createRes.data?.id || createRes.data?.applicationId || createRes.data;

    if (!createRes.success || !patentId) {
      return createRes;
    }

    // Step 2: Submit
    if (!isDraft) {
      if (onProgress) onProgress('Finalizing submission...');
      return await submitInternationalPatent(patentId);
    }

    return createRes;
  } catch (error) {
    console.error('international Patent Workflow Error:', error);
    return {
      success: false,
      message: 'Patent application process failed',
      errors: [error.message],
    };
  }
};

export const updateInternationalPatentDetails = async (applicationId, formData) => {
  const request = axios.put(
    endpoints.internationalPatentfiling.update(applicationId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return handleResponse(request, [
    endpoints.internationalPatentfiling.my,
    endpoints.internationalPatentfiling.details(applicationId),
  ]);
};

export const deleteInternationalPatent = async (id) => {
    const request = axios.delete(`${endpoints.internationalPatentfiling.root}/${id}`);

    return handleResponse(request, [endpoints.internationalPatentfiling.my]);
};