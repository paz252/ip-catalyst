/**
/**
 * Utility for secure file validation with categorical enforcement.
 */
import { PDFName, PDFDict, PDFDocument, PDFString, PDFHexString, PDFStream } from 'pdf-lib';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const FILE_CATEGORIES = {
    PDF: 'pdf',
    IMAGE: 'image',
    ALL: 'all',
};

const ALLOWED_EXTENSIONS = {
    [FILE_CATEGORIES.PDF]: ['pdf'],
    [FILE_CATEGORIES.IMAGE]: ['jpg', 'jpeg', 'png'],
    [FILE_CATEGORIES.ALL]: ['pdf', 'jpg', 'jpeg', 'png'],
};

const ALLOWED_MIME_TYPES = {
    [FILE_CATEGORIES.PDF]: ['application/pdf'],
    [FILE_CATEGORIES.IMAGE]: ['image/jpeg', 'image/png'],
    [FILE_CATEGORIES.ALL]: ['application/pdf', 'image/jpeg', 'image/png'],
};

// 2. Validation Logic
export const validateFileUpload = (file, category = FILE_CATEGORIES.ALL) => {
    if (!file) return 'No file provided';

    const { name, type, size } = file;

    // A. Check File Size
    if (size > MAX_FILE_SIZE) {
        return 'File size exceeds the 5MB limit.';
    }

    // B. Security Check: Hidden files (e.g., .htaccess)
    const fileNameParts = name.split('.');
    if (fileNameParts[0] === '' || fileNameParts.length < 2) {
        return 'Invalid filename: Hidden or empty names are not allowed.';
    }

    // C. Security Check: Double extensions (e.g., .php.png)
    if (fileNameParts.length > 2) {
        return 'Security error: Multiple extensions detected.';
    }

    const extension = fileNameParts.pop().toLowerCase();
    const validExtensions = ALLOWED_EXTENSIONS[category];
    const validMimes = ALLOWED_MIME_TYPES[category];

    // D. Category-based Extension Check
    if (!validExtensions.includes(extension)) {
        return `For this application, only ${category.toUpperCase()} files are allowed. (.${extension} is invalid)`;
    }

    // E. Category-based MIME-type check
    if (!validMimes.includes(type)) {
        return 'Security error: File content does not match its extension.';
    }

    // F. CONTENT SCAN (NEW)
    // try {
    //     const isSafe = await checkFileContent(file);

    //     if (!isSafe) {
    //         return "Security error: File contains unsafe content.";
    //     }
    // } catch (err) {
    //     return "Error while scanning file content.";
    // }


    return null;
};

/**
 * Requirement: Rename files to prevent execution/guessing
 * Note: This is usually done on the backend, but this helper 
 * generates a safe name for frontend display or logging.
 */
export const createSafeFileName = (originalName) => {
    const extension = originalName.split('.').pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `file_${timestamp}_${randomStr}.${extension}`;
};

export async function checkFileContent(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
      updateable: false,
    });

    const context = pdfDoc.context;
    const catalog = pdfDoc.catalog;

    const OPEN_ACTION = PDFName.of('OpenAction');
    const S = PDFName.of('S');
    const JS = PDFName.of('JS');

    const isUnsafeAction = (obj) => {
      if (!(obj instanceof PDFDict)) {
        return false;
      }

      // Resolve indirect reference (PDFRef) for /S if needed
      const rawActionType = obj.get(S);
      const actionType = context.lookup(rawActionType);

      if (!(actionType instanceof PDFName)) {
        return false;
      }

      const type = actionType.asString();

      // -----------------------------------------------------
      // JavaScript Action (/S /JavaScript or /S /JS)
      // -----------------------------------------------------
      if (type === '/JavaScript' || type === '/JS') {
        const js = obj.get(JS);

        if (js === undefined) {
          // Action type is JavaScript even without a standalone /JS key
          return true;
        }

        const resolvedJs = context.lookup(js);

        if (
          resolvedJs instanceof PDFString ||
          resolvedJs instanceof PDFHexString ||
          resolvedJs instanceof PDFStream
        ) {
          return true;
        }

        return true;
      }

      // -----------------------------------------------------
      // Launch Action (/S /Launch)
      // -----------------------------------------------------
      if (type === '/Launch') {
        return true;
      }

      return false;
    };

    // ---------------------------------------------------------
    // 1. Catalog /OpenAction
    // ---------------------------------------------------------
    if (catalog.has(OPEN_ACTION)) {
      const openAction = catalog.get(OPEN_ACTION);
      const resolvedAction = context.lookup(openAction);

      if (isUnsafeAction(resolvedAction)) {
        return false;
      }
    }

    // ---------------------------------------------------------
    // 2. Scan indirect objects
    // ---------------------------------------------------------
    for (const [, pdfObj] of context.enumerateIndirectObjects()) {
      if (isUnsafeAction(pdfObj)) {
        return false;
      }
    }

    return true;
  } catch (err) {
    console.warn('PDF parsing warning during safety check:', err);
    return true;
  }
}