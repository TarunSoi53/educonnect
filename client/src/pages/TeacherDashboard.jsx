import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaUsers, FaBook, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    upcomingClasses: 0,
    totalSubjects: 0
  });

  useEffect(() => {
    const fetchTeacherStats = async () => {
      try {
        const response = await api.get('/api/teachers/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching teacher stats:', error);
      }
    };

    fetchTeacherStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaUsers className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FaChalkboardTeacher className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Classes</p>
                <p className="text-2xl font-semibold">{stats.totalClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaCalendarAlt className="text-yellow-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Classes</p>
                <p className="text-2xl font-semibold">{stats.upcomingClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaBook className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Subjects</p>
                <p className="text-2xl font-semibold">{stats.totalSubjects}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add your recent activity items here */}
            <p className="text-gray-500">No recent activity to display</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard; 