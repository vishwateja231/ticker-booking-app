import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">TicketBooker</Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/" className="text-white hover:text-gray-200">Events</Link>
                            {user.is_admin && (
                                <Link to="/admin/dashboard" className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition">Admin Dashboard</Link>
                            )}
                            <Link to="/history" className="text-white hover:text-gray-200">My Bookings</Link>
                            <Link to="/notifications" className="text-white hover:text-gray-200">Notifications</Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
                            <Link to="/register" className="text-white hover:text-gray-200">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
