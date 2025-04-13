
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../utils/api';
import { useLocation } from 'react-router-dom';


const QuizSessionPage = () => {
  const location = useLocation(); // Get the location object
  const quizId = location.state?.quizId;
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
   const [submissionResult, setSubmissionResult] = useState(null);

  // Timer useEffect
  useEffect(() => {
    let timer;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);


  const fetchQuestions = async (quizId) => {
 try{
   console.log("quizId",quizId)
    const response = await api.get(`/api/quizzes/${quizId.toString()}`);
    setQuestions(response.data.quizQuestions);
    setQuizStarted(true); // Start the quiz when questions are fetched
  }
  catch (error) {
    console.error('Error fetching questions:', error);
  }

 }


  

  // Mock API call to fetch questions
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchQuestions = async () => {
    //   const mockQuestions = [
    //     {
    //       id: 1,
    //       text: "What is the capital of France?",
    //       options: ["London", "Paris", "Berlin", "Madrid"],
    //       correctAnswer: 1
    //     },
    //     // Add more mock questions...
    //   ];
    //   setQuestions(mockQuestions);
    // };
    fetchQuestions(quizId);
  }, [quizId]);

  const handleTimeExpired = () => {
    setQuizCompleted(true);
    // TODO: Handle auto-submission
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const getSelectedAnswerText = (questionIndex) => {
    const selectedIndex = selectedAnswers[questionIndex];
    return selectedIndex !== undefined && questions[questionIndex]?.options ? questions[questionIndex].options[selectedIndex] : undefined;
  };

  const getCorrectAnswerText = (questionIndex) => {
    const correctAnswerIndex = questions[questionIndex]?.correctAnswer;
    return correctAnswerIndex !== undefined && questions[questionIndex]?.options ? questions[questionIndex].options[correctAnswerIndex] : undefined;
  };

  const calculateScore = () => {
    let score = 0;
    const answersWithCorrectness = questions.map((question, index) => {
      const selected = selectedAnswers[index];
      const isCorrect = selected !== undefined && String(selected) === String(question.correctAnswer); // Compare as strings
      if (isCorrect) {
        score++;
      }
      return {
        questionId: question._id, // Assuming your question object has an _id
        selectedAnswer: getSelectedAnswerText(index),
        correctAnswer: getCorrectAnswerText(index),
        isCorrect: isCorrect,
      };
    });
    return { score, answersWithCorrectness };
  };

  const handleSubmitQuiz = async () => {
    if (submissionLoading || quizCompleted) return;

    setSubmissionLoading(true);
    const { score, answersWithCorrectness } = calculateScore();
    const timeTaken = 600 - timeLeft; // Calculate time taken

    try {
      const response = await api.post('/api/quizzes/submitQuiz', {
        quizId: quizId,
        
        quizAnswers: answersWithCorrectness.map(ans => ({
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect: ans.isCorrect,
        })),
        score: score,
      
        timeTaken: timeTaken,
      });
      setSubmissionResult(response.data);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
     
    } finally {
      setSubmissionLoading(false);
    }
  };

  // Calculate quiz stats
  const attemptedQuestions = selectedAnswers.filter(a => a !== undefined).length;
  const remainingQuestions = questions.length - attemptedQuestions;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Remove unused startQuiz function
  // Calculate quiz stats
  

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* Quiz Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Quiz Session</h1>
        <div className="flex justify-between items-center mt-4">
          <div className="text-green-300 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className={`text-xl font-bold ${
            timeLeft > 30 ? 'text-green-400' : 'text-red-400 animate-pulse'
          }`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </header>

      {/* Main Quiz Content */}
      <div className="flex gap-6">
        {/* Questions Section */}
        <div className="flex-1 bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-6">
                {questions[currentQuestionIndex]?.question}
              </h2>
              
              <div className="space-y-4">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'bg-indigo-100 border-2 border-indigo-500 shadow-sm'
                        : 'bg-white hover:bg-gray-50 border border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-white bg-white'
                          : 'border-gray-300'
                      }`} />
                      {option}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-6 py-2 rounded-lg ${
                currentQuestionIndex === questions.length - 1
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="w-72 bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-indigo-700">Quiz Stats</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300">Attempted</h4>
              <p className="text-2xl font-bold text-green-400">{attemptedQuestions}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300">Remaining</h4>
              <p className="text-2xl font-bold text-yellow-400">{remainingQuestions}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-300">Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <motion.div 
                  className="bg-indigo-500 h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(attemptedQuestions / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div>
            <button
            onClick={handleSubmitQuiz}
            disabled={submissionLoading || quizCompleted}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white shadow-md focus:outline-none focus-ring-2 focus-ring-indigo-500 focus-ring-offset-2 ${
              submissionLoading || quizCompleted
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {submissionLoading ? 'Submitting...' : 'Submit Quiz'}
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// import React, { useState, useEffect } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import api from '../../utils/api';
// import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

// const QuizSessionPage = () => {
//   const location = useLocation(); // Get the location object
//   const navigate = useNavigate(); // Initialize navigate
//   const quizId = location.state?.quizId;
//   const studentId = 'USER_ID_PLACEHOLDER'; // Replace with actual user ID logic

//   // State management
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [submissionLoading, setSubmissionLoading] = useState(false);
//   const [submissionResult, setSubmissionResult] = useState(null);

//   // Timer useEffect
//   useEffect(() => {
//     let timer;
//     if (quizStarted && !quizCompleted && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             handleTimeExpired();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [quizStarted, quizCompleted]);

//   const fetchQuestions = async (quizId) => {
//     try {
//       console.log("quizId", quizId);
//       const response = await api.get(`/api/quizzes/${quizId.toString()}`);
//       setQuestions(response.data.quizQuestions);
//       // Initialize selectedAnswers array with undefined for each question
//       setSelectedAnswers(Array(response.data.quizQuestions.length).fill(undefined));
//       setQuizStarted(true); // Start the quiz when questions are fetched
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

//   useEffect(() => {
//     if (quizId) {
//       fetchQuestions(quizId);
//     }
//   }, [quizId]);

//   const handleTimeExpired = () => {
//     setQuizCompleted(true);
//     handleSubmitQuiz(); // Auto-submit on time expiry
//   };

//   const handleAnswerSelect = (optionIndex) => {
//     const newAnswers = [...selectedAnswers];
//     newAnswers[currentQuestionIndex] = optionIndex;
//     setSelectedAnswers(newAnswers);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const getSelectedAnswerText = (questionIndex) => {
//     const selectedIndex = selectedAnswers[questionIndex];
//     return selectedIndex !== undefined && questions[questionIndex]?.options ? questions[questionIndex].options[selectedIndex] : undefined;
//   };

//   const getCorrectAnswerText = (questionIndex) => {
//     const correctAnswerIndex = questions[questionIndex]?.correctAnswer;
//     return correctAnswerIndex !== undefined && questions[questionIndex]?.options ? questions[questionIndex].options[correctAnswerIndex] : undefined;
//   };

//   const calculateScore = () => {
//     let score = 0;
//     const answersWithCorrectness = questions.map((question, index) => {
//       const selected = selectedAnswers[index];
//       const isCorrect = selected !== undefined && String(selected) === String(question.correctAnswer); // Compare as strings
//       if (isCorrect) {
//         score++;
//       }
//       return {
//         questionId: question._id, // Assuming your question object has an _id
//         selectedAnswer: getSelectedAnswerText(index),
//         correctAnswer: getCorrectAnswerText(index),
//         isCorrect: isCorrect,
//       };
//     });
//     return { score, answersWithCorrectness };
//   };

//   const handleSubmitQuiz = async () => {
//     if (submissionLoading || quizCompleted) return;

//     setSubmissionLoading(true);
//     const { score, answersWithCorrectness } = calculateScore();
//     const timeTaken = 600 - timeLeft; // Calculate time taken

//     try {
//       const response = await api.post('/api/quizzes/submit-quiz', {
//         quizId: quizId,
//         studentId: studentId,
//         quizAnswers: answersWithCorrectness.map(ans => ({
//           questionId: ans.questionId,
//           selectedAnswer: ans.selectedAnswer,
//           isCorrect: ans.isCorrect,
//         })),
//         score: score,
      
//         timeTaken: timeTaken,
//       });
//       setSubmissionResult(response.data);
//       setQuizCompleted(true);
//     } catch (error) {
//       console.error('Error submitting quiz:', error);
     
//     } finally {
//       setSubmissionLoading(false);
//     }
//   };

//   // Calculate quiz stats
//   const attemptedQuestions = selectedAnswers.filter(a => a !== undefined).length;
//   const remainingQuestions = questions.length - attemptedQuestions;

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
//       {/* Quiz Header */}
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-indigo-700">Quiz Session</h1>
//         <div className="flex justify-between items-center mt-4">
//           <div className="text-green-300 font-medium">
//             Question {currentQuestionIndex + 1} of {questions.length}
//           </div>
//           <div
//             className={`text-xl font-bold ${
//               timeLeft > 30 ? 'text-green-400' : 'text-red-400 animate-pulse'
//             }`}
//           >
//             {formatTime(timeLeft)}
//           </div>
//         </div>
//       </header>

//       {/* Main Quiz Content */}
//       <div className="flex gap-6">
//         {/* Sidebar with Submit Button */}
//         <div className="w-72 flex flex-col gap-6">
//           <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-indigo-700">Quiz Stats</h3>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="text-sm font-medium text-gray-300">Attempted</h4>
//                 <p className="text-2xl font-bold text-green-400">{attemptedQuestions}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-300">Remaining</h4>
//                 <p className="text-2xl font-bold text-yellow-400">{remainingQuestions}</p>
//               </div>
//               <div className="pt-4 border-t border-gray-200">
//                 <h4 className="text-sm font-medium text-gray-300">Progress</h4>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//                   <motion.div
//                     className="bg-indigo-500 h-2.5 rounded-full"
//                     initial={{ width: 0 }}
//                     animate={{ width: `${(attemptedQuestions / questions.length) * 100}%` }}
//                     transition={{ duration: 0.5 }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={handleSubmitQuiz}
//             disabled={submissionLoading || quizCompleted}
//             className={`w-full px-6 py-3 rounded-lg font-semibold text-white shadow-md focus:outline-none focus-ring-2 focus-ring-indigo-500 focus-ring-offset-2 ${
//               submissionLoading || quizCompleted
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-indigo-600 hover:bg-indigo-500'
//             }`}
//           >
//             {submissionLoading ? 'Submitting...' : 'Submit Quiz'}
//           </button>
//         </div>

//         {/* Questions Section */}
//         <div className="flex-1 bg-white rounded-lg p-6 shadow-lg border border-gray-200">
//           {quizCompleted && submissionResult ? (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4 text-green-600">Quiz Completed!</h2>
//               <p className="mb-2">Your Score: {submissionResult.score} / {questions.length}</p>
//               <h3 className="text-xl font-semibold mt-6 mb-3">Review Answers:</h3>
//               <div className="space-y-4">
//                 {submissionResult.quizAnswers.map((result, index) => (
//                   <div key={index} className="p-4 border rounded-md">
//                     <p className="font-semibold">{questions[index]?.question}</p>
//                     <ul className="mt-2 space-y-1">
//                       {questions[index]?.options.map((option, optionIndex) => (
//                         <li
//                           key={optionIndex}
//                           className={`${
//                             option === result.selectedAnswer
//                               ? result.isCorrect
//                                 ? 'text-blue-500 font-semibold'
//                                 : 'text-red-500 font-semibold line-through'
//                               : option === result.correctAnswer
//                               ? 'text-green-500 font-semibold'
//                               : 'text-gray-700'
//                           }`}
//                         >
//                           {option}
//                           {option === result.correctAnswer && <span className="text-green-500"> (Correct Answer)</span>}
//                           {option === result.selectedAnswer && !result.isCorrect && <span className="text-red-500"> (Your Answer)</span>}
//                           {option === result.selectedAnswer && result.isCorrect && <span className="text-blue-500"> (Your Answer)</span>}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => navigate('/results', { state: { submissionResult } })} // Example navigation
//                 className="mt-6 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
//               >
//                 View Detailed Results
//               </button>
//             </div>
//           ) : (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentQuestionIndex}
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ duration: 0.3 }}
//                 className="mb-8"
//               >
//                 <h2 className="text-xl font-semibold mb-6">
//                   {questions[currentQuestionIndex]?.question}
//                 </h2>

