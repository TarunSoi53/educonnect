import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartBar, FaCheckCircle, FaClock, FaUsers } from 'react-icons/fa'; // Example icons
import { useNavigate } from 'react-router-dom'; // Import if using React Router
import DashboardLayout from '../../components/DashboardLayout';
import { useCallback } from 'react';
import api from '../../utils/api';
import { Link, useLocation } from 'react-router-dom';


// Placeholder for illustrations
const StatsIllustration = () => <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 text-2xl">📊</div>;
const QuizIllustration = () => <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-lg">📝</div>;
const PerformanceIllustration = () => <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-2xl">📈</div>;

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

const statVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, delayChildren: 0.2, staggerChildren: 0.1 } },
};

const statItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

function ClassDashboard() {
  const [stats, setStats] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [pastPerformances, setPastPerformances] = useState([]);
  const navigate = useNavigate(); // If using React Router


 const fetchQuizesData =async () => {
    try {
   const questionList = await api.get('/api/quizzes/quizlist/section/');
    console.log("questionList",questionList.data)
    setUpcomingQuizzes(questionList.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  

 }
 const handleQuizClick = (quiz) => {
  if (quiz.status === 'active' || quiz.status === 'completed') {
    navigate('/student/quizSession', { state: { quizId: quiz._id } });
  } else {
    // Optionally, provide feedback to the user that the quiz is not yet active
    console.log(`Quiz "${quiz.title}" is ${quiz.status} and cannot be accessed yet.`);
    // You could also display a message to the user here.
  }
};



  useEffect(() => {
    // Simulate fetching data from an API
    const fetchDashboardData = async () => {
      // Replace with your actual API calls
      const statsData = [
        { label: 'Total Quizzes', value: 120, icon: FaClock },
        { label: 'Completed Quizzes', value: 95, icon: FaCheckCircle },
        { label: 'Average Score', value: '82%', icon: FaChartBar },
        { label: 'Active Users', value: 450, icon: FaUsers },
      ];

     

      const performanceData = [
        { label: 'Last Week', value: 'Average Score: 78%' },
        { label: 'Last Month', value: 'Completed Quizzes: 35' },
        { label: 'Overall', value: 'Top Score: 95%' },
      ];

      // Simulate a loading delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats(statsData);
      setUpcomingQuizzes(quizzesData);
      setPastPerformances(performanceData);
    };

    fetchQuizesData();
    fetchDashboardData();
  }, []);



  return (
    <DashboardLayout>
    <motion.div
      className="bg-gray-100 min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        {/* First Section: Animated Stats Boxes with Icons and Illustration */}
        <section className="mb-10">
          <motion.div
            className="flex items-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <StatsIllustration />
            <h2 className="text-2xl font-semibold text-gray-800 ml-4">Dashboard Overview</h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={statVariants} initial="initial" animate="animate">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 text-center flex flex-col justify-center items-center hover:shadow-xl transition duration-300"
                variants={statItemVariants}
              >
                <div className="text-4xl text-indigo-500 mb-2">
                  <stat.icon />
                </div>
                <div className="text-3xl font-bold text-gray-700">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Second Section: Animated Upcoming Quizzes with Hover Effect and Illustration */}
        <section className="mb-10">
          <motion.div
            className="flex items-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <QuizIllustration />
            <h2 className="text-2xl font-semibold text-gray-800 ml-4">Upcoming Quizzes</h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <AnimatePresence>
    {upcomingQuizzes
      .slice() // Create a copy to avoid modifying the original array
      .sort((a, b) => {
        // Custom sorting logic
        if (a.status === 'active' && b.status !== 'active') {
          return -1; // 'active' comes before others
        }
        if (a.status !== 'active' && b.status === 'active') {
          return 1; // 'active' comes before others
        }
        if (a.status === 'pending' && b.status !== 'pending' && b.status !== 'active') {
          return -1; // 'pending' comes before 'completed'
        }
        if (a.status !== 'pending' && a.status !== 'active' && b.status === 'pending') {
          return 1; // 'pending' comes before 'completed'
        }
        return 0; // Maintain original order for items with the same priority
      })
      .map((quiz) => (
        <motion.div
          key={quiz._id}
          className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between cursor-pointer"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover={quiz.status === 'active' ? 'hover' : {}}
          onClick={() => handleQuizClick(quiz)}
          transition={{ layout: { duration: 0.3 } }}
        >
            {/* <Link
      to={'/student/quizSession'}
        > */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">{quiz.title}</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  quiz.status === 'active'
                    ? 'bg-green-200 text-green-700'
                    : quiz.status === 'completed'
                    ? 'bg-blue-200 text-blue-700'
                    : 'bg-red-200 text-red-700'
                }`}
              >
                {quiz.status}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teacher: {quiz.teacher}</p>
          </div>
        
   
    
    {/* </Link> */}
        </motion.div>
      ))}
  </AnimatePresence>
</motion.div>
        </section>

        {/* Third Section: Animated Past Performances with Illustration */}
        <section>
          <motion.div
            className="flex items-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <PerformanceIllustration />
            <h2 className="text-2xl font-semibold text-gray-800 ml-4">Past Performances</h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={statVariants} initial="initial" animate="animate">
            {pastPerformances.map((performance, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300"
                variants={statItemVariants}
              >
                <div className="text-2xl font-bold text-blue-500">{performance.value}</div>
                <div className="text-gray-600">{performance.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </motion.div>
    </DashboardLayout>
  );
}

export default ClassDashboard;