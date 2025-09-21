import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import VictimDashboard from './pages/victim-dashboard';
import AuthenticationLogin from './pages/authentication-login';
import VolunteerDashboard from './pages/volunteer-dashboard';
import NGOAdminDashboard from './pages/ngo-admin-dashboard';
import RequestManagement from './pages/request-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AuthenticationLogin />} />
        <Route path="/victim-dashboard" element={<VictimDashboard />} />
        <Route path="/authentication-login" element={<AuthenticationLogin />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/ngo-admin-dashboard" element={<NGOAdminDashboard />} />
        <Route path="/request-management" element={<RequestManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
