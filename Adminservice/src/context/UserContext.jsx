/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { fetchUsers, toggleUserBlock } from '../api/axios';

const UserContext = createContext();

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0 });

    const loadUsers = useCallback(async (filters = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchUsers(filters);
            setUsers(data.users ?? []);
            setStats({
                total: data.total ?? 0,
                active: data.active ?? 0,
                blocked: data.blocked ?? 0,
            });
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err?.response?.data?.detail || 'Failed to load users.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const updateUserStatus = useCallback(async (userId, newStatus, reason = '') => {
        const action = newStatus === 'BLOCKED' ? 'BLOCK' : 'UNBLOCK';
        try {
            await toggleUserBlock(userId, action, reason);
            // Optimistically update local state
            setUsers(prev =>
                prev.map(u => u.id === userId ? { ...u, status: newStatus } : u)
            );
            // Recalculate stats
            setStats(prev => ({
                ...prev,
                active: action === 'BLOCK' ? prev.active - 1 : prev.active + 1,
                blocked: action === 'BLOCK' ? prev.blocked + 1 : prev.blocked - 1,
            }));
            return true;
        } catch (err) {
            console.error('Failed to update user status:', err);
            return false;
        }
    }, []);

    const value = useMemo(() => ({
        users,
        isLoading,
        error,
        stats,
        updateUserStatus,
        reloadUsers: loadUsers,
    }), [users, isLoading, error, stats, updateUserStatus, loadUsers]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
