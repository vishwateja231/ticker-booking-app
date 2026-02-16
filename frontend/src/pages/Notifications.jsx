import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Backend `routers/notifications.py` Step 639 has `GET /`.
                const response = await api.get('/notifications/');
                // It returns bookings as notifications
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications");
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Notifications</h2>
            <div className="space-y-4">
                {notifications.map((notif, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                🔔
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">Booking Confirmed</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Your seat <strong>{notif.seat_number}</strong> for event <strong>#{notif.event_id}</strong> has been successfully booked.
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(notif.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
                {notifications.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No notifications yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
