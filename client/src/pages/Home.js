import React from 'react'
import axios from "axios"; // Library to make api calls
import { useEffect, useState } from "react"; // Allows us to run function immediately when page rerenders
import { Link, useNavigate } from 'react-router-dom';
import Tabs, { TabPane } from 'rc-tabs';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]); // Constants that has list of posts, and change/set list of posts; initially set as empty []
    const [likedPosts, setLikedPosts] = useState([]); // Constants that has list of likes, and change/set list of likes; initially set as empty []

    let navigate = useNavigate();

    useEffect(() => { // When page rerenders, 
        // Want to run GET request from backend's 3001/posts to get data, then
        axios
            .get("http://localhost:3001/posts", {
                headers: {accessToken: localStorage.getItem("accessToken")},
            })
            .then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setLikedPosts(response.data.likedPosts);
                // console.log(response.data.likedPosts);
                setLikedPosts(
                    response.data.likedPosts.map((like) => {
                        return like.PostId;
                    })
                );
            });
    }, []); // Run once when page is refreshed ([] = empty list of dependencies/states)

    // Show change in filter for tabs on left
    function callback(e) {
        console.log(e);
    };

    // Function to add/remove like to post
    const likeAPost = (postId) => {
        axios.post(
            "http://localhost:3001/likes", 
            {PostId: postId}, 
            {headers: {accessToken: localStorage.getItem("accessToken")}}
        ).then((response) => {
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) { // Find the post that has the id we want
                    if (response.data.liked) { // If the post has already been liked by user
                        return {...post, Likes: [...post.Likes, 0]}; // Remove like (and leave anything else on post as is)
                    } else { // Otherwise, add like
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray};
                    }
                } else {
                    return post;
                }
            }));

            if (likedPosts.includes(postId)) { // If post has like on it, then remove it from list to change color, indicating that like has been removed 
                setLikedPosts(
                    likedPosts.filter((id) => {
                        return id !== postId;
                    })
                );
            } else {
                setLikedPosts([...likedPosts, postId]); // Otherwise, add postId to the list, and it will change color of thumbs up icon to indicate like has been added
            }
        });
    };

    return (
        <div>
            <div className="postPage">
                <div className="leftHome">
                    <Tabs defaultActiveKey="0" onChange={callback}>
                        <TabPane tab="Home" key="0">
                        
                        </TabPane>
                        <TabPane tab="CS-121" key="1">
                        
                        </TabPane>
                        <TabPane tab="CS-186" key="2">
                        
                        </TabPane>
                        <TabPane tab="CS-187" key="3">
                        
                        </TabPane>
                        <TabPane tab="CS-220" key="4">
                        
                        </TabPane>
                        <TabPane tab="CS-230" key="5">
                        
                        </TabPane>
                        <TabPane tab="Interview" key="6">
                        
                        </TabPane>
                    </Tabs>
                </div>
                <div className="middleHome">
                    {listOfPosts.map((value, key) => { // value = every object in listOfPosts
                        return (
                        <div className="post"> 
                            <div className="title">{value.title}</div>
                            <div className="body" onClick={() => {navigate(`/post/${value.id}`)}}>{value.postText}</div>
                            <div className="footer">
                                <div className="username">
                                    <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                                </div>
                                <div className="buttons">
                                    <ThumbUpAltIcon
                                        onClick={() => {
                                            likeAPost(value.id);
                                        }}
                                        className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                                    />
                                    <label> {value.Likes.length}</label>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
                <div className="rightHome">
                    Profile
                </div>
            </div>
        </div>
    )
}

export default Home
