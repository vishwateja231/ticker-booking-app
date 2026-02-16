import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events/');
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white rounded-3xl p-12 text-center shadow-xl">
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Book Tickets Easily</h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
                    Secure your spot for the hottest concerts, conferences, and shows. Book tickets instantly with our secure platform.
                </p>
                {!user ? (
                    <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md">
                        Login to Book
                    </Link>
                ) : (
                    <a href="#events" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md">
                        Explore Events
                    </a>
                )}
            </section>

            {/* Events Grid */}
            <section id="events">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Trending Events</h2>
                    <span className="text-blue-600 font-semibold cursor-pointer hover:underline">View All &rarr;</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group">
                            {/* Placeholder Image */}
                            <div className="h-48 bg-gray-200 relative">
                                <img
                                    src={`https://source.unsplash.com/random/800x600/?concert,event&sig=${event.id}`}
                                    alt={event.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow text-gray-800">
                                    {event.available_seats > 0 ? 'Selling Fast' : 'Sold Out'}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {event.name}
                                </h3>

                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-gray-600 text-sm">
                                        <span className="font-bold text-gray-900">{event.available_seats}</span> seats left
                                    </div>
                                    {event.available_seats > 0 ? (
                                        <Link
                                            to={`/book/${event.id}`}
                                            className="bg-gray-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                                        >
                                            Book Ticket
                                        </Link>
                                    ) : (
                                        <button disabled className="bg-gray-100 text-gray-400 px-5 py-2 rounded-lg font-medium cursor-not-allowed">
                                            Sold Out
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        No events found. Check back later!
                    </div>
                )}
            </section>
        </div>
    );
};

export default EventList;
