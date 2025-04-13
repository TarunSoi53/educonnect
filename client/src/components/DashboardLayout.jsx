import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, collegeName }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collegeName={collegeName} />
      <div className="flex-1 overflow-auto">
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 