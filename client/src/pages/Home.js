import React from 'react'
import axios from "axios"; // Library to make api calls
import { useEffect, useState } from "react"; // Allows us to run function immediately when page rerenders
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from 'react-bootstrap';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]); // Constants that has list of posts, and change/set list of posts; initially set as empty []
    const [listOfFilteredPosts, setListOfFilteredPosts] = useState(listOfPosts); // Constants that has list of posts, and change/set list of posts; initially set as empty []
    const [likedPosts, setLikedPosts] = useState([]); // Constants that has list of likes, and change/set list of likes; initially set as empty []
    const [dislikedPosts, setDislikedPosts] = useState([]); // Constants that has list of dislikes, and change/set list of dislikes; initially set as empty []

    let navigate = useNavigate();

    useEffect(() => { // When page rerenders, 
        // Want to run GET request from backend's 3001/posts to get data, then
        axios
            .get("http://localhost:3001/posts", { // Authenticate
                headers: {accessToken: localStorage.getItem("accessToken")},
            })
            .then((response) => {
                // Set list of posts (all posts and filtered posts)
                setListOfPosts(response.data.listOfPosts);
                setListOfFilteredPosts(response.data.listOfPosts);

                // Set list of likes for posts
                setLikedPosts(
                    response.data.likedPosts.map((like) => {
                        return like.PostId;
                    })
                );

                // Set list of dislikes for posts
                setDislikedPosts(
                    response.data.dislikedPosts.map((dislike) => {
                        return dislike.PostId;
                    })
                );
            });
    }, []); // Run once when page is refreshed ([] = empty list of dependencies/states)

    // Function to add/remove like to post
    const likeAPost = (postId) => {
        axios.post(
            "http://localhost:3001/likes", 
            {PostId: postId}, 
            {headers: {accessToken: localStorage.getItem("accessToken")}}
        ).then((response) => {
            // Modify list of likes in the list of filtered posts
            setListOfFilteredPosts(listOfFilteredPosts.map((post) => {
                if (post.id === postId) { // Find the post that we are interacting with by id
                    if (response.data.liked) { // If the post has been liked by user,
                        sessionStorage.setItem("LikedPostId", postId);
                        return {...post, Likes: [...post.Likes, 0] }; // Add like (and leave anything else on post as is); Note: we are adding zero just to change size
                    } 
                    else { // Otherwise, remove like since the post is being unliked
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray};
                    }
                } else { // Otherwise, ignore post
                    return post;
                }
            }));

            // Modify list of likes in the list of unfiltered posts
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) { // Find the post that we are interacting with by id
                    if (response.data.liked) { // If the post has been liked by user,
                        return {...post, Likes: [...post.Likes, 0] }; // Add like (and leave anything else on post as is); Note: we are adding zero just to change size
                    } 
                    else { // Otherwise, remove like since the post is being unliked
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray};
                    }
                } else { // Otherwise, ignore post
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

        // if (sessionStorage.getItem("LikedPostId") !== null) { // If the post has been liked, then we need to check if "Dislike" is on 
        //     axios.post(
        //         "http://localhost:3001/dislikes", 
        //         {PostId: postId}, 
        //         {headers: {accessToken: localStorage.getItem("accessToken")}}
        //     ).then((response) => {
        //         // Modify list of dislikes in the list of filtered posts
        //         setListOfFilteredPosts(listOfFilteredPosts.map((post) => {
        //             if (post.id === postId) { // Find the post that has the id we want
        //                 if (response.data.disliked) { // If the post already has dislike, then we remove it; otherwise, ignore 
        //                     const dislikesArray = post.Dislikes;
        //                     dislikesArray.pop();
        //                     return {...post, Dislikes: dislikesArray};
        //                 }
        //             } else {
        //                 return post;
        //             }
        //         }));
    
        //         // Modify list of dislikes in the list of unfiltered posts
        //         setListOfPosts(listOfPosts.map((post) => {
        //             if (post.id === postId) { // Find the post that has the id we want
        //                 if (response.data.disliked) { // If the post already has dislike, then we remove it; otherwise, ignore 
        //                     const dislikesArray = post.Dislikes;
        //                     dislikesArray.pop();
        //                     return {...post, Dislikes: dislikesArray};
        //                 }
        //             } else {
        //                 return post;
        //             }
        //         }));
    
        //         if (dislikedPosts.includes(postId)) { // If post has a dislike on it, then remove it from list to change color, indicating that dislike has been removed 
        //             setDislikedPosts(
        //                 dislikedPosts.filter((id) => {
        //                     return id !== postId;
        //                 })
        //             );
        //         } else {
        //             setDislikedPosts([...dislikedPosts, postId]); // Otherwise, add postId to the list, and it will change color of thumbs down icon to indicate dislike has been added
        //         } 
        //     });
        // }
    };

    // Function to add/remove dislike to post
    const dislikeAPost = (postId) => {
        axios.post(
            "http://localhost:3001/dislikes", 
            {PostId: postId}, 
            {headers: {accessToken: localStorage.getItem("accessToken")}}
        ).then((response) => {
            // Modify list of dislikes in the list of filtered posts
            setListOfFilteredPosts(listOfFilteredPosts.map((post) => {
                if (post.id === postId) { // Find the post that has the id we want
                    if (response.data.disliked) { // If the post has been disliked by user
                        return {...post, Dislikes: [...post.Dislikes, 0]}; // Add dislike (and leave anything else on post as is)
                    } else { // Otherwise, remove dislike since the post is being un-disliked
                        const dislikesArray = post.Dislikes;
                        dislikesArray.pop();
                        return {...post, Dislikes: dislikesArray};
                    }
                } else {
                    return post;
                }
            }));

            // Modify list of dislikes in the list of unfiltered posts
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) { // Find the post that has the id we want
                    if (response.data.disliked) { // If the post has been disliked by user
                        return {...post, Dislikes: [...post.Dislikes, 0]}; // Add dislike (and leave anything else on post as is)
                    } else { // Otherwise, remove dislike since the post is being un-disliked
                        const dislikesArray = post.Dislikes;
                        dislikesArray.pop();
                        return {...post, Dislikes: dislikesArray};
                    }
                } else {
                    return post;
                }
            }));

            if (dislikedPosts.includes(postId)) { // If post has a dislike on it, then remove it from list to change color, indicating that dislike has been removed 
                setDislikedPosts(
                    dislikedPosts.filter((id) => {
                        return id !== postId;
                    })
                );
            } else {
                setDislikedPosts([...dislikedPosts, postId]); // Otherwise, add postId to the list, and it will change color of thumbs down icon to indicate dislike has been added
            } 
        });

        // axios.post(
        //     "http://localhost:3001/likes", 
        //     {PostId: postId}, 
        //     {headers: {accessToken: localStorage.getItem("accessToken")}}
        // ).then((response) => {
        //     setListOfPosts(listOfPosts.map((post) => {
        //         if (post.id === postId) { // Find the post that has the id we want
        //             if (dislikeOn === true && response.data.liked) { // If the post has already been liked by user
        //                 return {...post, Likes: [...post.Likes, 0]}; // Remove like (and leave anything else on post as is)
        //             } else {
        //                 return post;
        //             }
        //         } else {
        //             return post;
        //         }
        //     }));

        //     if (likedPosts.includes(postId)) { // If post has like on it, then remove it from list to change color, indicating that like has been removed 
        //         setLikedPosts(
        //             likedPosts.filter((id) => {
        //                 return id !== postId;
        //             })
        //         );
        //     }
        // });
    };

    // Function to filter feed of posts based on the Section
    const filterFeed = (sect) => {
        // If we want to filter feed specifically
        if (sect.toString().length > 0) {
            setListOfFilteredPosts(listOfPosts.filter(post => post.section.toString() === sect.toString()));
        } else {
            // Otherwise, show all posts
            setListOfFilteredPosts(listOfPosts); 
        }
    };

    return (
        <div>
            <div className="postPage">
                <div className="leftHome">
                    <ButtonGroup className="leftHomeBttnCol" vertical>
                        <Button onClick={() => filterFeed("")}>Home</Button>
                        <Button onClick={() => filterFeed("CS-121")}>CS-121</Button>
                        <Button onClick={() => filterFeed("CS-186")}>CS-186</Button>
                        <Button onClick={() => filterFeed("CS-187")}>CS-187</Button>
                        <Button onClick={() => filterFeed("CS-220")}>CS-220</Button>
                        <Button onClick={() => filterFeed("CS-230")}>CS-230</Button>
                        <Button onClick={() => filterFeed("Interview")}>Interview</Button>
                    </ButtonGroup>
                </div>
                <div className="middleHome">
                    {listOfFilteredPosts
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // Sort posts so latest one shows up on top
                        .map((value) => { // value = every object in listOfPosts
                            return (
                            <div className="post"> 
                                <div className="title">{value.section} {value.postType}: {value.title}</div>
                                <div className="body" onClick={() => {navigate(`/post/${value.id}`)}}>{value.postText}</div>
                                <div className="footer">
                                    <div className="username">
                                        <p onClick={() => {navigate(`/profile/${value.UserId}`)}}>{value.username}</p>
                                    </div>
                                    <div className="buttons">
                                        <ThumbUpAltIcon
                                            onClick={() => {
                                                likeAPost(value.id);
                                            }}
                                            className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                                        />
                                        <label> {value.Likes.length}</label>
                                        <ThumbDownAltIcon
                                            onClick={() => {
                                                dislikeAPost(value.id);
                                            }}
                                            className={dislikedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                                        />
                                        <label> {value.Dislikes.length}</label>
                                    </div>
                                </div>
                            </div>
                            );
                        }
                    )}
                </div>
                <div className="rightHome"></div>
            </div>
        </div>
    )
}

export default Home
