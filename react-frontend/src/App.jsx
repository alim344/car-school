import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import InstructorHomePage from './pages/instructor/HomePage'
import CandidateHomePage from './pages/candidate/HomePage'
import AdminHomePage from './pages/admin/HomePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/instructor-main" element={<InstructorHomePage />} />
      <Route path="/candidate-main" element={<CandidateHomePage />} />
      <Route path="/admin-main" element={<AdminHomePage />} />
    </Routes>
  );
}