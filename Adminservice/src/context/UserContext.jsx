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
// Using uppercase ACTIVE / BLOCKED as per requirement
const INITIAL_USERS = [
    { id: 'USR-2024-001', name: 'John Doe', email: 'john@example.com', status: 'ACTIVE', joinDate: '2024-01-15' },
    { id: 'USR-2024-002', name: 'Jane Smith', email: 'jane@example.com', status: 'ACTIVE', joinDate: '2024-02-01' },
    { id: 'USR-2024-003', name: 'Mike Johnson', email: 'mike@example.com', status: 'BLOCKED', joinDate: '2024-02-10' },
    { id: 'USR-2024-004', name: 'David Brown', email: 'david@example.com', status: 'ACTIVE', joinDate: '2024-03-20' },
    { id: 'USR-2024-005', name: 'Evelyn Garcia', email: 'evelyn@example.com', status: 'ACTIVE', joinDate: '2024-04-05' },
    { id: 'USR-2024-006', name: 'Sarah Miller', email: 'sarah.m@world.com', status: 'BLOCKED', joinDate: '2024-04-12' },
];

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API latency
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

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
