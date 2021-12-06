import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from "../helpers/AuthContext";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

function Profile() {
    
    let {id} = useParams(); // Id represents userId passed in, so we know which user we want to query for the profile page
    const [username, setUsername] = useState(""); // See if you have the username of profile
    const [email, setEmail] = useState(""); // See if you have the email of profile
    const [listOfPosts, setListOfPosts] = useState([]); // Get the list of posts for profile
    const {authState} = useContext(AuthContext); // Get state of authorization
    let navigate = useNavigate(); // Navigate to specific posts

    useEffect(() => { // When page rerenders, 
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => { // Get basic info on user from db
            // console.log("response.data.username: " + response.data.username);
            // console.log("response.data.email: " + response.data.email);
            setUsername(response.data.username);
            setEmail(response.data.email);
        });

        axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => { // Get list of posts from user from db
            setListOfPosts(response.data);
        });
    }, []);

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1>Username: {username}</h1>
                <h1>Email: {email}</h1>
                {authState.username === username && (<button onClick={() => {navigate("/changepassword")}}>Change My Password</button>)}
            </div>
            <div className="listOfPosts">
                {listOfPosts.map((value, key) => { // value = every object in listOfPosts
                    return (
                        <div key={key} className="post">
                            <div className="title"> {value.title} </div>
                            <div
                                className="body"
                                onClick={() => {
                                navigate(`/post/${value.id}`);
                                }}
                            >
                                {value.postText}
                            </div>
                            <div className="footer">
                                <div className="username">{value.username}</div>
                                <div className="buttons">
                                <ThumbUpAltIcon/>
                                <label> {value.Likes.length}</label>
                                <ThumbDownAltIcon/>
                                <label> {value.Dislikes.length}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Profile;