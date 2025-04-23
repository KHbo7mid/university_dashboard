import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Programs from './pages/Filieres';
import Rooms from './pages/Rooms';
import Subjects from './pages/Examens';

import Planning from './pages/Planning';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="filieres" element={<Programs />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="examens" element={<Subjects />} />
         
          <Route path="planning" element={<Planning />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;