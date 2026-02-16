import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const BookTicket = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const totalSeats = 50; // Simplified for UI demo

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch booked seats
                const seatsResponse = await api.get(`/bookings/event/${eventId}/seats`);
                setBookedSeats(seatsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load seats", error);
                toast.error('Failed to load seat availability');
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

    const handleBooking = async () => {
        if (!selectedSeat) {
            toast.warning('Please select a seat');
            return;
        }
        try {
            await api.post('/bookings/', {
                event_id: parseInt(eventId),
                seat_number: selectedSeat
            });
            toast.success(`Seat ${selectedSeat} booked successfully!`);
            navigate('/history');
        } catch (error) {
            const msg = error.response?.data?.detail || 'Booking failed. Please try again.';
            toast.error(msg);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                {/* Event Info Sidebar (Simulated) */}
                <div className="bg-gray-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Select Your Seat</h2>
                        <p className="text-gray-400 mb-8">Choose the best spot for the event. Green seats are available.</p>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-white border border-gray-300 rounded mr-3"></div>
                                <span>Available</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-green-500 rounded mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <span>Selected</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-600 rounded mr-3 opacity-50"></div>
                                <span>Booked</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={!selectedSeat || isBooking}
                        className={`w-full py-4 rounded-xl font-bold text-lg mt-8 transition-all transform ${selectedSeat && !isBooking
                            ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg text-white'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isBooking ? 'Processing...' : (selectedSeat ? `Confirm Seat ${selectedSeat}` : 'Select a Seat')}
                    </button>
                </div>

                {/* Seat Map */}
                <div className="p-8 md:w-2/3 bg-gray-50">
                    <div className="mb-8 text-center text-gray-400 text-sm tracking-widest uppercase mb-12">
                        <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                        Stage / Screen
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-3 justify-center">
                        {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seatNum) => {
                            const isBooked = bookedSeats.includes(seatNum);
                            const isSelected = selectedSeat === seatNum;
                            return (
                                <button
                                    key={seatNum}
                                    disabled={isBooked}
                                    onClick={() => setSelectedSeat(seatNum)}
                                    className={`
                                        h-10 w-10 sm:h-12 sm:w-12 rounded-lg text-sm font-semibold transition-all duration-200 transform
                                        ${isBooked
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                            : isSelected
                                                ? 'bg-green-500 text-white scale-110 shadow-lg ring-2 ring-green-300'
                                                : 'bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-700'}
                                    `}
                                >
                                    {seatNum}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookTicket;
