import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, ArrowRight, Clock, UserPlus, FileText } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                <motion.div
                    animate={unreadCount > 0 ? {
                        rotate: [0, -10, 10, -10, 10, 0],
                    } : {}}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        repeatDelay: 3
                    }}
                >
                    <Bell className="w-5 h-5" />
                </motion.div>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                    >
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                <p className="text-[11px] text-slate-500">{unreadCount} unread alerts</p>
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 px-2 py-1 rounded-lg"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/20' : ''}`}
                                            onClick={() => {
                                                // Mark as read when clicked
                                                markAsRead(notification.id);

                                                // Navigate to review page if not yet actioned
                                                if (!notification.actionTaken) {
                                                    setIsOpen(false);
                                                    navigate(`/vendors/review/${notification.id}`);
                                                }
                                            }}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${notification.actionTaken ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                                                    <UserPlus className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-xs font-bold text-slate-900 truncate">
                                                            Vendor Registration
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatTime(notification.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 mb-2">
                                                        <span className="font-bold text-slate-800">{notification.vendorName}</span> ({notification.vendorEmail}) is awaiting approval.
                                                    </p>

                                                    {!notification.actionTaken ? (
                                                        <div className="flex items-center gap-2 mt-3 pointer-events-none">
                                                            {/* Buttons are visual indicators now since the whole div is clickable */}
                                                            <div className="flex-1 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-sm shadow-blue-100">
                                                                <FileText className="w-3 h-3" /> Review & Decide
                                                                <ArrowRight className="w-3 h-3" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2 flex items-center gap-1.5">
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${notification.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                                {notification.status}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">Actioned</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Bell className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">No new alerts</h4>
                                    <p className="text-[11px] text-slate-400 mt-1">Everything is up to date.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-slate-50/50 border-t border-gray-50 flex items-center justify-center">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/vendors');
                                }}
                                className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                                View all requests <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
