import React from 'react';

export function Button({
    children,
    className = '',
    variant = 'default',
    onClick,
    disabled = false,
    type = 'button'
}) {
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        default: 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200',
        outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300',
        ghost: 'text-gray-600 hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
        >
            {children}
        </button>
    );
}
