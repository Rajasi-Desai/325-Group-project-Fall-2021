import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext"; // Access AuthContext.js (switch login state on frontend)

function Post() {
    let {id} = useParams(); // Identify unique routes based on id (New page for post with unique id)
    const [postObject, setPostObject] = useState({}); // State hook to contain data to post on page
    const [comments, setComments] = useState([]); // Get data to comments for post
    const [newComment, setNewComment] = useState(""); // Get data of user's inputted comment
    const {authState} = useContext(AuthContext); // Get state of authorization

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data); // Store data for post by Id
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data); // Store data for comments on given post
        });
    }, []);

    // Function to add comment in frontend
    const addComment = () => {
        axios
            .post("http://localhost:3001/comments", {
                commentBody: newComment, 
                PostId: id,
            }, 
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                }
            })
            .then((response) => {
                if (response.data.error) { // If not logged in or authenticated, cannot comment.
                    console.log(response.data.error);
                } else { // Otherwise, show comment on frontend
                    const commentToAdd = { // Get newly added comment
                        commentBody: response.data.commentBody, 
                        username: response.data.username,
                        // id: response.data.id,
                    }; 
                    setComments([...comments, commentToAdd]); // Attach new comment to list of old comments
                    setNewComment(""); // Clears input of comment to refresh after submission
                }
            });
    };

    // Delete comment function (given the id of the comment)
    const deleteComment = (id) => { 
        axios
            .delete(`http://localhost:3001/comments/${id}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                }, 
            })
            .then(() => {
                setComments(comments.filter((val) => { // Filter out comments on post to not include the one we deleted
                    return val.id !== id;
                }));
            });
    };
    
    // Function to edit post
    const editPost = (option) => {
        if (option === "title") { // Edit title
            let newTitle = prompt("Enter New Title:");
            axios.put(
                "http://localhost:3001/posts/title", 
                {
                    newTitle: newTitle, 
                    id: id, 
                }, 
                {
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );

            // Update changes on page after submission
            setPostObject({...postObject, title: newTitle}); // Only update title on page
        } else {  // Otherwise, edit body
            let newPostText = prompt("Enter New Text:");
            axios.put(
                "http://localhost:3001/posts/postText", 
                {
                    newText: newPostText, 
                    id: id, 
                }, 
                {
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );

            // Update changes on page after submission
            setPostObject({...postObject, postText: newPostText}); // Only update post on page
        }
    };

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div 
                        className="title"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("title");
                            }
                        }}
                    >{postObject.title}</div>
                    <div 
                        className="body"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("body");
                            }
                        }}
                    >{postObject.postText}</div>
                    <div className="footer">{postObject.username}</div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input 
                        type="text" 
                        placeholder="Comment..." 
                        autoComplete="off" 
                        value={newComment}
                        onChange={(event) => {setNewComment(event.target.value)}}
                    />
                    <button onClick={addComment}>Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment"> 
                                {comment.commentBody} 
                                <label> Username: {comment.username}</label>
                                {authState.username === comment.username && <button onClick={() => {deleteComment(comment.id)}}>X</button>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Post
