import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ERRegistration from './components/ERRegistration';
import ERBilling from './components/ERBilling';
import Dashboard from './components/Dashboard';
import ERPatientEdit from './components/ERPatientEdit';
import Printbill from './components/Printbill';
import ReportView from './components/ReportView';

function App() {
  return (
    <Sidebar>
      <Routes>
        <Route path="/ERRegistration" element={<ERRegistration />} />
        <Route path="/ERPatientEdit" element={<ERPatientEdit />} />
        <Route path="/ERBilling" element={<ERBilling />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/printbill" element={<Printbill />} />
        <Route path="/ReportView" element={<ReportView />} />
      </Routes>
    </Sidebar>
  );
}

export default App;
