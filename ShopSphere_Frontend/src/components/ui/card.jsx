import React from 'react';

export function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`p-6 pb-3 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`font-semibold text-gray-800 text-lg ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`p-6 pt-0 ${className}`}>
            {children}
        </div>
    );
}

export function CardDescription({ children, className = '' }) {
    return (
        <p className={`text-sm text-gray-600 ${className}`}>
            {children}
        </p>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`p-6 pt-0 flex items-center gap-4 ${className}`}>
            {children}
        </div>
    );
}
