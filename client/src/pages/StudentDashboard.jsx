import React, { useState, useEffect } from 'react';
import { FaBook, FaCalendarAlt, FaClipboardList, FaGraduationCap } from 'react-icons/fa';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    upcomingClasses: 0,
    assignments: 0,
    attendance: 0
  });

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const response = await api.get('/api/students/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching student stats:', error);
      }
    };

    fetchStudentStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBook className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Subjects</p>
                <p className="text-2xl font-semibold">{stats.totalSubjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FaCalendarAlt className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Classes</p>
                <p className="text-2xl font-semibold">{stats.upcomingClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaClipboardList className="text-yellow-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Assignments</p>
                <p className="text-2xl font-semibold">{stats.assignments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaGraduationCap className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Attendance</p>
                <p className="text-2xl font-semibold">{stats.attendance}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {/* Add your schedule items here */}
            <p className="text-gray-500">No classes scheduled for today</p>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Assignments</h2>
          <div className="space-y-4">
            {/* Add your assignments here */}
            <p className="text-gray-500">No recent assignments</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard; 