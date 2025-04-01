import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaUsers, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';

const ManageDepartments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sectionName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchSections(selectedDepartment._id);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
    //   const collegeId = localStorage.getItem('collegeId');
      const { data } = await api.get(`/api/departments/`);
      setDepartments(data);
    } catch (err) {
      setError('Failed to fetch departments');
    }
  };

  const fetchSections = async (departmentId) => {
    try {
      const { data } = await api.get(`/api/sections/${departmentId}/sections`);
      setSections(data);
    } catch (err) {
      setError('Failed to fetch sections');
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const collegeId = localStorage.getItem('collegeId');
      const { data } = await api.post(`/api/departments/addDepartment`, {
        name: formData.name,
        description: formData.description,
      });
      setDepartments([...departments, data]);
      setShowAddDepartment(false);
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add department');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post(`/api/sections/${selectedDepartment._id}/addsections`, {
        name: formData.sectionName,
      });
      setSections([...sections, data]);
      setShowAddSection(false);
      setFormData({ ...formData, sectionName: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add section');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      await api.delete(`/api/departments/${departmentId}`);
      setDepartments(departments.filter(dept => dept._id !== departmentId));
      if (selectedDepartment?._id === departmentId) {
        setSelectedDepartment(null);
        setSections([]);
      }
    } catch (err) {
      setError('Failed to delete department');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      await api.delete(`/api/sections/${sectionId}`);
      setSections(sections.filter(section => section._id !== sectionId));
    } catch (err) {
      setError('Failed to delete section');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Manage Departments and Sections
                </h3>
              </div>
              <button
                onClick={() => setShowAddDepartment(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="h-5 w-5 mr-2" />
                Add Department
              </button>
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm">{error}</div>
            )}

            {/* Departments List */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">Departments</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {departments.map((dept) => (
                  <div
                    key={dept._id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedDepartment?._id === dept._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">{dept.name}</h5>
                        <p className="text-sm text-gray-500">{dept.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDepartment(dept._id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections List */}
            {selectedDepartment && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Sections in {selectedDepartment.name}
                  </h4>
                  <button
                    onClick={() => setShowAddSection(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaPlus className="h-5 w-5 mr-2" />
                    Add Section
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sections.map((section) => (
                    <div
                      key={section._id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FaUsers className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{section.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSection(section._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Department</h3>
            <form onSubmit={handleAddDepartment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddDepartment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Adding...' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSection && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Section</h3>
            <form onSubmit={handleAddSection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Section Name</label>
                <input
                  type="text"
                  value={formData.sectionName}
                  onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddSection(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Adding...' : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments; 