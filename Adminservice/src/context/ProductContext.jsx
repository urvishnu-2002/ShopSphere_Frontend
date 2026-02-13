import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../constants/mockData';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(MOCK_PRODUCTS);

    const updateProductStatus = useCallback((productId, newStatus) => {
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, status: newStatus } : p
        ));
    }, []);

    const value = useMemo(() => ({
        products,
        updateProductStatus
    }), [products, updateProductStatus]);

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
