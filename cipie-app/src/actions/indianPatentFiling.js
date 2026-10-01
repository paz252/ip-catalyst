import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';



export function useGetMyIndianPatents() {
  const URL = endpoints.indianPatentfiling.my;

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

export function useGetIndianPatent(id) {
  const URL = id ? endpoints.indianPatentfiling.details(id) : null;

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


export const createIndianPatent = async (formData) => {
  const request = axios.post(endpoints.indianPatentfiling.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return handleResponse(request, [endpoints.indianPatentfiling.my]);
};

export const submitIndianPatent = async (id) => {
  const request = axios.post(`${endpoints.indianPatentfiling.root}/${id}/submit`, {
    remarks: 'Application submitted',
  });

  return handleResponse(request, [
    endpoints.indianPatentfiling.my,
    endpoints.indianPatentfiling.details(id),
  ]);
};

// ----------------------------------------------------------------------

/**
 * Integrated Workflow for Indian Patent
 */
export const createAndSubmitIndianPatent = async (formData, isDraft, onProgress) => {
  try {
    // Step 1: Create / Upload
    if (onProgress) onProgress(isDraft ? 'Saving draft...' : 'Uploading patent documents...');
    const createRes = await createIndianPatent(formData);

    const patentId =
      createRes?.data?.id ??
      createRes?.data?.applicationId ??
      (typeof createRes?.data === "string" ? createRes.data : null);
    // console.log("CREATE RESPONSE:", createRes);

    if (!createRes.success || !patentId) {
      return createRes;
    }

    // Step 2: Submit
    if (!isDraft) {
      if (onProgress) onProgress('Finalizing submission...');
      return await submitIndianPatent(patentId);
    }

    return createRes;
  } catch (error) {
    console.error('Indian Patent Workflow Error:', error);
    return {
      success: false,
      message: 'Patent application process failed',
      errors: [error.message],
    };
  }
};

export const updateIndianPatentDetails = async (applicationId, formData) => {
  const request = axios.put(
    endpoints.indianPatentfiling.update(applicationId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return handleResponse(request, [
    endpoints.indianPatentfiling.my,
    endpoints.indianPatentfiling.details(applicationId),
  ]);
};

export const deleteIndianPatent = async (id) => {
    const request = axios.delete(`${endpoints.indianPatentfiling.root}/${id}`);

    return handleResponse(request, [endpoints.indianPatentfiling.my]);
};