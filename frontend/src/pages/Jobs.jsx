import React from 'react';
import JobDashboard from '../components/Dashboard/JobDashboard';
import Footer from '../components/Footer/Footer';

export default function Jobs() {
  return (
    <div className="bg-black min-h-screen">
      <div>
        <JobDashboard />
      </div>
      <Footer />
    </div>
  );
}