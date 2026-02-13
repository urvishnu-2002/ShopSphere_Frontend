<<<<<<< HEAD
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
=======
import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
    placeholder = "Search...",
    value,
    onChange,
    className = "",
    onClear
}) => {
    return (
        <div className={`relative group ${className}`}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <Search className="w-4 h-4" />
            </span>
>>>>>>> management
            <input
                type="text"
                placeholder={placeholder}
                value={value}
<<<<<<< HEAD
                onChange={onChange}
                className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm shadow-sm"
            />
=======
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-700"
            />
            {value && onClear && (
                <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
>>>>>>> management
        </div>
    );
};

export default SearchBar;
