/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);



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
