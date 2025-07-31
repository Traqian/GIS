import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import CampusMap from './components/CampusMap';
import BuildingInfo from './components/BuildingInfo';
import Navigation from './components/Navigation';
import Facilities from './components/Facilities';
import RealTimeTracking from './components/RealTimeTracking';
import UserInteraction from './components/UserInteraction';

function App() {
  return (
    <Router>
      <div className="App">
        <UserInteraction />
        <Routes>
          <Route path="/" element={<CampusMap />} />
          <Route path="/building/:id" element={<BuildingInfo />} />
          <Route path="/navigation" element={<Navigation />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/tracking" element={<RealTimeTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
