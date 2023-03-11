
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/private-route/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import store from './store'
import { Provider } from "react-redux";




// Check if there is a token to keep the user logged in

if(localStorage.jwtToken){

  //Set header auth for auth token

  const token = localStorage.jwtToken;
  setAuthToken(token);

  //Decode the token to get user info

  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  //If expired token, logout user and redirect to the login page

  const currentTime = Date.now()/1000;

  if(decoded.exp < currentTime){
    store.dispatch(logoutUser());
    window.location.href = "./login"
  }
}



function App() {
  return ( 
<Provider store={store}>
  <Router>
    <div className="App">
    
    <Navbar />
       
       <Routes>
              <Route  path="/" element={<Landing /> } />
              <Route  path="/register" element={<Register />} />
              <Route  path="/login" element={<Login />} />
              <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
              <Route path="*" element={<Navigate to="/" />} />
             
       </Routes>
       
     
    </div>
    </Router>

    </Provider>
  );
}

export default App;
