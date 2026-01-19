import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import ResumeParser from './pages/ResumeParser';
import JDGenerator from './pages/JDGenerator';
import SavedJDs from './pages/SavedJDs';
import PostJob from './pages/PostJob';
import JobDashboard from './components/Dashboard/JobDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-parser"
          element={
            <ProtectedRoute>
              <ResumeParser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jd-generator"
          element={
            <ProtectedRoute>
              <JDGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <JobDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jds"
          element={
            <ProtectedRoute>
              <SavedJDs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;