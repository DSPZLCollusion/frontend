import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = {
    label: string;
    id: string;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
    label,
    id,
    error,
    className,
    required,
    ...props
}: InputProps) {
    return (
        <div className={`${styles.field}${error ? ` ${styles.fieldError}` : ""}`}>
            <label htmlFor={id} className={styles.label}>
                {label}
                {required && (
                    <span className={styles.required} aria-hidden="true"> *</span>
                )}
            </label>
            <input
                id={id}
                name={id}
                required={required}
                className={`${styles.input}${className ? ` ${className}` : ""}`}
                {...props}
            />
            {error && (
                <span className={styles.errorText} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}