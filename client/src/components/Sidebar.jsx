import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaBuilding,
  FaVideo,
  FaComments,
  FaQuestionCircle,
  FaUsersCog
} from 'react-icons/fa';
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

  const renderNavigationItems = () => {
    switch (user?.role) {
      case 'collegeAdmin':
        return (
          <>
            <Link
              to="/admin/dashboard"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/admin') ? 'bg-gray-700' : ''
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
            <Link
              to="/community"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/community') ? 'bg-gray-700' : ''
              }`}
            >
              <FaUsersCog />
              <span>Community</span>
            </Link>
          </>
        );

      case 'teacher':
        return (
          <>
            <Link
              to="/teacher/dashboard"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/teacher') ? 'bg-gray-700' : ''
              }`}
            >
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/teacher/classes"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/teacher/classes') ? 'bg-gray-700' : ''
              }`}
            >
              <FaVideo />
              <span>Classes</span>
            </Link>
            <Link
              to="/teacher/quiz"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/teacher/quiz') ? 'bg-gray-700' : ''
              }`}
            >
              <FaQuestionCircle />
              <span>Quiz Control</span>
            </Link>
            <Link
              // to="/teacher/chat-groups"
              to="/teacher/dashboard"
              

              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/teacher/chat-groups') ? 'bg-gray-700' : ''
              }`}
            >
              <FaComments />
              <span>Chat Groups</span>
            </Link>
            <Link
              to="/community"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/community') ? 'bg-gray-700' : ''
              }`}
            >
              <FaUsersCog />
              <span>Community</span>
            </Link>
          </>
        );

      case 'student':
        return (
          <>
            <Link
              to="/student/dashboard"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/student') ? 'bg-gray-700' : ''
              }`}
            >
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/student/live-classes"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/student/live-classes') ? 'bg-gray-700' : ''
              }`}
            >
              <FaVideo />
              <span>Live Classes</span>
            </Link>
            <Link
              // to="/student/class-groups"
              to="/student/dashboard"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/student/class-groups') ? 'bg-gray-700' : ''
              }`}
            >
              <FaComments />
              <span>Class Groups</span>
            </Link>
            <Link
              to="/community"
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                isActive('/community') ? 'bg-gray-700' : ''
              }`}
            >
              <FaUsersCog />
              <span>Community</span>
            </Link>
          </>
        );

      default:
        return null;
    }
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
          {renderNavigationItems()}
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