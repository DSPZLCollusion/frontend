import { upload } from '@vercel/blob/client';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

/** Returns a user-facing message if the file is unusable, otherwise null. */
export function validateImage(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return 'Use a JPG, PNG, or WEBP image.';
    }
    if (file.size > MAX_IMAGE_BYTES) {
        return 'Image must be 4 MB or smaller.';
    }
    return null;
}

/**
 * Uploads straight from the browser to Vercel Blob using a short-lived token
 * from the backend. The read/write token and JWT secret never reach the client
 * — both live only in controllers/photo.ts, which is what actually mints and
 * checks them.
 */
export async function uploadImage(file: File): Promise<string> {
    const problem = validateImage(file);
    if (problem) throw new Error(problem);

    // Generated name: user-supplied filenames can contain spaces, unicode, or PII.
    const pathname = `pnm-photos/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;

    const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: `${import.meta.env.VITE_BACKEND_URL}/photo/upload_image`,
        contentType: file.type,
        // Sent to onBeforeGenerateToken as its second argument, which checks it
        // there. We use clientPayload rather than a custom Authorization header
        // since it's the well-established pattern for this and doesn't depend
        // on which parts of the two-phase upload a given SDK version forwards
        // custom headers to.
        clientPayload: localStorage.getItem('auth-token') ?? '',
    });
    return blob.url;
}