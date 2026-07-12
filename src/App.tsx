import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Activity } from 'lucide-react';

const Login = React.lazy(() => import('./features/auth/Login'));
const Dashboard = React.lazy(() => import('./features/dashboard/Dashboard'));
const Organization = React.lazy(() => import('./features/organization/Organization'));
const Assets = React.lazy(() => import('./features/assets/Assets'));
const Allocation = React.lazy(() => import('./features/allocation/Allocation'));
const Booking = React.lazy(() => import('./features/booking/Booking'));
const Maintenance = React.lazy(() => import('./features/maintenance/Maintenance'));
const Audit = React.lazy(() => import('./features/audit/Audit'));
const Reports = React.lazy(() => import('./features/reports/Reports'));
const Notifications = React.lazy(() => import('./features/notifications/Notifications'));

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-20 text-muted-foreground animate-pulse flex-col">
    <Activity className="h-8 w-8 mb-4 animate-spin opacity-50" />
    <p>Loading module...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster theme="dark" position="top-right" richColors />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </Router>
  );
}

export default App;
