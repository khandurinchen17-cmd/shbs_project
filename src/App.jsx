import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AppLayout } from './components/layouts.jsx';
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import UserDashboard from './pages/user/Dashboard.jsx';
import Halls from './pages/user/Halls.jsx';
import HallDetails from './pages/user/HallDetails.jsx';
import BookHall from './pages/user/BookHall.jsx';
import Availability from './pages/user/Availability.jsx';
import MyBookings from './pages/user/MyBookings.jsx';
import Notifications from './pages/user/Notifications.jsx';
import Profile from './pages/user/Profile.jsx';
import Help from './pages/user/Help.jsx';
import Feedback from './pages/user/Feedback.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import BookingRequests from './pages/admin/BookingRequests.jsx';
import AllBookings from './pages/admin/AllBookings.jsx';
import ManageHalls from './pages/admin/ManageHalls.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import Reports from './pages/admin/Reports.jsx';
import AdminNotifications from './pages/admin/AdminNotifications.jsx';
import Settings from './pages/admin/Settings.jsx';

// Every page of the system is one route. Layouts (navbar / sidebar) wrap the pages inside them.
export default function App() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            <Route path="user" element={<AppLayout role="user" />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="halls" element={<Halls />} />
                <Route path="hall-details" element={<HallDetails />} />
                <Route path="book-hall" element={<BookHall />} />
                <Route path="availability" element={<Availability />} />
                <Route path="my-bookings" element={<MyBookings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="help" element={<Help />} />
                <Route path="feedback" element={<Feedback />} />
            </Route>

            <Route path="admin" element={<AppLayout role="admin" />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="booking-requests" element={<BookingRequests />} />
                <Route path="all-bookings" element={<AllBookings />} />
                <Route path="manage-halls" element={<ManageHalls />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="reports" element={<Reports />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
