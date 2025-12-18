import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        // Base styles mapping
        const variants = {
            primary: 'btn-primary',
            outline: 'btn-outline',
            ghost: 'btn-ghost' // We might need to add this to git globals or just leave as is
        };



        // Improved style composition: reusing existing globals.css classes
        // Note: In a real app we might move fully to CSS modules or Tailwind here.
        // Given we are using Vanilla CSS with global classes:
        const variantClass = variants[variant];
        const sizeStyle = size === 'sm' ? { fontSize: '0.9rem', padding: '0.4rem 0.8rem' } :
            size === 'lg' ? { fontSize: '1.1rem', padding: '1rem 2rem' } : {};

        return (
            <button
                ref={ref}
                className={`btn ${variantClass} ${className}`}
                disabled={isLoading || props.disabled}
                style={{ ...sizeStyle, ...props.style }}
                {...props}
            >
                {isLoading ? 'Loading...' : children}
            </button>
        );
    }
);

Button.displayName = 'Button';
