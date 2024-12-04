import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import AdminTab from './pages/AdminTab/AdminTab';
import MemoryReportPage from './pages/AdminTab/memory_report_page';
import CustomerPage from './pages/AdminTab/CustomerView';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <NavBar />
        <Routes>
          <Route path="/admin" element={<AdminTab />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/memory_report_page" element={<MemoryReportPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;