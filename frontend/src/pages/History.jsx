import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const History = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // If endpoint supports 'expand=event', use it. Otherwise, assume backend returns event name?
                // Our current backend router returns Booking objects with event_id. 
                // To display Event Name, we need to fetch event details or have backend include it.
                // For simplicity/speed, I'll rely on what's available or mock if needed?
                // Actually, backend `Booking` model has relationships. `BookingResponse` might not include nested.
                // Let's assume user just sees ID and Seat for now, or I update backend?
                // I will try to fetch bookings. 

                const response = await api.get('/bookings/');
                setBookings(response.data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Booking History</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {bookings.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <li key={booking.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">
                                            Booking #{booking.id} &bull; {new Date(booking.created_at).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Event ID: {booking.event_id} {/* Ideally Event Name */}
                                        </h3>
                                        <div className="text-gray-600 mt-1">
                                            Seat Number: <span className="font-semibold text-gray-900">{booking.seat_number}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        You have no bookings yet.
                        <br />
                        <a href="/" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">Browse Events</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
