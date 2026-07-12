import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Organization from './features/organization/Organization';
import Assets from './features/assets/Assets';
import Allocation from './features/allocation/Allocation';
import Booking from './features/booking/Booking';
import Maintenance from './features/maintenance/Maintenance';
import Audit from './features/audit/Audit';
import Reports from './features/reports/Reports';
import Notifications from './features/notifications/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="organization" element={<Organization />} />
            <Route path="assets" element={<Assets />} />
            <Route path="allocation" element={<Allocation />} />
            <Route path="booking" element={<Booking />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="audit" element={<Audit />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
