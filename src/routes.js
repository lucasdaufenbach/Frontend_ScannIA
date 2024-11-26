import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Report from './components/Report';
import ReconhecimentoFacial from './components/ReconhecimentoFacial';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/ReconhecimentoFacial" element={<ReconhecimentoFacial />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
