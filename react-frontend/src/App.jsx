import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminHomePage from './pages/admin/HomePage'
import InstructorLayout from './pages/instructor/InstructorLayout';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorSchedule from './pages/instructor/InstructorSchedule';
import InstructorProfile from './pages/instructor/InstructorProfile';
import CandidateLayout from './pages/candidate/CandidateLayout';
import CandidateSchedule from './pages/candidate/CandidateSchedule';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/admin-main" element={<AdminHomePage />} />
       <Route path="/instructor" element={
          <InstructorLayout>
            <InstructorDashboard />
          </InstructorLayout>
        } />
        <Route path="/instructor/schedule" element={
          <InstructorLayout>
            <InstructorSchedule />
          </InstructorLayout>
        } />
        <Route path="/instructor/profile" element={
          <InstructorLayout>
            <InstructorProfile />
          </InstructorLayout>
        } />

        <Route path="/candidate" element={
          <CandidateLayout>
            <CandidateSchedule />
          </CandidateLayout>
        } />
        

      </Routes>
  );
}