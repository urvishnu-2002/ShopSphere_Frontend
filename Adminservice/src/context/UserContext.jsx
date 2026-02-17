import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const UserContext = createContext();

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};

// --- Initial Master Data ---
const INITIAL_USERS = [];

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [isLoading, setIsLoading] = useState(false);

    const updateUserStatus = useCallback(async (userId, newStatus) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ));
        return true;
    }, []);

    const value = useMemo(() => ({
        users,
        isLoading,
        updateUserStatus
    }), [users, isLoading, updateUserStatus]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
