import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'; // Library to Navigate different pages

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    let navigate = useNavigate(); 

    // Function to login via "Enter" key
    const onEnterKey = (event) => {
        if(event.key === 'Enter'){
          changePassword();
        }
    }

    // function that will change the password on submit
    const changePassword = () => {
        axios.put("http://localhost:3001/auth/changepassword",
        {
            oldPassword: oldPassword, 
            newPassword: newPassword, 
        }, 
        {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then((response)=> {
            if (response.data.error) { // Check and alert if there is an error
                alert(response.data.error)
            } else {
                alert("Password change successful!");
                navigate("/");
            }
        });
    };

    return (
        <div className="loginContainer">
          <h1>Change Password</h1>
          <label>Old Password:</label>
          <input
            type="password"
            autoComplete="off"
            placeholder="Enter your old password"
            onChange={(event) => {setOldPassword(event.target.value)}}
            onKeyPress={onEnterKey}
          />
          <label>New Password:</label>
          <input
            type="password"
            autoComplete="off"
            placeholder="Enter your new password"
            onChange={(event) => {setNewPassword(event.target.value)}}
            onKeyPress={onEnterKey}
          />
          <button onClick={changePassword}>Save Changes</button>
        </div>
    )
}

export default ChangePassword;