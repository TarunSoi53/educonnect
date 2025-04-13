import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import DashboardLayout from '../../components/DashboardLayout';

import api from '../../utils/api';


const Quizzes = () => {
  const { user } = useAuthStore();
  console.log(user)
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    averageScore: 0,
    totalSubmissions: 0
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filter, setFilter] = useState({
    department: '',
    section: ''
  });
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setmessage] = useState("");
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchQuizzes();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (filter.department) {
      fetchSections(filter.department);
    }
  }, [filter.department]);

  const fetchStats = async () => {
    try {
      
      const response = await api.get(`/api/quizzes/stats/${user._id}`);
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch quiz stats');
    }
  };

  const fetchQuizzes = async () => {
    try {

      const response = await api.get(`/api/quizzes/teacher/`);
      setQuizzes(response.data);
    } catch (error) {
      setError('Failed to fetch quizzes');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      setError('Failed to fetch departments');
    }
  };

  const fetchSections = async (departmentId) => {
    try {
      const response = await api.get(`/api/sections/${departmentId}/sections`);
      setSections(response.data);
    } catch (error) {
      setError('Failed to fetch sections');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuizClick = async (quizId) => {
    try {
      const response = await api.get(`/api/quizzes/${quizId}`);
      setSelectedQuiz(response.data);
    } catch (error) {
      setError('Failed to fetch quiz details');
    }
  };


 const handleStartQuiz=async (quizId)=>{
  const response= await api.patch(`/api/quizzes/startquiz/${quizId}`)
  setmessage(response.data.message)

  
 }








  return (
    <DashboardLayout title="Quiz Management">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quiz Management</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Quizzes</h3>
          <p className="text-2xl">{stats.totalQuizzes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Questions</h3>
          <p className="text-2xl">{stats.totalQuestions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Average Score</h3>
          <p className="text-2xl">{stats.averageScore}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Submissions</h3>
          <p className="text-2xl">{stats.totalSubmissions}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={filter.department}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            <select
              name="section"
              value={filter.section}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={!filter.department}
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section._id} value={section._id}>{section.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div
              key={quiz._id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
             
            ><div> 
              <h3 className="font-semibold">{quiz.title}</h3>
              <p className="text-sm text-gray-600">{quiz.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Created on {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
              </div>
              <div className="flex justify-between mt-2"> 
               
                <button className="bg-blue-400 p-2 rounded text-black hover:bg-blue-600 hover:text-amber-50" onClick={() => handleQuizClick(quiz._id)} > view question</button>
              </div>
              <div className="flex justify-between mt-2"> 
                {quiz.status=="pending"?(
                <button className="bg-blue-400 p-2 rounded text-black hover:bg-blue-600 hover:text-amber-50" onClick={()=>{handleStartQuiz(quiz._id)}}>{`${quiz.status} ${quiz.status=="pending"?"start quiz":""} `}</button>
                 ):<p>{quiz.status}</p>} </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Details Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center  bg-blue-300 text-white mb-4">
              <div><h2 className="text-xl font-semibold">{selectedQuiz.title}</h2></div>
             <div className=""> <button
                onClick={() => setSelectedQuiz(null)}
                className="text-gray-500 block hover:text-gray-700"
              >
                ✕
              </button></div>
            </div>
            <div className="space-y-4 mt-10">
              {selectedQuiz.quizQuestions.map((question, index) => (
                <div key={question._id} className="border-b pb-4">
                  <p className="font-semibold">Question {index + 1}: {question.question}</p>
                  <div className="mt-2 space-y-1">
                    {question.options.map((option, i) => (
                      <p
                        key={i}
                        className={`pl-2 ${
                          String.fromCharCode(97 + i) === question.correctAnswer ? 'text-green-600 font-semibold' : ''
                        }`}
                      >
                        {String.fromCharCode(97 + i)}. {option}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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

export default Quizzes; 