import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LockerDashboard from './components/LockerDashboard'; 
import SuccessPage from './components/SuccessPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<LockerDashboard />} />
        
       
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
};

export default App;
