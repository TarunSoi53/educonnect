import React, { useState, useEffect } from 'react';
import { FaPlus, FaBook } from 'react-icons/fa';
import api from '../../utils/api';
import DashboardLayout from '../../components/DashboardLayout';

const Classes = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ name: '', description: '' });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sections, setSections] = useState([]);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    section: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeacherData();
  }, []);

  useEffect(() => {
    if(showAddSubjectModal){
      fetchDepartments();
    }
  }, [showAddSubjectModal]);
   useEffect(() => {
      if (selectedSubject) {
        fetchTopics(selectedSubject._id);
      }
    }, [selectedSubject]);

  useEffect(() => {
    if (formData.department) {
      fetchSections(formData.department);
    }
  }, [formData.department]);

  const fetchDepartments = async () => {
    try {
    //   const collegeId = localStorage.getItem('collegeId');
      const { data } = await api.get(`/api/departments/`);
      setDepartments(data);
    } catch (err) {
      setError('Failed to fetch departments');
    }
  };

  const fetchTeacherData = async () => {
    try {
      // Fetch teacher's subjects
      const subjectsResponse = await api.get('/api/subjects/teacher');
      setSubjects(subjectsResponse.data);

      // Fetch departments
      const departmentsResponse = await api.get('/api/departments/');
      setDepartments(departmentsResponse.data);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const fetchSections = async (departmentId) => {
    try {
      const { data } = await api.get(`/api/sections/${departmentId}/sections`);
      setSections(data);
      setFormData(prev => ({ ...prev, section: '' }));
    } catch (err) {
      setError('Failed to fetch sections');
    }
  };

  const fetchTopics = async (subjectId) => {
    try {
      const response = await api.get(`/api/topics/subject/${subjectId}`);
      setTopics(response.data);
    } catch (error) {
      setError('Failed to fetch topics');
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;

    try {
      setLoading(true);
      const response = await api.post('/api/topics', {
        ...newTopic,
        subjectId: selectedSubject._id
      });
      setTopics([response.data, ...topics]);
      setNewTopic({ name: '', description: '' });
    } catch (error) {
      setError('Failed to add topic');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/subjects', formData);
      setShowAddSubjectModal(false);
      setFormData({ name: '', department: '', section: '' });
      fetchTeacherData();
    } catch (err) {
      setError('Failed to add subject');
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
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <button
            onClick={() => setShowAddSubjectModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="h-5 w-5 mr-2" />
            Add Subject
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Subjects List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  selectedSubject?._id === subject._id ? 'bg-blue-100' : ''
                }`} 
                onClick={() => setSelectedSubject(subject)}
              >
                <div className="flex items-center space-x-3">
                  <FaBook className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-500">
                      {subject.department.name} - {subject.section.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Subject Modal */}
        {showAddSubjectModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Add New Subject</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Section</option>
                    {sections.map((sec) => (
                      <option key={sec._id} value={sec._id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

{selectedSubject && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Topics for {selectedSubject.name}</h2>
          
          {/* Add New Topic Form */}
          <form onSubmit={handleAddTopic} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Topic Name</label>
                <input
                  type="text"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Adding...' : 'Add Topic'}
            </button>
          </form>

          {/* Topics List */}
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic._id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{topic.name}</h3>
                {topic.description && (
                  <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Added on {new Date(topic.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default Classes; 