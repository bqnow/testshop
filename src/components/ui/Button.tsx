import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        // Mapping der Basis-Styles
        const variants = {
            primary: 'btn-primary',
            outline: 'btn-outline',
            ghost: 'btn-ghost' // Eventuell später zu globals.css hinzufügen
        };



        // Optimierte Style-Zusammensetzung: Verwendet existierende globals.css Klassen
        // Hinweis: In einer echten App würde man hier ggf. CSS Modules oder Tailwind nutzen.
        // Für dieses Projekt nutzen wir Vanilla CSS mit globalen Klassen:
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
