import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaChalkboardTeacher, FaUserGraduate, FaUserCircle, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

const Sidebar = ({ collegeName }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Top Section - College Name */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FaBuilding className="text-xl" />
          <h2 className="text-lg font-semibold truncate">{collegeName || 'College Name'}</h2>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
              isActive('/admin/dashboard') ? 'bg-gray-700' : ''
            }`}
          >
            <FaHome />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/manage-departments"
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
              isActive('/admin/manage-departments') ? 'bg-gray-700' : ''
            }`}
          >
            <FaUsers />
            <span>Departments</span>
          </Link>
          <Link
            to="/admin/teachers"
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
              isActive('/admin/teachers') ? 'bg-gray-700' : ''
            }`}
          >
            <FaChalkboardTeacher />
            <span>Teachers</span>
          </Link>
          <Link
            to="/admin/students"
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
              isActive('/admin/students') ? 'bg-gray-700' : ''
            }`}
          >
            <FaUserGraduate />
            <span>Students</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Section - Account */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <FaUserCircle className="text-xl" />
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-700 text-red-400"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 