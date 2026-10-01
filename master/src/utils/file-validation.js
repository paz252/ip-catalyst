/**
/**
 * Utility for secure file validation with categorical enforcement.
 */
export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 5MB

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
export const validateFileUpload =  (file, category = FILE_CATEGORIES.ALL) => {
    if (!file) return 'No file provided';

    const { name, type, size } = file;

    // A. Check File Size
    if (size > MAX_FILE_SIZE) {
        return 'File size exceeds the 1MB limit.';
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

export async function checkFileContent(file, maxBytesToRead = 100000) {
    const forbiddenStrings = ["/JS", "/JavaScript"];

    try {
        // Read only part of the file (for performance)
        const blob = file.slice(0, maxBytesToRead);
        const text = await blob.text();

        // Check for forbidden content
        for (const str of forbiddenStrings) {
            if (text.includes(str)) {
                return false;
            }
        }

        return true;
    } catch (err) {
        // In case file reading fails, treat as unsafe
        return false;
    }
}