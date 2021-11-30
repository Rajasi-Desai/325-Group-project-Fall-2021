import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Home from "./pages/Home"; // Access Home.js
import CreatePost from "./pages/CreatePost"; // Access CreatePost.js
import Post from "./pages/Post"; // Access Post.js
import Registration from "./pages/Registration"; // Access Registration.js
import Login from "./pages/Login"; // Access Login.js
import Report from "./pages/Report"; // Access Report.js
import PageNotFound from "./pages/PageNotFound"; // Access PageNotFound.js
import Profile from "./pages/Profile"; // Access Profile.js
import ChangePassword from "./pages/ChangePassword"; // Access ChangePassword.js

import {AuthContext} from "./helpers/AuthContext"; // Access AuthContext.js (switch login state on frontend)
import {useState, useEffect} from "react";
import axios from 'axios';

function App() {
  // See if we are logged in or not (authState), and be able to change that state if we do log in (setAuthState)
  const [authState, setAuthState] = useState({
    username: "", 
    id: 0, 
    status: false,
  });

  useEffect(() => {
    axios.get(
      "http://localhost:3001/auth/auth", { 
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      }).then((response) => { // Get user token from routes/Users.js GET request
      if (response.data.error) { // if there is an error in getting the token (invalid token), then we do not give access
        setAuthState({...authState, status: false}); // Change only one attribute in authstate (in this case, we only want to change status to false)
      } else { // otherwise, we change authState to grant access
        setAuthState({
          username: response.data.username, 
          id: response.data.id, 
          status: true,
        });
      }
    });
  }, []);

  // Function to log user out of their account
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "", 
      id: 0, 
      status: false,
    });
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/registration">Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/">Home Page</Link>
                  <Link to="/createpost">Create Post</Link>
                  <Link to="/reports">Report</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              {/* <Link to={'/profile/${authState.id}'}>{authState.username}</Link> */}
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}>Logout</button>}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/createpost" element={<CreatePost/>}/>
            <Route path="/post/:id" element={<Post/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/registration" element={<Registration/>}/>
            <Route path="/reports" element={<Report/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/changepassword" element={<ChangePassword/>}/>
            <Route path="*" element={<PageNotFound/>}/>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;