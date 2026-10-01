import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';



export function useGetMyIndustrialDesigns() {
  const URL = endpoints.indianIndustrialDesign.my;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const rawData = data?.data || [];

    // Sort by date descending (Latest first)
    const sortedData = [...rawData].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      designs: sortedData,
      designsLoading: isLoading,
      designsError: error,
      designsValidating: isValidating,
      designsEmpty: !isLoading && !isValidating && !sortedData.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function useGetIndustrialDesign(id) {
  const URL = id ? endpoints.indianIndustrialDesign.details(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return useMemo(
    () => ({
      design: data?.data,
      designLoading: isLoading,
      designError: error,
      designValidating: isValidating,
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


export const createIndustrialDesign = async (formData) => {
  const request = axios.post(endpoints.indianIndustrialDesign.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return handleResponse(request, [endpoints.indianIndustrialDesign.my]);
};

export const submitIndustrialDesign = async (id) => {
  const request = axios.post(`${endpoints.indianIndustrialDesign.root}/${id}/submit`, {
    remarks: 'Application submitted',
  });

  return handleResponse(request, [
    endpoints.indianIndustrialDesign.my,
    endpoints.indianIndustrialDesign.details(id),
  ]);
};

// ----------------------------------------------------------------------

/**
 * Integrated Workflow for Indian Patent
 */
export const createAndSubmitIndustrialDesign = async (formData, isDraft, onProgress) => {
  try {
    // Step 1: Create / Upload
    if (onProgress) onProgress(isDraft ? 'Saving draft...' : 'Uploading design documents...');
    const createRes = await createIndustrialDesign(formData);

    const designId =
      createRes?.data?.id ??
      createRes?.data?.applicationId ??
      (typeof createRes?.data === "string" ? createRes.data : null);
    // console.log("CREATE RESPONSE:", createRes);

    if (!createRes.success || !designId) {
      return createRes;
    }

    // Step 2: Submit
    if (!isDraft) {
      if (onProgress) onProgress('Finalizing submission...');
      return await submitIndustrialDesign(designId);
    }

    return createRes;
  } catch (error) {
    console.error('IndustrialDesign Workflow Error:', error);
    return {
      success: false,
      message: 'Design application process failed',
      errors: [error.message],
    };
  }
};