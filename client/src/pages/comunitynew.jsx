import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaCheck,
  FaTimes,
  FaHeart,
  FaRegHeart,
  FaCrown,
  FaAngleLeft,
  FaAngleRight,
  FaEllipsisH,
} from "react-icons/fa";
import api from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";
import useAuthStore from "../store/useAuthStore";

// --- Helper Component for Upload Modal ---
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

// --- Spotlight Story Component ---
const SpotlightStory = ({ posts, onViewStory }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
      {posts.map((post) => (
        <motion.div
          key={post._id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex-shrink-0 cursor-pointer"
          onClick={() => onViewStory(post)}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 p-0.5">
            <div className="bg-white dark:bg-gray-900 w-full h-full rounded-full p-0.5">
              <img
                src={post.postUrl || `/api/placeholder/150/150`}
                alt={post.description}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-700 dark:text-gray-300 truncate w-20">
            {post.createdBy?.name || "User"}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// --- Story Viewer Component ---
const StoryViewer = ({ story, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (hasNext) onNext();
          return 0;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [story, hasNext, onNext]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-700">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center">
        <div className="flex items-center flex-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 p-0.5">
            <div className="bg-black w-full h-full rounded-full p-0.5">
              <img
                src={story.postUrl || `/api/placeholder/32/32`}
                alt="User"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="ml-2 text-white font-medium">
            {story.createdBy?.name || "User"}
          </span>
          <span className="ml-2 text-gray-400 text-sm">
            {new Date(story.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <button onClick={onClose} className="text-white text-2xl">
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center relative">
        {story.postUrl && (
          <img
            src={story.postUrl}
            alt="Story"
            className="max-h-full max-w-full object-contain"
          />
        )}

        <div className="absolute bottom-10 w-full px-6">
          <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <p>{story.description}</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute inset-0 flex">
          {hasPrev && (
            <div
              className="w-1/3 h-full cursor-pointer flex items-center justify-start px-4"
              onClick={onPrev}
            >
              <FaAngleLeft className="text-white text-3xl opacity-70" />
            </div>
          )}
          {hasNext && (
            <div
              className="w-1/3 h-full ml-auto cursor-pointer flex items-center justify-end px-4"
              onClick={onNext}
            >
              <FaAngleRight className="text-white text-3xl opacity-70" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


const ArtPost = ({ art, onLike }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center p-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
          <div className="bg-white dark:bg-gray-900 w-full h-full rounded-full p-0.5">
            <img
              src={`/api/placeholder/32/32`}
              alt={art.uploadedBy?.name || "User"}
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <div className="ml-2 flex-1">
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {art.uploadedBy?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {art.category}
          </p>
        </div>
        <button className="text-gray-500 dark:text-gray-400">
          <FaEllipsisH />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
        <img
          src={art.postUrl || `/api/placeholder/600/600`}
          alt={art.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <motion.button
            className="text-2xl mr-4"
            whileTap={{ scale: 1.4 }}
            onClick={() => onLike && onLike(art._id)}
          >
            {art.isLikedByUser ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-800 dark:text-gray-200" />
            )}
          </motion.button>
          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            {art.likeCount || 0} likes
          </span>
        </div>

        {/* Caption */}
        <div>
          <p className="text-gray-900 dark:text-white">
            <span className="font-bold mr-1">{art.title}</span>
            <span className="text-gray-700 dark:text-gray-300">
              {art.description}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Premium Contest Card Component ---
const ContestCard = ({ contest, winner, submissions, onSubmit, onLike }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Contest Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="p-8 relative z-10">
          <div className="bg-yellow-500 text-black font-bold text-xs uppercase tracking-wider px-2 py-1 rounded-full inline-flex items-center mb-2">
            <FaCrown className="mr-1" /> Daily Contest
          </div>
          <h3 className="text-3xl font-extrabold mb-2">
            {contest?.title || "Daily Challenge"}
          </h3>
          <p className="text-gray-300 mb-3">
            {contest?.description || "No active contest"}
          </p>
          {contest && (
            <div className="text-sm text-yellow-300 font-medium">
              Ends: {new Date(contest.endDate).toLocaleString()}
            </div>
          )}
          {!contest && (
            <div className="text-sm text-gray-400">
              No active contest right now. Check back later!
            </div>
          )}
        </div>
      </div>

      {/* Winner Section */}
      {winner && (
        <motion.div
          className="px-8 pt-2 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="h-1 flex-grow bg-gradient-to-r from-yellow-500 to-amber-500"></div>
            <h4 className="mx-4 text-xl font-bold text-yellow-400 flex items-center">
              <FaCrown className="mr-2" /> WINNER
            </h4>
            <div className="h-1 flex-grow bg-gradient-to-l from-yellow-500 to-amber-500"></div>
          </div>

          <div className="mt-4 flex items-center">
            <div className="w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden">
              <img
                src={winner.imageUrl}
                alt="Winner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <p className="font-bold">
                {winner.submittedBy?.name || "Winner"}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(winner.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      {contest && onSubmit && (
        <div className="px-8 pb-6">
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
          >
            <FaUpload className="mr-2" /> Submit Your Entry
          </motion.button>
        </div>
      )}

      {/* Submissions */}
      {contest && submissions && submissions.length > 0 && (
        <div className="px-8 pb-8">
          <h4 className="text-lg font-bold mb-4">Entries</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {submissions.map((sub) => (
              <motion.div
                key={sub._id}
                className="relative rounded-lg overflow-hidden bg-gray-700 group"
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <img
                  src={sub.imageUrl}
                  alt={`Submission by ${sub.submittedBy?.name}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <p className="text-xs text-white">
                    {sub.submittedBy?.name || "Unknown"}
                  </p>
                  <button
                    onClick={() => onLike(sub._id)}
                    className="flex items-center space-x-1 text-xs mt-1"
                  >
                    {sub.isLikedByUser ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-white" />
                    )}
                    <span className="text-white">{sub.likeCount}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- Admin Review Card Component ---
const ReviewCard = ({ item, type, onApprove, onReject }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sm:w-32 h-32 bg-gray-200 dark:bg-gray-700">
        <img
          src={type === "spotlight" ? item.postUrl : item.postUrl}
          alt={type === "art" ? item.title : "Pending item"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1">
        {type === "art" && (
          <h3 className="font-bold text-gray-900 dark:text-white">
            {item.title}
          </h3>
        )}
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
          {type === "art" ? item.description : item.description}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
          By: {item.createdBy?.name || item.uploadedBy?.name || "Unknown"}
        </p>
        {type === "art" && (
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Category: {item.category}
          </p>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-3 flex sm:flex-col justify-between gap-2">
        <motion.button
          onClick={() => onApprove(item._id)}
          className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCheck className="mr-1" /> Approve
        </motion.button>
        <motion.button
          onClick={() => onReject(item._id)}
          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTimes className="mr-1" /> Reject
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Main Community Component ---
const CommunityNew = () => {
  const { user } = useAuthStore();

  // --- State ---
  // General
  const [loading, setLoading] = useState({
    contest: true,
    spotlight: true,
    artGallery: true,
    winner: true,
  });
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Story Viewer State
  const [activeStory, setActiveStory] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);

  // Contest State
  const [activeContest, setActiveContest] = useState(null);
  const [contestSubmissions, setContestSubmissions] = useState([]);
  const [todaysWinner, setTodaysWinner] = useState(null);
  const [showContestModal, setShowContestModal] = useState(false);
  const [showContestSubmitModal, setShowContestSubmitModal] = useState(false);
  const [contestForm, setContestForm] = useState({
    title: "",
    description: "",
    durationHours: 24,
  });
  const [contestSubmitForm, setContestSubmitForm] = useState({ image: null });

  // Spotlight State
  const [spotlightPosts, setSpotlightPosts] = useState([]);
  const [pendingSpotlight, setPendingSpotlight] = useState([]);
  const [mySpotlightUploads, setMySpotlightUploads] = useState([]);
  const [showSpotlightModal, setShowSpotlightModal] = useState(false);
  const [spotlightForm, setSpotlightForm] = useState({
    description: "",
    image: null,
  });

  // Art Gallery State
  const [artItems, setArtItems] = useState([]);
  const [pendingArt, setPendingArt] = useState([]);
  const [myArtUploads, setMyArtUploads] = useState([]);
  const [showArtUploadModal, setShowArtUploadModal] = useState(false);
  const [artUploadForm, setArtUploadForm] = useState({
    title: "",
    description: "",
    category: "Painting",
    image: null,
  });

  // --- Toggle dark mode ---
  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);

    // Apply class to body
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  // --- Data Fetching Functions ---
  const fetchActiveContest = useCallback(async () => {
    setLoading((prev) => ({ ...prev, contest: true }));
    try {
      const { data } = await api.get("/api/community/contests/active");
      setActiveContest(data);
      if (data) {
        fetchContestSubmissions(data._id); // Fetch submissions if contest exists
      } else {
        setContestSubmissions([]); // Clear submissions if no active contest
        setLoading((prev) => ({ ...prev, contest: false }));
      }
    } catch (err) {
      setError("Failed to fetch active contest");
      console.error(err);
      setLoading((prev) => ({ ...prev, contest: false }));
    }
  }, []); // Empty dependency array, doesn't depend on external state changes directly

  const fetchContestSubmissions = useCallback(async (contestId) => {
    // setLoading(prev => ({ ...prev, contest: true })); // Already handled by fetchActiveContest
    try {
      const { data } = await api.get(
        `/api/community/contests/${contestId}/submissions`
      );
      setContestSubmissions(data);
    } catch (err) {
      setError("Failed to fetch contest submissions");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, contest: false }));
    }
  }, []);

  const fetchTodaysWinner = useCallback(async () => {
    setLoading((prev) => ({ ...prev, winner: true }));
    try {
      const { data } = await api.get("/api/community/contests/winner");
      setTodaysWinner(data);
    } catch (err) {
      setError("Failed to fetch contest winner");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, winner: false }));
    }
  }, []);

  const fetchSpotlightPosts = useCallback(async () => {
    setLoading((prev) => ({ ...prev, spotlight: true }));
    try {
      const { data } = await api.get("/api/community/spotlight/");
      setSpotlightPosts(data);
    } catch (err) {
      setError("Failed to fetch spotlight posts");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, spotlight: false }));
    }
  }, []);

  const fetchPendingSpotlight = useCallback(async () => {
    // setLoading(prev => ({ ...prev, spotlight: true })); // Optional separate loading
    try {
      const { data } = await api.get("/api/community/spotlight/pending");
      setPendingSpotlight(data);
    } catch (err) {
      setError("Failed to fetch pending spotlight");
      console.error(err);
    }
    // setLoading(prev => ({ ...prev, spotlight: false }));
  }, []);

  const fetchMySpotlightUploads = useCallback(async () => {
    // setLoading(prev => ({ ...prev, spotlight: true })); // Optional separate loading
    try {
      const { data } = await api.get("/api/community/spotlight/my-uploads");
      setMySpotlightUploads(data);
    } catch (err) {
      setError("Failed to fetch your spotlight uploads");
      console.error(err);
    }
    // setLoading(prev => ({ ...prev, spotlight: false }));
  }, []);

  const fetchArtItems = useCallback(async () => {
    setLoading((prev) => ({ ...prev, artGallery: true }));
    try {
      const { data } = await api.get("/api/community/artgallery/");
      setArtItems(data);
    } catch (err) {
      setError("Failed to fetch art gallery items");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, artGallery: false }));
    }
  }, []);

  const fetchPendingArt = useCallback(async () => {
    // setLoading(prev => ({ ...prev, artGallery: true }));
    try {
      const { data } = await api.get("/api/community/artgallery/pending");
      setPendingArt(data);
    } catch (err) {
      setError("Failed to fetch pending art items");
      console.error(err);
    }
    // setLoading(prev => ({ ...prev, artGallery: false }));
  }, []);

  const fetchMyArtUploads = useCallback(async () => {
    // setLoading(prev => ({ ...prev, artGallery: true }));
    try {
      const { data } = await api.get("/api/community/artgallery/my-uploads");
      setMyArtUploads(data);
    } catch (err) {
      setError("Failed to fetch your art uploads");
      console.error(err);
    }
    // setLoading(prev => ({ ...prev, artGallery: false }));
  }, []);

  // --- Initial Data Fetching Effect ---
  useEffect(() => {
    setError(""); // Clear errors on initial load or user change
    fetchActiveContest();
    fetchTodaysWinner();
    fetchSpotlightPosts();
    fetchArtItems();

    if (user.role === "collegeAdmin") {
      fetchPendingSpotlight();
      fetchPendingArt();
    }
    if (user.role === "teacher" || user.role === "student") {
      fetchMySpotlightUploads();
      fetchMyArtUploads();
    }
  }, [
    user.role,
    fetchActiveContest,
    fetchTodaysWinner,
    fetchSpotlightPosts,
    fetchArtItems,
    fetchPendingSpotlight,
    fetchPendingArt,
    fetchMySpotlightUploads,
    fetchMyArtUploads,
  ]); // Add all fetch functions to dependency array

  // --- Handlers ---

  // Contest Handlers
  const handleCreateContest = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/community/contests", contestForm);
      setShowContestModal(false);
      setContestForm({ title: "", description: "", durationHours: 24 });
      fetchActiveContest(); // Refresh active contest
      fetchTodaysWinner(); // Refresh winner display in case old one is cleared
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create contest");
      console.error(err);
    }
  };

  const handleContestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!activeContest?._id || !contestSubmitForm.image) {
      setError("No active contest or image not selected.");
      return;
    }
    const formData = new FormData();
    formData.append("image", contestSubmitForm.image);

    try {
      await api.post(
        `/api/community/contests/${activeContest._id}/submit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setShowContestSubmitModal(false);
      setContestSubmitForm({ image: null });
      fetchContestSubmissions(activeContest._id); // Refresh submissions
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit contest entry");
      console.error(err);
    }
  };

  const handleLikeToggle = async (submissionId) => {
    setError("");
    try {
      const { data } = await api.patch(
        `/api/community/submissions/${submissionId}/like`
      );
      // Update the state locally for immediate feedback
      setContestSubmissions((prevSubs) =>
        prevSubs.map((sub) =>
          sub._id === submissionId
            ? {
                ...sub,
                likeCount: data.likeCount,
                isLikedByUser: data.isLikedByUser,
              }
            : sub
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update like status");
      console.error(err);
    }
  };

  // Spotlight Handlers
  const handleSpotlightUpload = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("description", spotlightForm.description);
    if (spotlightForm.image) {
      formData.append("Spotlight", spotlightForm.image);
    }

    try {
      await api.post("/api/community/spotlight/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowSpotlightModal(false);
      setSpotlightForm({ description: "", image: null });
      // Don't fetch all spotlight posts immediately, wait for approval
      fetchMySpotlightUploads(); // Refresh user's uploads list
      if (user.role === "collegeAdmin") fetchPendingSpotlight(); // Admin sees pending immediately
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to upload spotlight post"
      );
      console.error(err);
    }
  };



  const handleSpotlightStatusUpdate = async (
    id,
    status,
    rejectionReason = ""
  ) => {
    setError("");
    try {
      await api.patch(`/api/community/spotlight/${id}/status`, {
        status,
        rejectionReason,
      });
      fetchPendingSpotlight(); // Refresh pending list
      fetchSpotlightPosts(); // Refresh approved list
      fetchMySpotlightUploads(); // Refresh user's view if they uploaded it
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update spotlight status"
      );
      console.error(err);
    }
  };

  // Art Gallery Handlers (Mostly Existing)
  const handleArtUpload = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("title", artUploadForm.title);
    formData.append("description", artUploadForm.description);
    formData.append("category", artUploadForm.category);
    formData.append("artgallery", artUploadForm.image);

    if (!artUploadForm.image) {
      setError("Please select an image file.");
      return;
    }

    try {
      await api.post("/api/community/artgallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowArtUploadModal(false);
      setArtUploadForm({
        title: "",
        description: "",
        category: "Painting",
        image: null,
      });
      // Don't fetch all art items immediately, wait for approval
      fetchMyArtUploads(); // Refresh user's uploads list
      if (user.role === "collegeAdmin") fetchPendingArt(); // Admin sees pending immediately
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload art item");
      console.error(err);
    }
  };

  const handleArtStatusUpdate = async (id, status, rejectionReason = "") => {
    setError("");
    try {
      await api.patch(`/api/community/artgallery/${id}/status`, {
        status,
        rejectionReason,
      });
      fetchPendingArt(); // Refresh pending list
      fetchArtItems(); // Refresh approved list
      fetchMyArtUploads(); // Refresh user's view if they uploaded it
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update art status");
      console.error(err);
    }
  };

  // Include all other fetch functions from the original...

  // --- Initial Data Fetching Effect ---
  useEffect(() => {
    setError("");
    fetchActiveContest();
    fetchTodaysWinner();
    fetchSpotlightPosts();
    // Include all other fetches from the original
  }, [fetchActiveContest, fetchTodaysWinner, fetchSpotlightPosts]);

  // --- Story Navigation Handlers ---
  const handleViewStory = (story) => {
    setActiveStory(story);
    setStoryIndex(spotlightPosts.findIndex((p) => p._id === story._id));
  };

  const handleNextStory = () => {
    if (storyIndex < spotlightPosts.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setActiveStory(spotlightPosts[storyIndex + 1]);
    } else {
      setActiveStory(null); // Close if at the end
    }
  };

  const handlePrevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
      setActiveStory(spotlightPosts[storyIndex - 1]);
    }
  };

  // --- Other Handlers ---
  // Same handlers as the original component

  return (
    <DashboardLayout darkMode={darkMode}>
      <div
        className={`min-h-screen transition-colors duration-200 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="container mx-auto p-4 md:p-6 space-y-8">
          {/* Page Header */}
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Community Hub
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {(user.role === "teacher" || user.role === "student") && (
                <>
                  <motion.button
                    onClick={() => setShowSpotlightModal(true)}
                    className="inline-flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUpload className="mr-2" /> Add to Story
                  </motion.button>
                  <motion.button
                    onClick={() => setShowArtUploadModal(true)}
                    className="inline-flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUpload className="mr-2" /> New Post
                  </motion.button>
                </>
              )}
              {user.role === "collegeAdmin" && (
                <motion.button
                  onClick={() => setShowContestModal(true)}
                  className="inline-flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!!activeContest}
                >
                  <FaUpload className="mr-2" /> New Contest
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative"
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError("")}
                >
                  <svg
                    className="fill-current h-6 w-6 text-red-500"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spotlight Stories Section */}
          <section className="pb-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Spotlight
              </h2>
              {user.role !== "collegeAdmin" && (
                <button
                  onClick={() => setShowSpotlightModal(true)}
                  className="text-sm text-purple-600 dark:text-purple-400 font-medium"
                >
                  Add New spotlight
                </button>
              )}
            </div>

            {loading.spotlight ? (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : spotlightPosts.length > 0 ? (
              <SpotlightStory
                posts={spotlightPosts}
                onViewStory={handleViewStory}
              />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No stories available
              </p>
            )}
          </section>
          {user.role === "collegeAdmin" && pendingSpotlight.length > 0 && (
  <motion.div
    className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <h3 className="text-xl font-semibold mb-6 text-purple-500">
      Pending Spotlight Approvals
    </h3>
    <div className="space-y-4">
      {pendingSpotlight.map((item) => (
        <ReviewCard
          key={item._id}
          item={item}
          type="spotlight"
          onApprove={(id) => handleSpotlightStatusUpdate(id, "approved")}
          onReject={(id) => {
            const reason = prompt("Rejection reason:");
            if (reason !== null) {
              handleSpotlightStatusUpdate(id, "rejected", reason);
            }
          }}
        />
      ))}
    </div>
  </motion.div>
)}

          {/* Daily Contest Section */}
          <section className="pt-4">
            <ContestCard
              contest={activeContest}
              winner={todaysWinner}
              submissions={contestSubmissions}
              onSubmit={() => setShowContestSubmitModal(true)}
              onLike={handleLikeToggle}
            />
          </section>

        
          <section className="pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Art Gallery
              </h2>
              {(user.role === "teacher" || user.role === "student") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowArtUploadModal(true)}
                  className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full"
                >
                  <FaUpload className="mr-2" /> New Post
                </motion.button>
              )}
            </div>

            {/* Approved Art Grid */}
            {loading.artGallery ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : artItems.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                layout
              >
                <AnimatePresence>
                  {artItems.map((art) => (
                    <ArtPost
                      key={art._id}
                      art={art}
                      onLike={handleLikeToggle}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No art posts yet. Be the first to share!
              </div>
            )}

            {/* Pending Approvals (Admin) */}
            {user.role === "collegeAdmin" && pendingArt.length > 0 && (
              <motion.div
                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-semibold mb-6 text-blue-500">
                  Pending Approvals
                </h3>
                <div className="space-y-4">
                  {pendingArt.map((item) => (
                    <ReviewCard
                      key={item._id}
                      item={item}
                      type="art"
                      onApprove={(id) => handleArtStatusUpdate(id, "approved")}
                      onReject={(id) => {
                        const reason = prompt("Rejection reason:");
                        if (reason !== null) {
                          handleArtStatusUpdate(id, "rejected", reason);
                        }
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* My Art Uploads */}
            {(user.role === "teacher" || user.role === "student") && (
              <motion.div
                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-semibold mb-6 text-blue-500">
                  My Posts
                </h3>
                {myArtUploads.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {myArtUploads.map((art) => (
                      <motion.div
                        key={art._id}
                        className="relative aspect-square group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={art.postUrl}
                          alt={art.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <span
                            className={`text-sm font-medium ${
                              art.status === "approved"
                                ? "text-green-400"
                                : art.status === "rejected"
                                ? "text-red-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {art.status.charAt(0).toUpperCase() +
                              art.status.slice(1)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    You haven't posted any art yet.
                  </div>
                )}
              </motion.div>
            )}
          </section>

          {/* Story Viewer Modal */}
          <AnimatePresence>
            {activeStory && (
              <StoryViewer
                story={activeStory}
                onClose={() => setActiveStory(null)}
                onNext={handleNextStory}
                onPrev={handlePrevStory}
                hasNext={storyIndex < spotlightPosts.length - 1}
                hasPrev={storyIndex > 0}
              />
            )}
          </AnimatePresence>
          {/* Spotlight Upload Modal */}
<UploadModal
  isOpen={showSpotlightModal}
  onClose={() => setShowSpotlightModal(false)}
  onSubmit={handleSpotlightUpload}
  title="Create New Story"
>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Story Description
      </label>
      <textarea
        value={spotlightForm.description}
        onChange={(e) => 
          setSpotlightForm({...spotlightForm, description: e.target.value})
        }
        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        rows="3"
        placeholder="What's happening?"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Upload Image
      </label>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer"
      >
        <input
          type="file"
          onChange={(e) => 
            setSpotlightForm({...spotlightForm, image: e.target.files[0]})
          }
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
        {spotlightForm.image ? (
          <img
            src={URL.createObjectURL(spotlightForm.image)}
            alt="Preview"
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="text-center p-4">
            <FaUpload className="text-3xl text-gray-400 mb-2 mx-auto" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Drag or click to upload
            </p>
          </div>
        )}
      </motion.div>
    </div>

    <div className="flex justify-end space-x-3 pt-4">
      <motion.button
        type="button"
        onClick={() => setShowSpotlightModal(false)}
        className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        whileHover={{ scale: 1.05 }}
      >
        Cancel
      </motion.button>
      <motion.button
        type="submit"
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
        whileHover={{ scale: 1.05 }}
      >
        Post to Spotlight
      </motion.button>
    </div>
  </div>
</UploadModal>

          {/* Art Upload Modal */}
          <UploadModal
            isOpen={showArtUploadModal}
            onClose={() => setShowArtUploadModal(false)}
            onSubmit={handleArtUpload}
            title="Create New Post"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={artUploadForm.title}
                  onChange={(e) =>
                    setArtUploadForm({
                      ...artUploadForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={artUploadForm.description}
                  onChange={(e) =>
                    setArtUploadForm({
                      ...artUploadForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={artUploadForm.category}
                  onChange={(e) =>
                    setArtUploadForm({
                      ...artUploadForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Digital Art">Digital Art</option>
                  
                  <option value="Other">achivement</option>
                  <option value="Other">creation</option>
                  <option value="Other">winning</option>
                  <option value="Other">events</option>
                  <option value="Photography">Photography</option>
                  <option value="Painting">Painting</option>
              
                  <option value="Other">Other</option>
                 
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload Image
                </label>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative  bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) =>
                      setArtUploadForm({
                        ...artUploadForm,
                        image: e.target.files[0],
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    required
                  />
                  {artUploadForm.image ? (
                    <img
                      src={URL.createObjectURL(artUploadForm.image)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FaUpload className="text-3xl text-gray-400 mb-2 mx-auto" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Click to upload your artwork
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowArtUploadModal(false)}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  Post to Gallery
                </motion.button>
              </div>
            </div>
          </UploadModal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityNew;