//                 <div className="space-y-4">
//                   {questions[currentQuestionIndex]?.options?.map((option, index) => (
//                     <motion.div
//                       key={index}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className={`p-4 rounded-lg cursor-pointer ${
//                         selectedAnswers[currentQuestionIndex] === index
//                           ? 'bg-indigo-100 border-2 border-indigo-500 shadow-sm'
//                           : 'bg-white hover:bg-gray-50 border border-gray-300'
//                       }`}
//                       onClick={() => handleAnswerSelect(index)}
//                     >
//                       <div className="flex items-center">
//                         <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
//                           selectedAnswers[currentQuestionIndex] === index
//                             ? 'border-white bg-white'
//                             : 'border-gray-300'
//                         }`} />
//                         {option}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             </AnimatePresence>
//           )}

//           {/* Navigation Controls */}
//           {!quizCompleted && (
//             <div className="flex justify-between mt-8">
//               <button
//                 onClick={handlePrevQuestion}
//                 disabled={currentQuestionIndex === 0}
//                 className={`px-6 py-2 rounded-lg ${
//                   currentQuestionIndex === 0
//                     ? 'bg-gray-500 cursor-not-allowed'
//                     : 'bg-green-600 hover:bg-green-500 text-white'
//                 }`}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={handleNextQuestion}
//                 disabled={currentQuestionIndex === questions.length - 1}
//                 className={`px-6 py-2 rounded-lg ${
//                   currentQuestionIndex === questions.length - 1
//                     ? 'bg-gray-500 cursor-not-allowed'
//                     : 'bg-green-600 hover:bg-green-500 text-white'
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

export default QuizSessionPage;