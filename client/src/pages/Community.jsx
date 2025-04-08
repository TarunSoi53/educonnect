import React, { useState, useEffect, useCallback } from 'react';
import { FaUpload, FaCheck, FaTimes, FaHeart, FaRegHeart, FaCrown } from 'react-icons/fa';
import api from '../utils/api'; // Your configured axios instance
import DashboardLayout from '../components/DashboardLayout'; // Your layout component
import useAuthStore from '../store/useAuthStore'; // Your zustand/context store

// --- Helper Component for Upload Modal ---
const UploadModal = ({ isOpen, onClose, onSubmit, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {children} {/* Form fields go here */}
        </form>
      </div>
    </div>
  );
};


// --- Main Community Component ---
const Community = () => {
  const { user } = useAuthStore(); // Get user info and role

  // --- State ---
  // General
  const [loading, setLoading] = useState({
      contest: true,
      spotlight: true,
      artGallery: true,
      winner: true,
  });
  const [error, setError] = useState(''); // Combined error state for simplicity

  // Contest State
  const [activeContest, setActiveContest] = useState(null);
  const [contestSubmissions, setContestSubmissions] = useState([]);
  const [todaysWinner, setTodaysWinner] = useState(null); // Stores the winning *submission* object
  const [showContestModal, setShowContestModal] = useState(false);
  const [showContestSubmitModal, setShowContestSubmitModal] = useState(false);
  const [contestForm, setContestForm] = useState({ title: '', description: '', durationHours: 24 });
  const [contestSubmitForm, setContestSubmitForm] = useState({ image: null });

  // Spotlight State
  const [spotlightPosts, setSpotlightPosts] = useState([]);
  const [pendingSpotlight, setPendingSpotlight] = useState([]);
  const [mySpotlightUploads, setMySpotlightUploads] = useState([]);
  const [showSpotlightModal, setShowSpotlightModal] = useState(false);
  const [spotlightForm, setSpotlightForm] = useState({ description: '', image: null });

  // Art Gallery State (Existing)
  const [artItems, setArtItems] = useState([]);
  const [pendingArt, setPendingArt] = useState([]);
  const [myArtUploads, setMyArtUploads] = useState([]);
  const [showArtUploadModal, setShowArtUploadModal] = useState(false);
  const [artUploadForm, setArtUploadForm] = useState({
    title: '', description: '', category: 'Painting', image: null
  });

  // --- Data Fetching Functions ---
  const fetchActiveContest = useCallback(async () => {
    setLoading(prev => ({ ...prev, contest: true }));
    try {
      const { data } = await api.get('/api/community/contests/active');
      setActiveContest(data);
      if (data) {
        fetchContestSubmissions(data._id); // Fetch submissions if contest exists
      } else {
        setContestSubmissions([]); // Clear submissions if no active contest
         setLoading(prev => ({ ...prev, contest: false }));
      }
    } catch (err) {
      setError('Failed to fetch active contest');
      console.error(err);
       setLoading(prev => ({ ...prev, contest: false }));
    }
  }, []); // Empty dependency array, doesn't depend on external state changes directly

  const fetchContestSubmissions = useCallback(async (contestId) => {
    // setLoading(prev => ({ ...prev, contest: true })); // Already handled by fetchActiveContest
    try {
      const { data } = await api.get(`/api/community/contests/${contestId}/submissions`);
      setContestSubmissions(data);
    } catch (err) {
      setError('Failed to fetch contest submissions');
      console.error(err);
    } finally {
       setLoading(prev => ({ ...prev, contest: false }));
    }
  }, []);

  const fetchTodaysWinner = useCallback(async () => {
     setLoading(prev => ({ ...prev, winner: true }));
     try {
         const { data } = await api.get('/api/community/contests/winner');
         setTodaysWinner(data);
     } catch (err) {
         setError('Failed to fetch contest winner');
         console.error(err);
     } finally {
        setLoading(prev => ({ ...prev, winner: false }));
     }
  }, []);


  const fetchSpotlightPosts = useCallback(async () => {
    setLoading(prev => ({ ...prev, spotlight: true }));
    try {
      const { data } = await api.get('/api/community/spotlight');
      setSpotlightPosts(data);
    } catch (err) {
      setError('Failed to fetch spotlight posts');
      console.error(err);
    } finally {
       setLoading(prev => ({ ...prev, spotlight: false }));
    }
  }, []);

  const fetchPendingSpotlight = useCallback(async () => {
    // setLoading(prev => ({ ...prev, spotlight: true })); // Optional separate loading
    try {
      const { data } = await api.get('/api/community/spotlight/pending');
      setPendingSpotlight(data);
    } catch (err) {
      setError('Failed to fetch pending spotlight');
      console.error(err);
    }
    // setLoading(prev => ({ ...prev, spotlight: false }));
  }, []);

 const fetchMySpotlightUploads = useCallback(async () => {
    // setLoading(prev => ({ ...prev, spotlight: true })); // Optional separate loading
     try {
         const { data } = await api.get('/api/community/spotlight/my-uploads');
         setMySpotlightUploads(data);
     } catch (err) {
         setError('Failed to fetch your spotlight uploads');
         console.error(err);
     }
     // setLoading(prev => ({ ...prev, spotlight: false }));
 }, []);


  const fetchArtItems = useCallback(async () => {
    setLoading(prev => ({ ...prev, artGallery: true }));
    try {
      const { data } = await api.get('/api/community/art-gallery');
      setArtItems(data);
    } catch (err) {
      setError('Failed to fetch art gallery items');
      console.error(err);
    } finally {
       setLoading(prev => ({ ...prev, artGallery: false }));
    }
  }, []);

  const fetchPendingArt = useCallback(async () => {
     // setLoading(prev => ({ ...prev, artGallery: true }));
    try {
      const { data } = await api.get('/api/community/art-gallery/pending');
      setPendingArt(data);
    } catch (err) {
      setError('Failed to fetch pending art items');
      console.error(err);
    }
     // setLoading(prev => ({ ...prev, artGallery: false }));
  }, []);

  const fetchMyArtUploads = useCallback(async () => {
     // setLoading(prev => ({ ...prev, artGallery: true }));
    try {
      const { data } = await api.get('/api/community/art-gallery/my-uploads');
      setMyArtUploads(data);
    } catch (err) {
      setError('Failed to fetch your art uploads');
      console.error(err);
    }
    // setLoading(prev => ({ ...prev, artGallery: false }));
  }, []);

  // --- Initial Data Fetching Effect ---
  useEffect(() => {
    setError(''); // Clear errors on initial load or user change
    fetchActiveContest();
    fetchTodaysWinner();
    fetchSpotlightPosts();
    fetchArtItems();

    if (user.role === 'collegeAdmin') {
      fetchPendingSpotlight();
      fetchPendingArt();
    }
    if (user.role === 'teacher' || user.role === 'student') {
       fetchMySpotlightUploads();
       fetchMyArtUploads();
    }
  }, [user.role, fetchActiveContest, fetchTodaysWinner, fetchSpotlightPosts, fetchArtItems, fetchPendingSpotlight, fetchPendingArt, fetchMySpotlightUploads, fetchMyArtUploads]); // Add all fetch functions to dependency array

  // --- Handlers ---

  // Contest Handlers
  const handleCreateContest = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/community/contests', contestForm);
      setShowContestModal(false);
      setContestForm({ title: '', description: '', durationHours: 24 });
      fetchActiveContest(); // Refresh active contest
       fetchTodaysWinner(); // Refresh winner display in case old one is cleared
    } catch (err) {
       setError(err.response?.data?.message || 'Failed to create contest');
       console.error(err);
    }
  };

  const handleContestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!activeContest?._id || !contestSubmitForm.image) {
        setError('No active contest or image not selected.');
        return;
    }
    const formData = new FormData();
    formData.append('image', contestSubmitForm.image);

    try {
        await api.post(`/api/community/contests/${activeContest._id}/submit`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setShowContestSubmitModal(false);
        setContestSubmitForm({ image: null });
        fetchContestSubmissions(activeContest._id); // Refresh submissions
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit contest entry');
        console.error(err);
    }
  };

  const handleLikeToggle = async (submissionId) => {
      setError('');
      try {
          const { data } = await api.patch(`/api/community/submissions/${submissionId}/like`);
          // Update the state locally for immediate feedback
          setContestSubmissions(prevSubs =>
              prevSubs.map(sub =>
                  sub._id === submissionId
                      ? { ...sub, likeCount: data.likeCount, isLikedByUser: data.isLikedByUser }
                      : sub
              )
          );
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to update like status');
          console.error(err);
      }
  };


  // Spotlight Handlers
  const handleSpotlightUpload = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('description', spotlightForm.description);
    if (spotlightForm.image) {
        formData.append('image', spotlightForm.image);
    }

    try {
      await api.post('/api/community/spotlight/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowSpotlightModal(false);
      setSpotlightForm({ description: '', image: null });
      // Don't fetch all spotlight posts immediately, wait for approval
      fetchMySpotlightUploads(); // Refresh user's uploads list
       if (user.role === 'collegeAdmin') fetchPendingSpotlight(); // Admin sees pending immediately
    } catch (err) {
       setError(err.response?.data?.message || 'Failed to upload spotlight post');
       console.error(err);
    }
  };

  const handleSpotlightStatusUpdate = async (id, status, rejectionReason = '') => {
    setError('');
    try {
      await api.patch(`/api/community/spotlight/${id}/status`, { status, rejectionReason });
      fetchPendingSpotlight(); // Refresh pending list
      fetchSpotlightPosts(); // Refresh approved list
       fetchMySpotlightUploads(); // Refresh user's view if they uploaded it
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update spotlight status');
      console.error(err);
    }
  };


  // Art Gallery Handlers (Mostly Existing)
  const handleArtUpload = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('title', artUploadForm.title);
    formData.append('description', artUploadForm.description);
    formData.append('category', artUploadForm.category);
    formData.append('image', artUploadForm.image);

    if (!artUploadForm.image) {
        setError("Please select an image file.");
        return;
    }
    
    try {
      await api.post('/api/community/art-gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowArtUploadModal(false);
      setArtUploadForm({ title: '', description: '', category: 'Painting', image: null });
      // Don't fetch all art items immediately, wait for approval
      fetchMyArtUploads(); // Refresh user's uploads list
      if (user.role === 'collegeAdmin') fetchPendingArt(); // Admin sees pending immediately
    } catch (err) {
      setError(err.response?.data?.message ||'Failed to upload art item');
      console.error(err);
    }
  };

  const handleArtStatusUpdate = async (id, status, rejectionReason = '') => {
    setError('');
    try {
      await api.patch(`/api/community/art-gallery/${id}/status`, { status, rejectionReason });
      fetchPendingArt(); // Refresh pending list
      fetchArtItems(); // Refresh approved list
      fetchMyArtUploads(); // Refresh user's view if they uploaded it
    } catch (err) {
      setError(err.response?.data?.message ||'Failed to update art status');
      console.error(err);
    }
  };


  // --- Render Logic ---

  const isLoading = Object.values(loading).some(val => val === true);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Community Hub</h1>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
             {(user.role === 'teacher' || user.role === 'student') && (
                 <>
                    <button
                        onClick={() => setShowSpotlightModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                        title="Share a quick update (24h)"
                    >
                        <FaUpload className="mr-2" /> Post to Spotlight
                    </button>
                     <button
                        onClick={() => setShowArtUploadModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                         title="Upload permanent artwork"
                     >
                        <FaUpload className="mr-2" /> Upload Art
                    </button>
                 </>
             )}
            {user.role === 'collegeAdmin' && (
              <button
                onClick={() => setShowContestModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                title="Create a new daily contest"
                disabled={!!activeContest} // Disable if a contest is already active
              >
                <FaUpload className="mr-2" /> New Daily Contest
              </button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
           <div className="text-center py-10 text-gray-600">Loading community data...</div>
        )}

         {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
             <strong className="font-bold">Error: </strong>
             <span className="block sm:inline">{error}</span>
             <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError('')}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
             </span>
          </div>
        )}


        {/* --- Section 1: Daily Contest --- */}
        <section className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg shadow-md p-6">
           <h2 className="text-2xl font-semibold mb-4 text-green-800">Daily Contest</h2>

            {/* Winner Showcase */}
             {loading.winner && <div className="text-center text-gray-500">Loading winner info...</div>}
             {!loading.winner && todaysWinner && (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center shadow">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center justify-center gap-2">
                        <FaCrown className="text-yellow-500" /> Yesterday's Winner! <FaCrown className="text-yellow-500" />
                    </h3>
                    <img
                        src={todaysWinner.imageUrl}
                        alt="Winning Submission"
                        className="w-40 h-40 object-cover rounded-md mx-auto mb-2 border-2 border-yellow-400"
                    />
                    <p className="text-gray-700">
                         Congratulations to <span className="font-semibold">{todaysWinner.submittedBy?.name || 'Winner'}</span>!
                    </p>
                    {/* Add link to the specific winning post or contest if needed */}
                </div>
             )}
             {!loading.winner && !todaysWinner && (
                 <p className="text-center text-gray-500 mb-4">No winner to display currently.</p>
             )}


           {/* Active Contest Details */}
           {loading.contest && !activeContest && <div className="text-center text-gray-500">Loading contest...</div>}
           {!loading.contest && activeContest ? (
             <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
               <h3 className="text-xl font-bold mb-2">{activeContest.title}</h3>
               <p className="text-gray-700 mb-3">{activeContest.description}</p>
               <p className="text-sm text-gray-500">Ends: {new Date(activeContest.endDate).toLocaleString()}</p>
               {(user.role === 'teacher' || user.role === 'student') && (
                 <button
                    onClick={() => setShowContestSubmitModal(true)}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600"
                 >
                   Submit Your Entry
                 </button>
               )}
             </div>
           ) : (
              !loading.contest && <p className="text-center text-gray-600">No active contest right now. Check back later!</p>
           )}

            {/* Contest Submissions */}
            {!loading.contest && activeContest && contestSubmissions.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold mb-3">Entries:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {contestSubmissions.map((sub) => (
                        <div key={sub._id} className="border rounded-lg overflow-hidden bg-white shadow-sm relative group">
                            <img
                                src={sub.imageUrl}
                                alt={`Submission by ${sub.submittedBy?.name}`}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                            <p className="text-sm text-gray-600 mb-2">By: {sub.submittedBy?.name || 'Unknown User'}</p>
                            <button
                                onClick={() => handleLikeToggle(sub._id)}
                                className={`flex items-center space-x-1 text-sm ${sub.isLikedByUser ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                                disabled={!user} // Disable if not logged in
                            >
                                {sub.isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                                <span>{sub.likeCount} Like{sub.likeCount !== 1 ? 's' : ''}</span>
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            )}
            {!loading.contest && activeContest && contestSubmissions.length === 0 && (
                 <p className="text-center text-gray-500 mt-4">No submissions yet for this contest.</p>
            )}
        </section>

        {/* --- Section 2: Spotlight --- */}
        <section className="bg-purple-50 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-800">Spotlight (24hr Posts)</h2>
           {/* Display Approved Spotlight Posts */}
            {loading.spotlight && <div className="text-center text-gray-500">Loading spotlight...</div>}
           {!loading.spotlight && spotlightPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spotlightPosts.map((post) => (
                        <div key={post._id} className="border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                            {post.imageUrl && (
                                <img
                                src={post.imageUrl}
                                alt="Spotlight content"
                                className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4 flex-grow">
                                <p className="text-gray-800 mb-2">{post.description}</p>
                                <p className="text-sm text-gray-500 mt-auto pt-2">
                                By: {post.createdBy?.name || 'Unknown'}
                                </p>
                                {/* Optional: Show expiry time */}
                                {/* <p className="text-xs text-gray-400">Expires: {new Date(post.expiresAt).toLocaleTimeString()}</p> */}
                            </div>
                        </div>
                    ))}
                </div>
           ) : (
                !loading.spotlight && <p className="text-center text-gray-600">Nothing in the spotlight right now.</p>
           )}

           {/* Pending Spotlight (Admin View) */}
           {user.role === 'collegeAdmin' && (
             <div className="mt-8 pt-6 border-t">
               <h3 className="text-xl font-semibold mb-4 text-purple-700">Pending Spotlight Approvals</h3>
                {pendingSpotlight.length > 0 ? (
                    <div className="space-y-4">
                        {pendingSpotlight.map((item) => (
                            <div key={item._id} className="border rounded-lg p-4 bg-white flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt="Pending spotlight"
                                        className="w-full sm:w-24 h-24 object-cover rounded flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="text-gray-700">{item.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">By: {item.createdBy?.name}</p>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 self-center sm:self-auto">
                                    <button
                                        onClick={() => handleSpotlightStatusUpdate(item._id, 'approved')}
                                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                    >
                                        <FaCheck className="mr-1" /> Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            const reason = prompt('Enter rejection reason (optional):');
                                            // Prompt returns null if cancelled
                                            if (reason !== null) {
                                                handleSpotlightStatusUpdate(item._id, 'rejected', reason || 'Rejected without reason'); // Provide a default reason if none entered
                                            }
                                        }}
                                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <FaTimes className="mr-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No pending spotlight posts.</p>
                )}
             </div>
           )}

            {/* My Spotlight Uploads (Student/Teacher View) */}
            {(user.role === 'teacher' || user.role === 'student') && (
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4 text-purple-700">My Spotlight Posts</h3>
                    {mySpotlightUploads.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mySpotlightUploads.map((item) => (
                                <div key={item._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                                    {item.imageUrl && (
                                        <img
                                        src={item.imageUrl}
                                        alt="My spotlight upload"
                                        className="w-full h-40 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <p className="text-gray-700 mb-2">{item.description}</p>
                                        <p className={`text-sm font-medium mt-2 ${
                                            item.status === 'approved' ? 'text-green-600' :
                                            item.status === 'rejected' ? 'text-red-600' :
                                            'text-yellow-600'
                                        }`}>
                                            Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                             {item.status === 'approved' && item.expiresAt && new Date(item.expiresAt) > new Date() && ' (Live)'}
                                             {item.status === 'approved' && item.expiresAt && new Date(item.expiresAt) <= new Date() && ' (Expired)'}
                                        </p>
                                        {item.rejectionReason && (
                                            <p className="text-sm text-red-600 mt-1">Reason: {item.rejectionReason}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">You haven't posted anything to Spotlight yet.</p>
                    )}
                </div>
            )}
        </section>

        {/* --- Section 3: Art Gallery (Permanent) --- */}
        <section className="bg-blue-50 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Art Gallery</h2>

             {/* Display Approved Art */}
              {loading.artGallery && <div className="text-center text-gray-500">Loading art gallery...</div>}
             {!loading.artGallery && artItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artItems.map((item) => (
                    <div key={item._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-56 object-cover" // Slightly taller for art gallery
                        />
                        <div className="p-4">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                        <p className="text-sm text-gray-500 mt-2">Category: {item.category}</p>
                        <p className="text-sm text-gray-500 mt-1">By: {item.uploadedBy?.name || 'Unknown'}</p>
                        </div>
                    </div>
                    ))}
                </div>
             ): (
                 !loading.artGallery && <p className="text-center text-gray-600">The art gallery is empty.</p>
             )}

             {/* Pending Art (Admin View) */}
            {user.role === 'collegeAdmin' && (
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4 text-blue-700">Pending Art Approvals</h3>
                     {pendingArt.length > 0 ? (
                        <div className="space-y-4">
                            {pendingArt.map((item) => (
                                <div key={item._id} className="border rounded-lg p-4 bg-white flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                                    <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full sm:w-32 h-32 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                    <h3 className="font-semibold">{item.title} ({item.category})</h3>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">By: {item.uploadedBy?.name}</p>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0 self-center sm:self-auto">
                                        <button
                                            onClick={() => handleArtStatusUpdate(item._id, 'approved')}
                                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                        >
                                            <FaCheck className="mr-1" /> Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                const reason = prompt('Enter rejection reason:');
                                                if (reason) { // Only reject if reason is provided
                                                    handleArtStatusUpdate(item._id, 'rejected', reason);
                                                } else if (reason === '') {
                                                    alert('Rejection reason cannot be empty.');
                                                }
                                            }}
                                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                        >
                                            <FaTimes className="mr-1" /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : (
                          <p className="text-center text-gray-500">No pending art submissions.</p>
                     )}
                </div>
            )}

            {/* My Art Uploads (Student/Teacher View) */}
            {(user.role === 'teacher' || user.role === 'student') && (
                <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4 text-blue-700">My Art Uploads</h3>
                 {myArtUploads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myArtUploads.map((item) => (
                        <div key={item._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <p className={`text-sm font-medium mt-2 ${
                                item.status === 'approved' ? 'text-green-600' :
                                item.status === 'rejected' ? 'text-red-600' :
                                'text-yellow-600'
                            }`}>
                                Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </p>
                            {item.rejectionReason && (
                                <p className="text-sm text-red-600 mt-1">Reason: {item.rejectionReason}</p>
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                 ) : (
                     <p className="text-center text-gray-500">You haven't uploaded any art yet.</p>
                 )}
                </div>
            )}
        </section>


        {/* --- Modals --- */}

        {/* New Contest Modal (Admin) */}
        <UploadModal
            isOpen={showContestModal}
            onClose={() => setShowContestModal(false)}
            onSubmit={handleCreateContest}
            title="Create New Daily Contest"
        >
             <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                type="text"
                value={contestForm.title}
                onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description / Prompt</label>
                <textarea
                value={contestForm.description}
                onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                rows="3"
                required
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                <input
                type="number"
                value={contestForm.durationHours}
                onChange={(e) => setContestForm({ ...contestForm, durationHours: parseInt(e.target.value) || 24 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                 min="1"
                required
                />
             </div>
             <div className="flex justify-end space-x-3 pt-4">
                 <button type="button" onClick={() => setShowContestModal(false)} className="secondary-button">Cancel</button>
                <button type="submit" className="primary-button bg-green-600 hover:bg-green-700">Create Contest</button>
             </div>
        </UploadModal>

         {/* Contest Submission Modal (Students/Teachers) */}
        <UploadModal
            isOpen={showContestSubmitModal}
            onClose={() => setShowContestSubmitModal(false)}
            onSubmit={handleContestSubmit}
            title={`Submit to: ${activeContest?.title || 'Contest'}`}
        >
             <div>
                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input
                type="file"
                onChange={(e) => setContestSubmitForm({ image: e.target.files[0] })}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                accept="image/*"
                required
                />
                 {contestSubmitForm.image && <p className="text-xs text-gray-500 mt-1">Selected: {contestSubmitForm.image.name}</p>}
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowContestSubmitModal(false)} className="secondary-button">Cancel</button>
                <button type="submit" className="primary-button bg-green-600 hover:bg-green-700">Submit Entry</button>
             </div>
        </UploadModal>


         {/* Spotlight Upload Modal (Students/Teachers) */}
         <UploadModal
             isOpen={showSpotlightModal}
             onClose={() => setShowSpotlightModal(false)}
             onSubmit={handleSpotlightUpload}
             title="Post to Spotlight"
         >
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                value={spotlightForm.description}
                onChange={(e) => setSpotlightForm({ ...spotlightForm, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                rows="4"
                required
                maxLength={280} // Example limit
                placeholder="Share a quick update, thought, or moment..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Upload Image (Optional)</label>
                <input
                type="file"
                onChange={(e) => setSpotlightForm({ ...spotlightForm, image: e.target.files[0] })}
                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                accept="image/*"
                />
                {spotlightForm.image && <p className="text-xs text-gray-500 mt-1">Selected: {spotlightForm.image.name}</p>}
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                 <button type="button" onClick={() => setShowSpotlightModal(false)} className="secondary-button">Cancel</button>
                <button type="submit" className="primary-button bg-purple-600 hover:bg-purple-700">Post to Spotlight</button>
             </div>
         </UploadModal>

         {/* Art Gallery Upload Modal (Students/Teachers - Existing Logic) */}
         <UploadModal
            isOpen={showArtUploadModal}
            onClose={() => setShowArtUploadModal(false)}
            onSubmit={handleArtUpload}
            title="Upload Art to Gallery"
         >
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                    type="text"
                    value={artUploadForm.title}
                    onChange={(e) => setArtUploadForm({ ...artUploadForm, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                    value={artUploadForm.description}
                    onChange={(e) => setArtUploadForm({ ...artUploadForm, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                    value={artUploadForm.category}
                    onChange={(e) => setArtUploadForm({ ...artUploadForm, category: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                    type="file"
                    onChange={(e) => setArtUploadForm({ ...artUploadForm, image: e.target.files[0] })}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                    required
                    />
                     {artUploadForm.image && <p className="text-xs text-gray-500 mt-1">Selected: {artUploadForm.image.name}</p>}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setShowArtUploadModal(false)} className="secondary-button">Cancel</button>
                    <button type="submit" className="primary-button bg-blue-600 hover:bg-blue-700">Upload Art</button>
                </div>
         </UploadModal>

      </div> 
    </DashboardLayout>
  );
};

export default Community;

// Add these base styles to your global CSS (e.g., index.css) if you don't have similar ones:
/*
.primary-button {
    @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.secondary-button {
    @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}
*/