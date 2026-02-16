import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 'notif-1',
            type: 'VENDOR_REGISTRATION',
            vendorId: 'VND-2024-999',
            vendorName: 'Mumbai Gadget Mart',
            vendorEmail: 'sales@mumbaigadgets.com',
            registrationDate: '2024-02-09',
            status: 'Pending Approval',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
            id: 'notif-2',
            type: 'VENDOR_REGISTRATION',
            vendorId: 'VND-2024-888',
            vendorName: 'Jaipur Organic Hub',
            vendorEmail: 'hello@jaipurorganics.in',
            registrationDate: '2024-02-08',
            status: 'Pending Approval',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
            id: 'notif-swift',
            type: 'VENDOR_REGISTRATION',
            vendorId: 'VND-2024-SWIFT',
            vendorName: 'IndoFlash Logistics',
            vendorEmail: 'shipping@indoflash.co.in',
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'Pending Approval',
            read: false,
            timestamp: new Date().toISOString(),
        }
    ]);

   

    const addNotification = React.useCallback((notif) => {
        setNotifications(prev => [{
            id: `notif-${Date.now()}`,
            read: false,
            timestamp: new Date().toISOString(),
            ...notif
        }, ...prev]);
    }, []);

    const markAsRead = React.useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = React.useCallback(() => {
        setNotifications([]);
    }, []);

    const removeNotification = React.useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const handleVendorAction = React.useCallback((notifId, status) => {
        setNotifications(prev => prev.map(n => {
            if (n.id === notifId) {
                return {
                    ...n,
                    read: true,
                    status: status,
                    actionTaken: true
                };
            }
            return n;
        }));
    }, []);

    const value = React.useMemo(() => ({
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        handleVendorAction
    }), [notifications, addNotification, markAsRead, markAllAsRead, removeNotification, handleVendorAction]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
