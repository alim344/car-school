import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import InstructorLayout from './pages/instructor/InstructorLayout';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorSchedule from './pages/instructor/InstructorSchedule';
import InstructorProfile from './pages/instructor/InstructorProfile';
import CandidateLayout from './pages/candidate/CandidateLayout';
import CandidateSchedule from './pages/candidate/CandidateSchedule';
import CandidatePreference from './pages/candidate/CandidatePreference';
import AdminLayout from './pages/admin/AdminLayout';
import ExamScheduler from './pages/admin/ExamScheduler';
import AdminSchedule from './pages/admin/AdminSchedule';
import RecordExam from './pages/admin/RecordExam';
import AdminVehicle from './pages/admin/AdminVehicle';
import AddVehicle from './pages/admin/AddVehicle';
import AssignVehiclePage from './pages/admin/AssignVehiclePage';
import InstructorVehicle from './pages/instructor/InstructorVehicle';
import InstructorRequestVehicle from './pages/instructor/InstructorRequestVehicle';
import VehicleRequests from './pages/admin/VehicleRequests';
import InstructorLeaveRequest from './pages/instructor/InstructorLeaveRequests';
import AdminLeaveRequests from './pages/admin/AdminLeaveRequests';
import CandidateNotifications from './pages/candidate/CandidateNotifications';
import InstructorNotifications from './pages/instructor/InstructorNotifications';
import InstructorCandidates from './pages/instructor/InstructorCandidates';
import CandidatePage from './pages/instructor/CandidatePage';
import FinishedPracticalClass from './components/FinishedPracticalClass';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      
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
        <Route path="/instructor/vehicle" element={
          <InstructorLayout>
            <InstructorVehicle />
          </InstructorLayout>
        } />
        <Route path="/instructor/request-vehicle" element={
          <InstructorLayout>
            <InstructorRequestVehicle />
          </InstructorLayout>
        } />
        <Route path="/instructor/leave-request" element={
          <InstructorLayout>
            <InstructorLeaveRequest />
          </InstructorLayout>
        } />
        <Route path="/instructor/notif" element={
          <InstructorLayout>
            <InstructorNotifications />
          </InstructorLayout>
        } />
        <Route path="/instructor/candidates" element={
          <InstructorLayout>
            <InstructorCandidates />
          </InstructorLayout>
        } />
        <Route path="/instructor/candidates/:id" element={
          <InstructorLayout>
            <CandidatePage />
          </InstructorLayout>
        } />

        <Route path="/instructor/candidates/:id/class/:classId" element={
          <InstructorLayout>
            <FinishedPracticalClass />
          </InstructorLayout>
        } />


        <Route path="/candidate" element={
          <CandidateLayout>
            <CandidateSchedule />
          </CandidateLayout>
        } />
        <Route path="/candidate/preference" element={
          <CandidateLayout>
            <CandidatePreference />
          </CandidateLayout>
        } />
        <Route path="/candidate/notif" element={
          <CandidateLayout>
            <CandidateNotifications />
          </CandidateLayout>
        } />


        <Route path="/admin" element={
          <AdminLayout>
            <AdminSchedule /> 
          </AdminLayout>
        } />


        <Route path="/admin/scheduler" element={
          <AdminLayout>
            <ExamScheduler /> 
          </AdminLayout>
        } />

        <Route path="/admin/record" element={
          <RecordExam></RecordExam>
        } />

        <Route path="/admin/vehicles" element={
          <AdminLayout>
            <AdminVehicle /> 
          </AdminLayout>
        } />

        <Route path="/admin/add-vehicles" element={
          <AdminLayout>
            <AddVehicle /> 
          </AdminLayout>
        } />
        <Route path="/admin/assign-vehicle" element={
            <AdminLayout>
                <AssignVehiclePage />
            </AdminLayout>
        } />
        <Route path="/admin/vehicle-requests" element={
            <AdminLayout>
                <VehicleRequests />
            </AdminLayout>
        } />
         <Route path="/admin/leaves" element={
            <AdminLayout>
                <AdminLeaveRequests />
            </AdminLayout>
        } />

      </Routes>
  );
}