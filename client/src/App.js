
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

function App() {
  return (
    <div className="App">
     <Router>
       <Navbar />
       <Routes>
       <Route exact path="/" element={<Landing /> } />
       <Route exact path="/register" element={<Register />} />
       <Route exact path="/login" element={<Login />} />
       </Routes>
     </Router>
    </div>
  );
}

export default App;
