import React, { useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ManageDepartments from "./pages/ManageDepartments";
import CreateCollege from "./pages/CreateCollege";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Community from "./pages/Community";
import useAuthStore from "./store/useAuthStore";
import { initializeAuthState } from "./utils/auth";
import { useEffect } from "react";
import TeacherManagement from "./pages/admin/TeacherManagement";
import Classes from "./pages/teacher/Classes";
import Quizzes from "./pages/teacher/quizzes";
import { io } from "socket.io-client";
import ChatGroups from "./pages/ChatGroups";
import CommunityNew from "./pages/comunitynew";
import QuizSession from "./pages/quizConducting/quizSessionPage";
import ClassDashboard from "./pages/student/ClassDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  console.log("here");
  console.log("user", user);
  console.log("allowedRoles", allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { login, logout } = useAuthStore();
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    initializeAuthState(login, logout);
  }, [login, logout]);
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["collegeAdmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-departments"
          element={
            <ProtectedRoute allowedRoles={["collegeAdmin"]}>
              <ManageDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute allowedRoles={["collegeAdmin"]}>
              <TeacherManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/create-college" element={<CreateCollege />} />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/classes"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <Classes />
            </ProtectedRoute>
          }
        />
        <Route path="/ChatGroups" element={<ChatGroups />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/quizSession"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <QuizSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/ClassDashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ClassDashboard />
            </ProtectedRoute>
          }
        />

        {/* Community Route */}
        <Route
          path="/community"
          element={
            <ProtectedRoute
              allowedRoles={["collegeAdmin", "teacher", "student"]}
            >
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communityNew"
          element={
            <ProtectedRoute
              allowedRoles={["collegeAdmin", "teacher", "student"]}
            >
              <CommunityNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quiz"
          element={
            <ProtectedRoute
              allowedRoles={["collegeAdmin", "teacher", "student"]}
            >
              <Quizzes />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
