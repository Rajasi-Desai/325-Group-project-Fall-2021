import React, {useState, useContext} from 'react';
import axios from "axios"; // Library to make api calls
import {useNavigate} from 'react-router-dom'; // Library to Navigate different pages
import {AuthContext} from "../helpers/AuthContext"; // Access AuthContext.js (switch login state on frontend)

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    let navigate = useNavigate(); 
    
    const login = () => {
        const data = {username: username, password: password};
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            if (response.data.error){ // If there was an error logging in, 
                alert(response.data.error); // alert user about error
            } else { // If login was successful, 
                localStorage.setItem("accessToken", response.data.token); // Store accessToken in localStorage
                setAuthState({
                  username: response.data.username,
                  id: response.data.id, 
                  status: true,
                }); // Set authState populate data from Users.js Login POST Request, indicating that we logged in
                navigate("/"); // Go to home page
            }
        });
    };
    
    return (
        <div className="loginContainer">
          <label>Username:</label>
          <input
            type="text"
            autoComplete="off"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <label>Password:</label>
          <input
            type="password"
            autoComplete="off"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button onClick={login}> Login </button>
        </div>
      );
}

export default Login
