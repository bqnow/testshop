import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, ...props }, ref) => {
        return (
            <div style={{ marginBottom: '1rem' }}>
                {label && (
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`input ${className}`}
                    style={error ? { borderColor: 'var(--error)', ...props.style } : props.style}
                    {...props}
                />
                {error && (
                    <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
