import { useEffect, useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import styles from "./PhotoUpload.module.css";
import { ALLOWED_IMAGE_TYPES, validateImage } from "#/util/blob";

type PhotoUploadProps = {
    defaultUrl?: string;                       // existing URL when editing
    onChange: (file: File | null) => void;     // file = new photo, null = photo removed
};

export default function PhotoUpload({ defaultUrl, onChange }: PhotoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    // previewSrc is either an object URL (new file) or the existing URL
    const [previewSrc, setPreviewSrc] = useState<string | null>(defaultUrl ?? null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Track the object URL we created so we can revoke it on replace and on unmount.
    const objectUrlRef = useRef<string | null>(null);

    function revokeObjectUrl() {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
    }

    useEffect(() => revokeObjectUrl, []);

    function pick(file: File | null) {
        if (file) {
            const problem = validateImage(file);
            if (problem) {
                setError(problem);
                if (inputRef.current) inputRef.current.value = "";
                return;                        // keep whatever was selected before
            }
        }

        setError(null);
        revokeObjectUrl();

        if (file) {
            const url = URL.createObjectURL(file);
            objectUrlRef.current = url;
            setPreviewSrc(url);
        } else {
            setPreviewSrc(null);
        }
        onChange(file);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        pick(e.target.files?.[0] ?? null);
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        pick(e.dataTransfer.files?.[0] ?? null);
    }

    function handleRemove() {
        pick(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className={styles.wrapper}>
            <label className={styles.fieldLabel}>Photo</label>

            {previewSrc ? (
                <div className={styles.preview}>
                    <img src={previewSrc} alt="Preview" className={styles.previewImg} />
                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={handleRemove}
                        aria-label="Remove photo"
                    >
                        &times;
                    </button>
                </div>
            ) : (
                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ""}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                    aria-label="Upload photo"
                >
                    <span className={styles.dropzoneIcon} aria-hidden="true">↑</span>
                    <span className={styles.dropzoneText}>
                        Click or drag a photo here
                    </span>
                    <span className={styles.dropzoneHint}>JPG, PNG, WEBP — max 4 MB</span>
                </div>
            )}

            {error && (
                <span className={styles.errorText} role="alert">{error}</span>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                className={styles.hiddenInput}
                onChange={handleChange}
                aria-hidden="true"
                tabIndex={-1}
            />
        </div>
    );
}