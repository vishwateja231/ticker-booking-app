import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_users: 0, total_events: 0, total_bookings: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/reports/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, color, icon }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')} text-xl`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
                <p className="text-gray-500">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.total_users} color="text-blue-600" icon="👥" />
                <StatCard title="Active Events" value={stats.total_events} color="text-green-600" icon="📅" />
                <StatCard title="Total Bookings" value={stats.total_bookings} color="text-purple-600" icon="🎟️" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity / Chart Placeholder */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Booking Trends</h3>
                    <div className="h-64 flex items-end justify-between space-x-2 px-4">
                        {/* CSS Bar Chart Simulation */}
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group transition-all hover:bg-blue-200" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
                                    {h}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/admin/create-event" className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition group">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">➕</div>
                            <div className="ml-4">
                                <p className="font-semibold text-gray-700">Create New Event</p>
                                <p className="text-sm text-gray-500">Launch a new concert or show</p>
                            </div>
                        </Link>
                        <Link to="/admin/reports" className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition group">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">📊</div>
                            <div className="ml-4">
                                <p className="font-semibold text-gray-700">View Detailed Reports</p>
                                <p className="text-sm text-gray-500">Analyze booking performance</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
