import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import BookTicket from './pages/BookTicket';
import History from './pages/History';

import AdminDashboard from './pages/Admin/Dashboard';
import CreateEvent from './pages/Admin/CreateEvent';
import Reports from './pages/Admin/Reports';
import Users from './pages/Admin/Users';
import Notifications from './pages/Notifications';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans text-gray-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes (Wrapped in UserLayout) */}
            <Route element={<UserLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<EventList />} />
                <Route path="/book/:eventId" element={<BookTicket />} />
                <Route path="/history" element={<History />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Route>

            {/* Admin Routes (Wrapped in AdminLayout) */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/create-event" element={<CreateEvent />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/users" element={<Users />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
