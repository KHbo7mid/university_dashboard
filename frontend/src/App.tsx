import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Programs from './pages/Filieres';
import Rooms from './pages/Rooms';
import Subjects from './pages/Examens';
import { AuthProvider } from './contexts/AuthContext';
import Planning from './pages/Planning';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import TeacherDashboard from './pages/TeacherDashboard';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import ChangePassword from './components/ChangePassword';
import TeacherSchedule from './components/Enseignant/TeacherSchedule';
import { TeacherProfile } from './components/Enseignant/TeacherProfile';
function App() {
  return (
    <Router>
       <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

 {/* Admin Routes */}
         <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/admin" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="filieres" element={<Programs />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="examens" element={<Subjects />} />
              <Route path="planning" element={<Planning />} />
            </Route>
          </Route>
           {/* Teacher Route */}
           <Route element={<ProtectedRoute role="TEACHER" />}>
           <Route path="/teacher" element={<Layout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path='/teacher/profile' element={<TeacherProfile/>}/>
            <Route path='/teacher/change-password' element={<ChangePassword/>}/>
            <Route path='/teacher/surveillance' element={<TeacherSchedule />}/>
            </Route>
          </Route>
            {/* Root redirect */}
            <Route path="/" element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          } />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;