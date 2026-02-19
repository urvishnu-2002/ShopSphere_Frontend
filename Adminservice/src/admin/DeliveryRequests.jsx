import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { fetchDeliveryRequests, approveDeliveryRequest, rejectDeliveryRequest } from '../api/axios';
import { useEffect } from 'react';

const DeliveryRequests = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loadAgents = async () => {
        try {
            const data = await fetchDeliveryRequests();
            setAgents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch delivery requests", error);
        }
    };

    useEffect(() => {
        loadAgents();
    }, []);

    const pendingRequests = agents.filter(agent => agent.approval_status === 'pending');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/');
    };

    const handleAction = async (id, action) => {
        try {
            if (action === "Approved") {
                await approveDeliveryRequest(id);
            } else {
                await rejectDeliveryRequest(id, "Rejected by administrator");
            }
            await loadAgents();
        } catch (error) {
            console.error("Action execution failed:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activePage="Delivery Requests"
                onLogout={handleLogout}
            />

            <main className="flex-1 overflow-y-auto transition-all duration-300">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-violet-100 hover:text-violet-950 rounded-lg transition-all duration-200"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5 md:w-6 md:h-6" /> : <PanelLeftOpen className="w-5 h-5 md:w-6 md:h-6" />}
                        </button>
                        <h1 className="text-lg md:text-2xl font-bold text-slate-800 truncate">Delivery Agent Requests</h1>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-auto">
                        <div className="w-8 h-8 bg-violet-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-violet-900/20">A</div>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="mb-6">
                        <div className="inline-block px-4 py-2 bg-violet-800 text-white rounded-lg font-medium shadow-lg shadow-violet-900/20">
                            Pending Requests ({pendingRequests.length})
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Vehicle</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">City</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {pendingRequests.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">{agent.user_name}</td>
                                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{agent.user_email}</td>
                                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600 uppercase">{agent.vehicle_type}</td>
                                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{agent.city}</td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(agent.id, 'Approved')}
                                                        className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(agent.id, 'Rejected')}
                                                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                No pending delivery agent requests at this time.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DeliveryRequests;
