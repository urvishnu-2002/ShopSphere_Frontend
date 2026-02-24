/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { fetchAllProducts } from '../api/axios';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Server-side pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const loadProducts = useCallback(async ({ page = 1, search = '', status = '' } = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchAllProducts({ page, search, status });
            // Envelope: { count, num_pages, current_page, results }
            const results = data?.results ?? (Array.isArray(data) ? data : []);
            setProducts(results);
            setCurrentPage(data?.current_page ?? page);
            setTotalPages(data?.num_pages ?? 1);
            setTotalCount(data?.count ?? results.length);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError(err?.response?.status === 401
                ? 'Not authorised. Please log in as an admin.'
                : 'Failed to load products.');
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadProducts({ page: 1, search: '' });
    }, [loadProducts]);

    // Go to a specific page (keeps current search + status)
    const goToPage = useCallback((page) => {
        loadProducts({ page, search: searchQuery, status: statusFilter });
    }, [loadProducts, searchQuery, statusFilter]);

    // Run a new search from page 1 (optionally filter by status)
    const doSearch = useCallback((query, status) => {
        const newSearch = query ?? searchQuery;
        const newStatus = status !== undefined ? status : statusFilter;
        setSearchQuery(newSearch);
        setStatusFilter(newStatus);
        loadProducts({ page: 1, search: newSearch, status: newStatus });
    }, [loadProducts, searchQuery, statusFilter]);

    const updateProductStatus = useCallback((productId, newStatus) => {
        // Optimistic update
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, status: newStatus } : p
        ));
    }, []);

    const value = useMemo(() => ({
        products,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalCount,
        searchQuery,
        statusFilter,
        goToPage,
        doSearch,
        updateProductStatus,
        refreshProducts: () => loadProducts({ page: currentPage, search: searchQuery, status: statusFilter }),
    }), [products, isLoading, error, currentPage, totalPages, totalCount, searchQuery, statusFilter, goToPage, doSearch, updateProductStatus, loadProducts]);

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
