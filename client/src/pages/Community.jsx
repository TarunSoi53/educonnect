import React, { useState, useEffect } from 'react';
import { FaUpload, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import useAuthStore from '../store/useAuthStore';

const Community = () => {
  const { user } = useAuthStore();
  const [artItems, setArtItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Painting',
    image: null
  });

  useEffect(() => {
    fetchArtItems();
    if (user.role === 'collegeAdmin') {
      fetchPendingItems();
    }
    if (user.role === 'teacher' || user.role === 'student') {
      fetchMyUploads();
    }
  }, [user.role]);

  const fetchArtItems = async () => {
    try {
      const response = await api.get('/api/community/art-gallery');
      setArtItems(response.data);
    } catch (error) {
      setError('Failed to fetch art gallery items');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingItems = async () => {
    try {
      const response = await api.get('/api/community/art-gallery/pending');
      setPendingItems(response.data);
    } catch (error) {
      setError('Failed to fetch pending items');
    }
  };

  const fetchMyUploads = async () => {
    try {
      const response = await api.get('/api/community/art-gallery/my-uploads');
      setMyUploads(response.data);
    } catch (error) {
      setError('Failed to fetch your uploads');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);
    formData.append('image', uploadForm.image);

    try {
      await api.post('/api/community/art-gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', category: 'Painting', image: null });
      fetchArtItems();
      fetchMyUploads();
    } catch (error) {
      setError('Failed to upload art item');
    }
  };

  const handleStatusUpdate = async (id, status, rejectionReason = '') => {
    try {
      await api.patch(`/api/community/art-gallery/${id}/status`, {
        status,
        rejectionReason
      });
      fetchPendingItems();
      fetchArtItems();
    } catch (error) {
      setError('Failed to update status');
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
          <h1 className="text-2xl font-bold text-gray-800">Community</h1>
          {(user.role === 'teacher' || user.role === 'student') && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaUpload className="mr-2" />
              Upload Art
            </button>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Art Gallery Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Art Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artItems.map((item) => (
              <div key={item._id} className="border rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    By: {item.uploadedBy.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Items Section (for college admin) */}
        {user.role === 'collegeAdmin' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item._id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        By: {item.uploadedBy.name}
                      </p>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'approved')}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          <FaCheck className="mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) {
                              handleStatusUpdate(item._id, 'rejected', reason);
                            }
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                          <FaTimes className="mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Uploads Section (for teachers and students) */}
        {(user.role === 'teacher' || user.role === 'student') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">My Uploads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myUploads.map((item) => (
                <div key={item._id} className="border rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className={`text-sm mt-2 ${
                      item.status === 'approved' ? 'text-green-600' :
                      item.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </p>
                    {item.rejectionReason && (
                      <p className="text-sm text-red-600 mt-1">
                        Reason: {item.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Upload Art</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="Painting">Painting</option>
                    <option value="Photography">Photography</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Sculpture">Sculpture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadForm({ ...uploadForm, image: e.target.files[0] })}
                    className="mt-1 block w-full"
                    accept="image/*"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Community; 