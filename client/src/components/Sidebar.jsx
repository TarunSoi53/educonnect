import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaUsersCog,
  FaBars, // Hamburger icon for collapse/expand
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

const Sidebar = ({ collegeName }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 60 },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
    collapsed: { opacity: 0, x: -20, transition: { duration: 0.1 } },
  };

  const renderNavigationItem = (to, icon, text) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
        isActive(to) ? 'bg-gray-700' : ''
      }`}
    >
      {icon}
      <motion.span variants={contentVariants} className="truncate">
        {text}
      </motion.span>
    </Link>
  );

  const renderNavigationItemCollapsed = (to, icon) => (
    <Link
      to={to}
      className={`flex items-center justify-center p-2 rounded-lg hover:bg-gray-700 ${
        isActive(to) ? 'bg-gray-700' : ''
      }`}
    >
      {icon}
    </Link>
  );

  const renderNavigationItems = () => {
    switch (user?.role) {
      case 'collegeAdmin':
        return (
          <>
            {renderNavigationItem('/admin/dashboard', <FaHome />, 'Dashboard')}
            {renderNavigationItem('/admin/manage-departments', <FaUsers />, 'Departments')}
            {renderNavigationItem('/admin/teachers', <FaChalkboardTeacher />, 'Teachers')}
            {/* {renderNavigationItem('/admin/students', <FaUserGraduate />, 'Students')} */}
            {/* {renderNavigationItem('/community', <FaUsersCog />, 'Community')} */}
            {renderNavigationItem('/communityNew', <FaUsersCog />, 'Community')}
          </>
        );

      case 'teacher':
        return (
          <>
            {renderNavigationItem('/teacher/dashboard', <FaHome />, 'Dashboard')}
            {renderNavigationItem('/teacher/classes', <FaVideo />, 'Classes')}
            {renderNavigationItem('/teacher/quiz', <FaQuestionCircle />, 'Quiz Control')}
            {renderNavigationItem('/ChatGroups', <FaComments />, 'Chat Groups')}
            {/* {renderNavigationItem('/community', <FaUsersCog />, 'Community')} */}
            {renderNavigationItem('/communityNew', <FaUsersCog />, 'Community')}
          </>
        );

      case 'student':
        return (
          <>
            {renderNavigationItem('/student/dashboard', <FaHome />, 'Dashboard')}
            {renderNavigationItem('/student/ClassDashboard', <FaVideo />, 'Classes')}
           
            {renderNavigationItem('/ChatGroups', <FaComments />, 'Class Groups')}
            {/* {renderNavigationItem('/community', <FaUsersCog />, 'Community')} */}
            {renderNavigationItem('/communityNew', <FaUsersCog />, 'Community')}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="h-screen bg-gray-800 text-white flex flex-col shadow-md"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      {/* Header with Collapse Button */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <button onClick={toggleCollapse} className="text-gray-400 hover:text-white focus:outline-none">
          <FaBars className="text-xl" />
        </button>
        <motion.div
          variants={contentVariants}
          className="flex items-center justify-start space-x-2"
          style={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
        >
          <FaBuilding className="text-xl" />
          <motion.h2 className="text-lg font-semibold truncate">
            {collegeName || 'College Name'}
          </motion.h2>
        </motion.div>
        {isCollapsed && <div className="w-6"></div> /* Spacer for collapsed state */}
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
          <motion.div variants={contentVariants} className="truncate">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </motion.div>
        </div>
        <Link
          to="/logout" // Or your logout route
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-700 text-red-400"
        >
          <FaSignOutAlt />
          <motion.span variants={contentVariants}>Logout</motion.span>
        </Link>
      </div>

      {/* Mini Sidebar (Visible when collapsed) */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            key="miniSidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 60, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="absolute top-0 left-0 h-full w-16 bg-gray-800 flex flex-col items-center p-4"
            style={{ zIndex: 50 }}
            onClick={toggleCollapse}
          >
            <div className="mb-4">
              <FaBars className="text-xl text-white" />
            </div>
            <nav className="flex-1 flex flex-col p-4 space-y-4">
              {user?.role === 'collegeAdmin' && (
                <>
                  {renderNavigationItemCollapsed('/admin/dashboard', <FaHome className={`text-white ${isActive('/admin/dashboard') ? 'text-indigo-400' : ''}`} />)}
                  {renderNavigationItemCollapsed('/admin/manage-departments', <FaUsers className={`text-white ${isActive('/admin/manage-departments') ? 'text-indigo-400' : ''}`} />)}
                  {renderNavigationItemCollapsed('/admin/teachers', <FaChalkboardTeacher className={`text-white ${isActive('/admin/teachers') ? 'text-indigo-400' : ''}`} />)}
                  {/* {renderNavigationItemCollapsed('/admin/students', <FaUserGraduate className={`text-white ${isActive('/admin/students') ? 'text-indigo-400' : ''}`} />)} */}
                  {/* {renderNavigationItemCollapsed('/community', <FaUsersCog className={`text-white ${isActive('/community') ? 'text-indigo-400' : ''}`} />)} */}
                  {renderNavigationItemCollapsed('/communityNew', <FaUsersCog className={`text-white ${isActive('/communityNew') ? 'text-indigo-400' : ''}`} />)}
                </>
              )}
              {user?.role === 'teacher' && (
                <>
                  {renderNavigationItemCollapsed('/teacher/dashboard', <FaHome className={`text-white ${isActive('/teacher/dashboard') ? 'text-indigo-400' : ''}`} />)}
                  {renderNavigationItemCollapsed('/teacher/classes', <FaVideo className={`text-white ${isActive('/teacher/classes') ? 'text-indigo-400' : ''}`} />)}
                  {renderNavigationItemCollapsed('/teacher/quiz', <FaQuestionCircle className={`text-white ${isActive('/teacher/quiz') ? 'text-indigo-400' : ''}`} />)}
                  {renderNavigationItemCollapsed('/ChatGroups', <FaComments className={`text-white ${isActive('/ChatGroups') ? 'text-indigo-400' : ''}`} />)}
                  {/* {renderNavigationItemCollapsed('/community', <FaUsersCog className={`text-white ${isActive('/community') ? 'text-indigo-400' : ''}`} />)} */}
                  {renderNavigationItemCollapsed('/communityNew', <FaUsersCog className={`text-white ${isActive('/communityNew') ? 'text-indigo-400' : ''}`} />)}
                </>
              )}
              {user?.role === 'student' && (
                <>
                  {renderNavigationItemCollapsed('/student/dashboard', <FaHome className={`text-white ${isActive('/student/dashboard') ? 'text-indigo-400' : ''}`} />)}
                  {renderNavigationItemCollapsed('/student/ClassDashboard', <FaVideo className={`text-white ${isActive('/student/ClassDashboard') ? 'text-indigo-400' : ''}`} />)}
                
                  {renderNavigationItemCollapsed('/ChatGroups', <FaComments className={`text-white ${isActive('/ChatGroups') ? 'text-indigo-400' : ''}`} />)}
                  {/* {renderNavigationItemCollapsed('/community', <FaUsersCog className={`text-white ${isActive('/community') ? 'text-indigo-400' : ''}`} />)} */}
                  {renderNavigationItemCollapsed('/communityNew', <FaUsersCog className={`text-white ${isActive('/communityNew') ? 'text-indigo-400' : ''}`} />)}
                </>
              )}
            </nav>
            <div className="mt-auto">
              <FaUserCircle className="text-xl text-white mb-2" />
              <Link to="/logout" onClick={handleLogout} className="text-red-400"><FaSignOutAlt className="text-xl" /></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;