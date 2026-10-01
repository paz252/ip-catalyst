import axios, { endpoints } from 'src/lib/axios';

/** **************************************
 Get Prir art search
 *************************************** */
export const downloadDocument = async (id) => {
  try {
    const URL = endpoints.document.download(id);
    const response = await axios.get(URL, {
      responseType: 'blob', // 🔹 Critical for binary data
      onDownloadProgress: (progressEvent) => {
        // console.log(`Download progress: ${Math.round((progressEvent.loaded * 100) / progressEvent.total)}%`);
      },
    });

    // 1. Create a URL for the blob
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);

    // 2. Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;

    // 3. Try to get filename from headers, otherwise fallback
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `PriorArt_Documents_${id.slice(0, 8)}.zip`;

    if (contentDisposition && contentDisposition.includes('filename=')) {
      fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/["']/g, '');
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    // 4. Trigger download and cleanup
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response;
  } catch (error) {
    console.error('Failed to download documents:', error);
    throw error;
  }
};
