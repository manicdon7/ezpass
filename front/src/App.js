import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Host from './pages/Host';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import ParentComponent from './Components/ParentComponent';
import Approval from './pages/Approval';

function App() {
  const [userEmail, setUserEmail] = useState(null);
  return (
    <div>
          <Router>
            <ParentComponent userEmail={userEmail} setUserEmail={setUserEmail} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/host" element={<Host />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path='/Approval/:id' element={<Approval />} />
            </Routes>
          </Router>
    </div>
  );
}

export default App;