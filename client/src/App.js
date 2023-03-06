
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <Router>
       <Navbar />
       <Routes>
       <Route path="/" element={<Landing /> } />
       </Routes>
     </Router>
    </div>
  );
}

export default App;
