import * as z from 'zod';
import { sha256 } from 'js-sha256';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { checkFileContent } from 'src/utils/file-validation';
import { handleFileUpload } from 'src/utils/fileUploadHelper';

import {
  createAndSubmitPriorArt,
  updatePriorArtDetails,
  submitPriorArt,
} from 'src/actions/priorArt';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const acceptedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const INVALID_TYPE_MESSAGE = 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG are allowed.';

// ----------------------------------------------------------------------

const getFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  return sha256(new Uint8Array(buffer));
};

const fileScanCache = new WeakMap();

const scanFile = async (file) => {
  const cached = fileScanCache.get(file);
  if (cached) return cached;
  const [safe, hash] = await Promise.all([checkFileContent(file), getFileHash(file)]);
  const result = { safe, hash };
  fileScanCache.set(file, result);
  return result;
};

// ----------------------------------------------------------------------

const optionalStringValidation = z
  .string()
  .trim()
  .max(3000, { message: 'Cannot exceed 3000 characters' })
  .optional()
  .or(z.literal(''));

const createDocumentsValidation = z
  .array(z.instanceof(File))
  .optional()
  .default([])
  .refine(
    (files) => files.every((file) => acceptedFileTypes.includes(file.type)),
    { message: INVALID_TYPE_MESSAGE }
  )
  .refine(
    (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
    { message: `File size must not exceed ${MAX_FILE_SIZE_MB} MB` }
  )
  .refine(
    async (files) => {
      const results = await Promise.all(
        files.map(async (file) => (await scanFile(file)).safe)
      );
      return results.every(Boolean);
    },
    { message: 'File contains unsafe content' }
  );

const existingOrNewDocumentArray = z
  .array(z.union([z.instanceof(File), z.object({}).passthrough()]))
  .optional()
  .default([])
  .refine(
    (files) =>
      files.every((file) => {
        if (!(file instanceof File)) return true; // Skip checks for existing documents
        return acceptedFileTypes.includes(file.type);
      }),
    { message: INVALID_TYPE_MESSAGE }
  )
  .refine(
    (files) =>
      files.every((file) => {
        if (!(file instanceof File)) return true;
        return file.size <= MAX_FILE_SIZE;
      }),
    { message: `File size must not exceed ${MAX_FILE_SIZE_MB} MB` }
  )
  .refine(
    async (files) => {
      const results = await Promise.all(
        files.map(async (file) => {
          if (!(file instanceof File)) return true;
          return (await scanFile(file)).safe;
        })
      );
      return results.every(Boolean);
    },
    { message: 'File contains unsafe content' }
  );

// ----------------------------------------------------------------------

export const PriorArtCreateSchema = z.object({
  Title: z
    .string()
    .trim()
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(200, { message: 'Title cannot exceed 200 characters' }),
  ProblemStatement: z
    .string()
    .trim()
    .min(20, { message: 'Problem statement must be at least 20 characters' })
    .max(3000, { message: 'Problem Statement cannot exceed 3000 characters' }),
  Solution: z
    .string()
    .trim()
    .min(20, { message: 'Solution must be at least 20 characters' })
    .max(3000, { message: 'Solution cannot exceed 3000 characters' }),
  InventionDescription: z
    .string()
    .trim()
    .min(20, { message: 'Invention description must be at least 20 characters' })
    .max(3000, { message: 'Invention Description cannot exceed 3000 characters' }),
  Novelty: z
    .string()
    .trim()
    .min(10, { message: 'Novelty is required' })
    .max(3000, { message: 'Novelty cannot exceed 3000 characters' }),
  ApparatusDescription: optionalStringValidation,
  KeyComponents: optionalStringValidation,
  TechnicalAdvantages: optionalStringValidation,
  PriorDisclosureHistory: optionalStringValidation,
  RelatedPublications: optionalStringValidation,
  Documents: createDocumentsValidation,
});

export const PriorArtUpdateSchema = z.object({
  Id: z.string().min(1, { message: 'Application Id is required for updates' }),
  Title: z
    .string()
    .trim()
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(200, { message: 'Title cannot exceed 200 characters' }),
  ProblemStatement: z
    .string()
    .trim()
    .min(20, { message: 'Problem statement must be at least 20 characters' })
    .max(3000, { message: 'Problem Statement cannot exceed 3000 characters' }),
  Solution: z
    .string()
    .trim()
    .min(20, { message: 'Solution must be at least 20 characters' })
    .max(3000, { message: 'Solution cannot exceed 3000 characters' }),
  InventionDescription: z
    .string()
    .trim()
    .min(20, { message: 'Invention description must be at least 20 characters' })
    .max(3000, { message: 'Invention Description cannot exceed 3000 characters' }),
  Novelty: z
    .string()
    .trim()
    .min(10, { message: 'Novelty is required' })
    .max(3000, { message: 'Novelty cannot exceed 3000 characters' }),
  ApparatusDescription: optionalStringValidation,
  KeyComponents: optionalStringValidation,
  TechnicalAdvantages: optionalStringValidation,
  PriorDisclosureHistory: optionalStringValidation,
  RelatedPublications: optionalStringValidation,
  Documents: existingOrNewDocumentArray,
});

const DraftRequiredSchema = z.object({
  Title: z
    .string()
    .trim()
    .min(3, { message: 'Title is required to save a draft' })
    .max(200, { message: 'Title cannot exceed 200 characters' }),
});

// ----------------------------------------------------------------------

export function PriorArtCreateEditForm({ currentPriorArt }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);
  const confirmSubmit = useBoolean();

  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [fileErrors, setFileErrors] = useState({});

  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const [documentReplacements, setDocumentReplacements] = useState([]);

  const defaultValues = {
    Id: '',
    Title: '',
    ProblemStatement: '',
    Solution: '',
    InventionDescription: '',
    Novelty: '',
    ApparatusDescription: '',
    KeyComponents: '',
    TechnicalAdvantages: '',
    PriorDisclosureHistory: '',
    RelatedPublications: '',
    Documents: [],
  };

  const schema = currentPriorArt ? PriorArtUpdateSchema : PriorArtCreateSchema;

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();
  const documentsValue = watch('Documents');

  const UPLOAD_FILE_FIELDS = ['Documents'];
  const FIELD_LABELS = {
    Documents: 'Invention Documents',
  };

  // ----------------------------------------------------------------------
  // Hydrate form values with exact PascalCase mappings matching backend DTO

  useEffect(() => {
    if (!currentPriorArt) {
      setDeletedDocumentIds([]);
      setDocumentReplacements([]);
      setIsHydrated(true);
      return;
    }

    setIsHydrated(false);

    const rawDocs = currentPriorArt.documents || currentPriorArt.Documents || [];

    const mappedDocs = rawDocs.map((doc) => {
      const fileName =
        doc.originalFileName ||
        doc.OriginalFileName ||
        doc.name ||
        doc.Name ||
        '';

      const fileSize =
        doc.fileSize ??
        doc.FileSize ??
        doc.size ??
        doc.Size ??
        0;

      const contentType =
        doc.contentType ||
        doc.ContentType ||
        '';

      const getMimeTypeFromName = (name = '') => {
        const ext = name.split('.').pop()?.toLowerCase();

        switch (ext) {
          case 'pdf':
            return 'application/pdf';
          case 'doc':
            return 'application/msword';
          case 'docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg';
          case 'png':
            return 'image/png';
          default:
            return 'application/octet-stream';
        }
      };

      const fileType = contentType || getMimeTypeFromName(fileName);

      const applicationDocumentId =
        doc.applicationDocumentId ||
        doc.ApplicationDocumentId ||
        doc.id ||
        doc.Id;

      return {
        isExisting: true,
        applicationDocumentId,
        name: fileName,
        size: fileSize,
        type: fileType,
        originalFileName: fileName,
        fileSize,
        contentType: fileType,
        uploadedAt: doc.uploadedAt || doc.UploadedAt,

        ...doc,
      };
    });

    reset({
      ...defaultValues,
      Id: currentPriorArt.id ?? currentPriorArt.Id ?? currentPriorArt.applicationId ?? currentPriorArt.ApplicationId ?? '',
      Title: currentPriorArt.title ?? currentPriorArt.Title ?? '',
      ProblemStatement: currentPriorArt.problemStatement ?? currentPriorArt.ProblemStatement ?? '',
      Solution: currentPriorArt.solution ?? currentPriorArt.Solution ?? '',
      InventionDescription:
        currentPriorArt.inventionDescription ?? currentPriorArt.InventionDescription ?? '',
      Novelty: currentPriorArt.novelty ?? currentPriorArt.Novelty ?? '',
      ApparatusDescription:
        currentPriorArt.apparatusDescription ?? currentPriorArt.ApparatusDescription ?? '',
      KeyComponents: currentPriorArt.keyComponents ?? currentPriorArt.KeyComponents ?? '',
      TechnicalAdvantages:
        currentPriorArt.technicalAdvantages ?? currentPriorArt.TechnicalAdvantages ?? '',
      PriorDisclosureHistory:
        currentPriorArt.priorDisclosureHistory ?? currentPriorArt.PriorDisclosureHistory ?? '',
      RelatedPublications:
        currentPriorArt.relatedPublications ?? currentPriorArt.RelatedPublications ?? '',
      Documents: mappedDocs,
    });

    setDeletedDocumentIds([]);
    setDocumentReplacements([]);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPriorArt, reset]);

  // ----------------------------------------------------------------------

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ----------------------------------------------------------------------
  // Safe scan file warning execution for new unstructured additions

  useEffect(() => {
    const snapshot = documentsValue || [];
    const unscannedFiles = snapshot.filter((item) => item instanceof File && !fileScanCache.has(item));
    if (unscannedFiles.length === 0) return;

    unscannedFiles.forEach(async (file) => {
      const { safe } = await scanFile(file);
      if (!safe) {
        toast.error(`${file.name} contains unsafe content and will be rejected upon submission.`);
      }
    });
  }, [documentsValue]);

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!isHydrated || searchParams.get('finalSubmit') !== 'true') {
      return;
    }
    handleSubmit(() => { }, onError)();
  }, [isHydrated, searchParams, handleSubmit]);

  // ----------------------------------------------------------------------

  const buildUpdateFormData = useCallback(
    (payload) => {
      const formData = new FormData();

      formData.append('Id', String(payload.Id ?? ''));
      formData.append('Title', String(payload.Title ?? ''));
      formData.append('ProblemStatement', String(payload.ProblemStatement ?? ''));
      formData.append('Solution', String(payload.Solution ?? ''));
      formData.append(
        'InventionDescription',
        String(payload.InventionDescription ?? '')
      );
      formData.append('Novelty', String(payload.Novelty ?? ''));

      formData.append(
        'ApparatusDescription',
        String(payload.ApparatusDescription ?? '')
      );
      formData.append(
        'KeyComponents',
        String(payload.KeyComponents ?? '')
      );
      formData.append(
        'TechnicalAdvantages',
        String(payload.TechnicalAdvantages ?? '')
      );
      formData.append(
        'PriorDisclosureHistory',
        String(payload.PriorDisclosureHistory ?? '')
      );
      formData.append(
        'RelatedPublications',
        String(payload.RelatedPublications ?? '')
      );

      // New documents
      (payload.Documents ?? []).forEach((document) => {
        if (document instanceof File) {
          formData.append('Documents', document, document.name);
        }
      });

      // Deleted documents
      deletedDocumentIds.forEach((documentId) => {
        formData.append('DocumentsToDelete', String(documentId));
      });

      // Replacements
      documentReplacements.forEach((replacement, index) => {
        formData.append(
          `DocumentsToReplace[${index}].ApplicationDocumentId`,
          String(replacement.applicationDocumentId)
        );

        formData.append(
          `DocumentsToReplace[${index}].File`,
          replacement.file,
          replacement.file.name
        );
      });

      return formData;
    },
    [deletedDocumentIds, documentReplacements]
  );

  // ----------------------------------------------------------------------

  const showResultError = (result) => {
    const errorMessage =
      result?.errors?.length > 0 ? result.errors : [result?.message || 'Action failed'];

    toast.error(
      <div style={{ width: '100%' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>Upload failed</div>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {errorMessage.map((error, index) => (
            <li key={index} style={{ marginBottom: '6px', lineHeight: 1.5, wordBreak: 'break-word' }}>
              {error}
            </li>
          ))}
        </ul>
      </div>,
      {
        autoClose: 50000,
        closeOnClick: true,
        pauseOnHover: true,
        style: { width: '550px', maxWidth: 'calc(100vw - 40px)' },
      }
    );
  };

  // ----------------------------------------------------------------------

  const onSubmit = useCallback(
    async (payload, isDraft) => {
      setIsSaving(true);
      setLoadingMsg(isDraft ? 'Saving draft...' : 'Submitting application...');

      try {
        let result;

        if (currentPriorArt) {
          const formData = buildUpdateFormData(payload);
          result = await updatePriorArtDetails(payload.Id, formData);

          if (!result?.success) {
            showResultError(result);
            return;
          }

          let finalResult = result;
          if (!isDraft) {
            finalResult = await submitPriorArt(payload.Id);
          }

          if (finalResult?.success) {
            toast.success(
              finalResult.message ||
              (isDraft ? 'Draft saved successfully!' : 'Application submitted successfully!')
            );
            reset(payload);
            setDeletedDocumentIds([]);
            setDocumentReplacements([]);
            router.push(paths.dashboard.priorArtSearch.root);
          } else {
            showResultError(finalResult);
          }
          return;
        }

        const userId = user?.id;
        if (!userId) {
          toast.error('Unable to determine the current user. Please sign in again.');
          return;
        }

        // Destructure Id out to ensure Create doesn't pass an empty string if it fails contract mapping
        const { Id, ...createPayload } = payload;

        result = await createAndSubmitPriorArt(
          createPayload,
          isDraft,
          (msg) => setLoadingMsg(msg),
          userId
        );

        if (result?.success) {
          reset({
            ...payload,
            Documents: payload.Documents || [],
          });
          setDeletedDocumentIds([]);
          setDocumentReplacements([]);

          toast.success(
            result.message ||
            (isDraft ? 'Draft saved successfully!' : 'Application submitted successfully!')
          );

          router.push(paths.dashboard.priorArtSearch.root);
        } else {
          showResultError(result);

          if (!currentPriorArt && result?.applicationId) {
            router.push(
              `${paths.dashboard.priorArtSearch.edit(result.applicationId)}?finalSubmit=true`
            );
          }
        }
      } catch (error) {
        console.error('Submission Error:', error);
        toast.error('An unexpected error occurred.');
      } finally {
        setIsSaving(false);
        setLoadingMsg('');
        setIsDraftAction(false);
      }
    },
    [currentPriorArt, user, buildUpdateFormData, reset, router]
  );

  // ----------------------------------------------------------------------

  const handleSaveDraft = useCallback(async () => {
    if (isSaving || isSubmitting) return;

    clearErrors(['Title', 'ProblemStatement', 'Solution', 'InventionDescription', 'Novelty']);
    const draftValidation = DraftRequiredSchema.safeParse(getValues());

    if (!draftValidation.success) {
      draftValidation.error.issues.forEach((issue) => {
        setError(issue.path[0], { type: 'manual', message: issue.message });
      });
      toast.error(
        draftValidation.error.issues[0]?.message || 'Please enter a title to save a draft.'
      );
      return;
    }

    setIsDraftAction(true);
    await onSubmit(getValues(), true);
  }, [isSaving, isSubmitting, clearErrors, getValues, setError, onSubmit]);

  const onError = (formErrors) => {
    const firstErrorKey = Object.keys(formErrors)[0];
    const firstErrorMessage = formErrors[firstErrorKey]?.message;
    toast.error(firstErrorMessage || 'Please check the required details.');
  };

  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    handleSubmit((payload) => onSubmit(payload, false), onError)();
  };

  // ----------------------------------------------------------------------
  // File Duplicate checking util for strict matching

  const isDuplicateFile = useCallback(
    (newFile) => {
      const currentDocs = getValues('Documents') || [];

      const inCurrentDocs = currentDocs.some((doc) => {
        if (doc instanceof File) {
          return doc.name === newFile.name && doc.size === newFile.size;
        }
        if (doc.isExisting) {
          const matchName = doc.originalFileName === newFile.name || doc.name === newFile.name;
          return matchName && doc.size === newFile.size;
        }
        return false;
      });

      const inReplacements = documentReplacements.some(
        (rep) => rep.file.name === newFile.name && rep.file.size === newFile.size
      );

      return inCurrentDocs || inReplacements;
    },
    [getValues, documentReplacements]
  );

  // ----------------------------------------------------------------------

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      setFileErrors((prev) => ({ ...prev, Documents: null }));

      for (const file of acceptedFiles) {
        await handleFileUpload({
          file,
          fieldName: 'Documents',
          getValues,
          setValue: (fieldName, newFile, options) => {
            const currentDocs = getValues('Documents') || [];
            setValue('Documents', [...currentDocs, newFile], options);
          },
          clearErrors,
          setFileErrors,
          uploadFields: UPLOAD_FILE_FIELDS,
          fieldLabels: FIELD_LABELS,
          existingDocuments: {},
          setDeletedDocumentIds,
        });
      }
    },
    [getValues, setValue, clearErrors, setFileErrors, setDeletedDocumentIds]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      setFileErrors((prev) => ({ ...prev, Documents: null }));

      const currentDocs = getValues('Documents') || [];

      if (inputFile && !(inputFile instanceof File) && inputFile.isExisting) {
        const documentId =
          inputFile.applicationDocumentId ||
          inputFile.ApplicationDocumentId ||
          inputFile.id ||
          inputFile.Id;

        if (documentId) {
          setDeletedDocumentIds((previous) =>
            previous.includes(documentId) ? previous : [...previous, documentId]
          );

          setDocumentReplacements((previous) =>
            previous.filter((replacement) => replacement.applicationDocumentId !== documentId)
          );

          const filtered = currentDocs.filter((doc) => {
            if (!doc || doc instanceof File) return true;
            const docId =
              doc.applicationDocumentId ||
              doc.ApplicationDocumentId ||
              doc.id ||
              doc.Id;
            return docId !== documentId;
          });

          setValue('Documents', filtered, { shouldValidate: true, shouldDirty: true });
          return;
        }
      }

      const filtered = currentDocs.filter((file) => file !== inputFile);
      setValue('Documents', filtered, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleRemoveAllFiles = useCallback(() => {
    const currentDocs = getValues('Documents') || [];

    const existingIds = currentDocs
      .filter((document) => document && !(document instanceof File) && document.isExisting)
      .map(
        (document) =>
          document.applicationDocumentId ||
          document.ApplicationDocumentId ||
          document.id ||
          document.Id
      )
      .filter(Boolean);

    if (existingIds.length > 0) {
      setDeletedDocumentIds((previous) => [...new Set([...previous, ...existingIds])]);
    }

    setDocumentReplacements([]);
    setValue('Documents', [], { shouldDirty: true, shouldValidate: true });
  }, [getValues, setValue]);

  // ----------------------------------------------------------------------

  const handleReplaceDocument = async (document, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!acceptedFileTypes.includes(file.type)) {
      toast.error(INVALID_TYPE_MESSAGE);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size must not exceed ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    const applicationDocumentId =
      document.applicationDocumentId || document.ApplicationDocumentId || document.id || document.Id;

    if (!applicationDocumentId) {
      toast.error('Unable to identify the document to replace.');
      return;
    }

    const currentDocs = getValues('Documents') || [];

    const isDuplicate = currentDocs.some((doc) => {
      if (doc instanceof File) return doc.name === file.name && doc.size === file.size;
      if (doc.isExisting && doc.applicationDocumentId !== applicationDocumentId) {
        return (doc.originalFileName === file.name || doc.name === file.name) && doc.size === file.size;
      }
      return false;
    });

    const isDuplicateInReplacements = documentReplacements.some(
      (rep) => rep.applicationDocumentId !== applicationDocumentId && rep.file.name === file.name && rep.file.size === file.size
    );

    if (isDuplicate || isDuplicateInReplacements) {
      toast.error(`"${file.name}" has already been added.`);
      return;
    }

    setDocumentReplacements((previous) => {
      const existingIndex = previous.findIndex(
        (replacement) => replacement.applicationDocumentId === applicationDocumentId
      );
      const replacement = { applicationDocumentId, file };

      if (existingIndex === -1) {
        return [...previous, replacement];
      }
      const updated = [...previous];
      updated[existingIndex] = replacement;
      return updated;
    });

    setDeletedDocumentIds((previous) => previous.filter((id) => id !== applicationDocumentId));

    const updatedDocs = currentDocs.map((existingDoc) => {
      const existingId =
        existingDoc?.applicationDocumentId ||
        existingDoc?.ApplicationDocumentId ||
        existingDoc?.id ||
        existingDoc?.Id;
      if (existingId !== applicationDocumentId) return existingDoc;
      return { ...existingDoc, name: file.name, size: file.size, replacementFile: file, isReplaced: true };
    });

    setValue('Documents', updatedDocs, { shouldDirty: true, shouldValidate: true });
    toast.success(`"${file.name}" selected as replacement.`);
  };

  // ----------------------------------------------------------------------

  const handleAddDocumentsToDraft = useCallback(
    (inputFiles) => {
      const files = Array.from(inputFiles || []);
      if (files.length === 0) return;

      const currentDocs = getValues('Documents') || [];
      const validFiles = [];

      files.forEach((file) => {
        if (!acceptedFileTypes.includes(file.type)) {
          toast.error(`${file.name}: invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG are allowed.`);
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name}: file size must not exceed ${MAX_FILE_SIZE_MB} MB.`);
          return;
        }

        if (isDuplicateFile(file)) {
          toast.error(`"${file.name}" has already been added.`);
        } else {
          validFiles.push(file);
        }
      });

      if (validFiles.length > 0) {
        setValue('Documents', [...currentDocs, ...validFiles], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [getValues, setValue, isDuplicateFile]
  );

  // ----------------------------------------------------------------------

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const RenderRequiredDocumnets = () => (
    <DownloadCard
      title="Supporting Documents"
      description="Invention disclosure form for reference"
      items={['Invention disclosure form']}
      downloadUrl="/templates/Prior-Art-Invention-Disclosure-Form.zip"
      fileName="Prior_art_Documents.zip"
    />
  );

  const renderLoadingOverlay = () => (
    <Backdrop
      open={isSubmitting || isSaving}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(2px)',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <CircularProgress color="inherit" sx={{ mb: 2 }} />
      <Typography variant="h6">
        {loadingMsg || (isDraftAction ? 'Saving Draft...' : 'Submitting Application...')}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Please wait, do not refresh the page.
      </Typography>
    </Backdrop>
  );

  const renderCharacterCount = (name, maxLength = 3000) => {
    const value = values?.[name] || '';
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -2 }}>
        <Typography variant="caption" color="text.secondary">
          {value.length} / {maxLength}
        </Typography>
      </Box>
    );
  };

  // ----------------------------------------------------------------------

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Invention Details"
        subheader="Core information about the invention"
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="Title" label="Title of Invention" required />

          <Field.Text name="ProblemStatement" label="Problem Statement" multiline rows={4} required />
          {renderCharacterCount('ProblemStatement')}

          <Field.Text name="Solution" label="Proposed Solution" multiline rows={4} required />
          {renderCharacterCount('Solution')}

          <Field.Text name="InventionDescription" label="Detailed Invention Description" multiline rows={4} required />
          {renderCharacterCount('InventionDescription')}

          <Field.Text name="Novelty" label="Novelty" multiline rows={4} required />
          {renderCharacterCount('Novelty')}
        </Stack>
      </Collapse>
    </Card>
  );

  // ----------------------------------------------------------------------

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Technical Information"
        subheader="Additional technical details"
        action={renderCollapseButton(openProperties.value, openProperties.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openProperties.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="ApparatusDescription" label="Apparatus Description" multiline rows={4} />
          {renderCharacterCount('ApparatusDescription')}

          <Field.Text name="KeyComponents" label="Key Components" multiline rows={4} />
          {renderCharacterCount('KeyComponents')}

          <Field.Text name="TechnicalAdvantages" label="Technical Advantages" multiline rows={4} />
          {renderCharacterCount('TechnicalAdvantages')}

          <Field.Text name="PriorDisclosureHistory" label="Prior Disclosure History" multiline rows={4} />
          {renderCharacterCount('PriorDisclosureHistory')}

          <Field.Text name="RelatedPublications" label="Related Publications" multiline rows={4} />
          {renderCharacterCount('RelatedPublications')}

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Upload Document</Typography>

            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, DOC, DOCX, JPEG, JPG and PNG. Maximum size: {MAX_FILE_SIZE_MB} MB.
            </Typography>

            {!!fileErrors.Documents && (
              <Typography variant="caption" color="error" sx={{ fontWeight: 'bold', display: 'block' }}>
                {fileErrors.Documents}
              </Typography>
            )}

            <Field.Upload
              name="Documents"
              multiple
              maxFiles={10}
              maxSize={MAX_FILE_SIZE}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'image/*': ['.jpeg', '.jpg', '.png'],
              }}
            />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  // ----------------------------------------------------------------------

  const renderActions = () => (
    <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <LoadingButton
        type="button"
        variant="soft"
        color="primary"
        size="small"
        loading={isSaving && isDraftAction}
        disabled={isSaving || isSubmitting}
        onClick={handleSaveDraft}
      >
        {currentPriorArt ? 'Save Changes' : 'Save as Draft'}
      </LoadingButton>

      <LoadingButton
        type="button"
        variant="soft"
        color="warning"
        size="small"
        loading={(isSaving || isSubmitting) && !isDraftAction}
        disabled={isSaving || isSubmitting}
        onClick={confirmSubmit.onTrue}
      >
        Submit Application
      </LoadingButton>
    </Box>
  );

  // ----------------------------------------------------------------------

  const renderSubmitDialog = () => (
    <ConfirmDialog
      open={confirmSubmit.value}
      onClose={confirmSubmit.onFalse}
      title="Submit Application"
      content={
        <>
          Are you sure you want to submit this application?
          <br />
          <strong>Once submitted, you will no longer be able to edit or delete this record.</strong>
        </>
      }
      action={
        <Button variant="contained" color="primary" onClick={handleConfirmAndRun}>
          Confirm & Submit
        </Button>
      }
    />
  );

  // ----------------------------------------------------------------------

  return (
    <Form methods={methods} onSubmit={(event) => event.preventDefault()}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderLoadingOverlay()}
        {RenderRequiredDocumnets()}
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
        {renderSubmitDialog()}
      </Stack>
    </Form>
  );
}
