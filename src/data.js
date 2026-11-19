// Static content (text that does not come from the database).
export const asset = (p) => import.meta.env.BASE_URL + p;

// Default contact details, used until the settings load from the database
export const CONTACT = {
    email: 'smarthall@college.bt',
    phone: '+975 17900755',
    address: 'Jigme Namgyal Engineering College, Dewathang, Bhutan',
};

export const LABEL = { approved: 'Approved', pending: 'Pending', rejected: 'Rejected', cancelled: 'Cancelled' };
export const NOTIF_STYLE = { approved: 'ic-green', pending: 'ic-orange', reminder: 'ic-navy', rejected: 'ic-red', cancelled: 'ic-navy', announcement: 'ic-teal', info: 'ic-navy' };

export const FEATURES = [
    ['calendar-check', 'Online Hall Booking', 'Pick a hall, date and time, then submit your request in a minute.'],
    ['clock-history', 'Real-Time Availability', 'See which time slots are free or already booked before you apply.'],
    ['bell', 'Booking Notifications', 'Get notified as soon as your request is approved or rejected.'],
    ['shield-lock', 'Secure Login', 'Separate accounts for students, faculty and administrators.'],
    ['speedometer2', 'Admin Management Panel', 'Administrators manage halls, users and requests from one dashboard.'],
    ['bar-chart-line', 'Reports and Analytics', 'Usage statistics help the college plan and use its halls better.'],
];
export const TEAM = [
    ['Rinchen Khandu', 'Frontend Developer and Backend Developer'],
    ['Yeshi Wangdi', 'Backend Developer'],
    ['Tashi Phuntsho', 'Backend Developer and Data Analyst'],
];
export const FAQ = [
    ['How do I book a hall?', 'Open Book Hall, choose a hall, date and time, add the event details and submit. The request is sent to the administrator as Pending.'],
    ['How long does approval take?', 'The administrator reviews requests as soon as possible. You will receive a notification when your request is approved or rejected.'],
    ['Can I cancel a booking?', 'Yes. Open My Bookings and click Cancel. Cancellation is allowed up to 24 hours before the event and you must give a reason.'],
    ['Why was my request rejected?', 'The administrator adds a remark explaining the reason, for example a clash with another event or the hall being under maintenance.'],
    ['What if the hall I want is already booked?', 'Check the Availability calendar for another time or choose a different hall. Overlapping bookings are not allowed.'],
];

// time helpers: '14:30' -> 870 minutes, and '14:30' -> '2:30 PM'
export const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const fmt = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };
