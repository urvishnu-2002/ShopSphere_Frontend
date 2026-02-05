import { CURRENCY } from './constants';

export const formatPrice = (price) => {
    return `${CURRENCY}${price.toFixed(2)}`;
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
