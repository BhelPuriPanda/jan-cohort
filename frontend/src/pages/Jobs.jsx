import React from 'react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import JobDashboard from '../components/Dashboard/JobDashboard';
import Footer from '../components/Footer/Footer';

export default function Jobs() {
  return (
    <div className="bg-black min-h-screen">
      {/* Dashboard Navbar */}
      <DashboardNavbar />
      
      {/* Add padding so content isn't hidden behind fixed Navbar */}
      <div className="pt-16">
        <JobDashboard />
      </div>

      <Footer />
    </div>
  );
}