// src/utils/fileUploadHelper.js
import { sha256 } from 'js-sha256';

import { checkFileContent } from 'src/utils/file-validation';

import { toast } from 'src/components/snackbar';

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Safely computes the SHA-256 hash of a file.
 * Returns null if the file handle on disk is stale (renamed, moved, or deleted).
 */
export const getSafeFileHash = async (file) => {
  if (!(file instanceof File)) return null;
  try {
    const buffer = await file.arrayBuffer();
    return sha256(new Uint8Array(buffer));
  } catch (error) {
    // DOMException NotFoundError thrown when file is moved, renamed, or deleted on disk
    return null;
  }
};

/**
 * Checks whether a File object is still accessible on disk without loading full contents.
 */
export const isFileReadable = async (file) => {
  if (!(file instanceof File)) return true;
  try {
    const slice = file.slice(0, 1);
    await slice.arrayBuffer();
    return true;
  } catch {
    return false;
  }
};

/**
 * Inspects form state for stale file handles (moved/deleted/renamed files),
 * clears their React state automatically, and checks for duplicates.
 */
export const checkDuplicatesAndCleanStaleFiles = async ({
  newFile,
  currentField,
  getValues,
  setValue,
  uploadFields = [],
  fieldLabels = {},
}) => {
  const currentValues = getValues();
  const newFileHash = await getSafeFileHash(newFile);

  if (!newFileHash) {
    return { isNewFileReadable: false };
  }

  const cleanedFieldLabels = [];
  let isDuplicate = false;
  let duplicateFieldLabel = null;

  for (const key of uploadFields) {
    if (key === currentField) continue;
    const existingFile = currentValues[key];

    if (!(existingFile instanceof File)) continue;

    const existingHash = await getSafeFileHash(existingFile);

    // If existing file in state is unreadable (moved/deleted/renamed on disk)
    if (existingHash === null) {
      setValue(key, null, { shouldValidate: true });
      const label = fieldLabels[key] || key;
      cleanedFieldLabels.push(label);
      continue;
    }

    if (newFileHash === existingHash) {
      isDuplicate = true;
      duplicateFieldLabel = fieldLabels[key] || key;
    }
  }

  return {
    isNewFileReadable: true,
    isDuplicate,
    duplicateFieldLabel,
    cleanedFieldLabels,
  };
};

/**
 * Master helper function to validate, clean stale state, and upload files.
 */
export const handleFileUpload = async ({
  file,
  fieldName,
  getValues,
  setValue,
  clearErrors,
  setFileErrors,
  uploadFields = [],
  fieldLabels = {},
  maxSize = DEFAULT_MAX_SIZE,
  existingDocuments = {},
  setDeletedDocumentIds,
}) => {
  if (!file) return false;

  // 1. Basic Type Check (PDF)
  const isPdf = file?.name?.toLowerCase().endsWith('.pdf') && file.type === 'application/pdf';
  if (!isPdf) {
    const msg = 'Only PDF files are allowed';
    setFileErrors((prev) => ({ ...prev, [fieldName]: msg }));
    toast.error(msg);
    return false;
  }

  // 2. File Size Check
  if (file.size > maxSize) {
    const msg = `File must be less than ${maxSize / (1024 * 1024)}MB`;
    setFileErrors((prev) => ({ ...prev, [fieldName]: msg }));
    toast.error(msg);
    return false;
  }

  // 3. Content Safety Check
  const isSafe = await checkFileContent(file);
  if (!isSafe) {
    const msg = 'File contains forbidden or malicious content.';
    setFileErrors((prev) => ({ ...prev, [fieldName]: msg }));
    toast.error(msg);
    return false;
  }

  // 4. Duplicate Check + Stale State Auto-Cleanup
  const { isNewFileReadable, isDuplicate, duplicateFieldLabel, cleanedFieldLabels } =
    await checkDuplicatesAndCleanStaleFiles({
      newFile: file,
      currentField: fieldName,
      getValues,
      setValue,
      uploadFields,
      fieldLabels,
    });

  // Notify user if any stale files in other fields were removed automatically
  if (cleanedFieldLabels.length > 0) {
    cleanedFieldLabels.forEach((label) => {
      toast.warning(`File previously attached to "${label}" was moved/renamed and removed.`);
    });
  }

  if (!isNewFileReadable) {
    const msg = 'The selected file could not be read. Please re-select the file.';
    setFileErrors((prev) => ({ ...prev, [fieldName]: msg }));
    toast.error(msg);
    return false;
  }

  if (isDuplicate) {
    const msg = `This file is identical to the document in "${duplicateFieldLabel}". Each upload must be unique.`;
    setFileErrors((prev) => ({ ...prev, [fieldName]: msg }));
    toast.error(msg);
    return false;
  }

  // 5. Success - Clear errors and update React Form State with fresh File object
  setFileErrors((prev) => ({ ...prev, [fieldName]: null }));

  if (existingDocuments[fieldName] && setDeletedDocumentIds) {
    const replacementDocument = existingDocuments[fieldName];
    setDeletedDocumentIds((prev) =>
      prev.filter((id) => id !== replacementDocument.applicationDocumentId)
    );
  }

  setValue(fieldName, file, {
    shouldValidate: true,
    shouldDirty: true,
  });

  if (clearErrors) {
    clearErrors(fieldName);
  }

  return true;
};