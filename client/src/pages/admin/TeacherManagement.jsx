import React, { useState, useEffect } from 'react';
import { FaCrown, FaUserTie } from 'react-icons/fa';
import api from '../../utils/api';
import DashboardLayout from '../../components/DashboardLayout';

const TeacherManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchTeachersByDepartment(selectedDepartment._id);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/api/departments/');
      setDepartments(data);
      if (data.length > 0) {
        setSelectedDepartment(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachersByDepartment = async (departmentId) => {
    try {
      const { data } = await api.get(`/api/teachers/department/${departmentId}`);
      console.log("teacherlist", data);


      // Sort teachers to show department head first
      const sortedTeachers = data.sort((a, b) => {
        if (a.isDepartmentHead) return -1;
        if (b.isDepartmentHead) return 1;
        return 0;
      });
      setTeachers(sortedTeachers);
    } catch (err) {
      setError('Failed to fetch teachers');
    }
  };

  const handleSetDepartmentHead = async (teacherId) => {
    try {
      await api.post(`/api/departments/${selectedDepartment._id}/head`, {
        teacherId
      });
      setSuccessMessage('Department head updated successfully');
      // Refresh the teachers list
      fetchTeachersByDepartment(selectedDepartment._id);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to set department head');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage Teachers</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Department Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {departments.map((dept) => (
              <button
                key={dept._id}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedDepartment?._id === dept._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* Teachers List */}
        {selectedDepartment && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Teachers in {selectedDepartment.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className={teacher.isDepartmentHead ? 'bg-blue-50' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.name}
                          </div>
                          {teacher.isDepartmentHead && (
                            <FaCrown className="ml-2 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            teacher.isDepartmentHead
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {teacher.isDepartmentHead ? 'Department Head' : 'Teacher'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {!teacher.isDepartmentHead && (
                          <button
                            onClick={() => handleSetDepartmentHead(teacher._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaUserTie className="mr-1" />
                            Set as Head
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherManagement; 