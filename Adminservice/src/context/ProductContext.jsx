import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect
} from 'react';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchAllProducts();

                // Ensure data is an array
                if (!Array.isArray(data)) {
                    throw new Error('Invalid product data format');
                }

                const mappedProducts = data.map(product => ({
                    id: product.id,
                    name: product.name,
                    vendor: product.vendor_name || 'Unknown Vendor',
                    price: Number(product.price) || 0,
                    stock: product.quantity ?? 0,
                    status: product.is_blocked ? 'Blocked' : 'Active',
                    description: product.description || '',
                    category: product.category || '',
                    images: product.images || []
                }));

                setProducts(mappedProducts);
            } catch (err) {
                console.error('Failed to fetch products:', err);

                // Axios specific error handling
                if (err.response) {
                    setError(err.response.data?.message || 'Server Error');
                } else if (err.request) {
                    setError('No response from server');
                } else {
                    setError(err.message || 'Something went wrong');
                }

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const updateProductStatus = useCallback((productId, newStatus) => {
        setProducts(prev =>
            prev.map(p =>
                p.id === productId ? { ...p, status: newStatus } : p
            )
        );
    }, []);

    const value = useMemo(() => ({
        products,
        loading,
        error,
        updateProductStatus
    }), [products, loading, error, updateProductStatus]);

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
