import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const Reports = () => {
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get('/reports/event-bookings');
                setReportData(response.data);
            } catch (error) {
                console.error("Failed to fetch report", error);
            }
        };
        fetchReport();
    }, []);

    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold mb-6">Event Booking Reports</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.map((row, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{row.event_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{row.bookings}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
