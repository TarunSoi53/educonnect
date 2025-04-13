import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaCheck, FaTimes, FaHeart, FaRegHeart, FaCrown, FaAngleLeft, FaAngleRight, FaEllipsisH } from 'react-icons/fa';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import useAuthStore from '../store/useAuthStore';
const UploadModal = ({ isOpen, onClose, onSubmit, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      className="sticky inset-0 h-screen rounded-2xl bg-opacity-75 backdrop-blur-sm flex   items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full m-4 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </motion.div>
    </motion.div>
  );
};
export default UploadModal;