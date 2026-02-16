import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: '',
        total_seats: '',
        date: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/events/', formData);
            toast.success("Event created successfully!");
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error("Failed to create event");
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Event Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Total Seats</label>
                    <input
                        type="number"
                        name="total_seats"
                        value={formData.total_seats}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Date (YYYY-MM-DDTHH:MM:SS)</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
