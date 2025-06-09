import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';
import RegisterStudent from './components/RegisterStudent';
import FacultyDashboard from './components/FacultyDashboard';

import FacultyLogin from './components/FacultyLogin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<RegisterStudent />} />
        <Route path="/student-dashboard/:usn" element={<StudentDashboard />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        
      </Routes>
    </Router>
  );
};

export default App;
