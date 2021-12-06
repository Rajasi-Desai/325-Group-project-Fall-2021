import React, { useContext, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Allows us to create form for input/submission
import * as Yup from 'yup'; // Library to create validation easily
import axios from "axios"; // Library to make api calls
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    let navigate = useNavigate();
    
    // Object that will store the data from inputs in form
    const initalValues = {
        title: "",
        section: "CS-121",
        postType: "Note",
        postText: "",
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, []);

    // Validation
    const validationSchema = Yup.object().shape({
        // Validates that title must be a string (w/ custom title)
        title: Yup.string().min(3).required("You must have a Title!"), 
        
        // Validates that section must be picked
        section: Yup.string().min(1).required("You must input a section for this post! (Ex: Interview, CS-121, etc)"), 
        
        // Validate that type of post is indicated
        postType: Yup.string().min(1).required("You must select the type of this post"), 

        // Validates that postText must be a string with at least 1 character
        postText: Yup.string().min(1).required(),
    });

    // Submit function that will make api call to POST data into database
    const onSubmit = (data) => {
        axios
          .post("http://localhost:3001/posts", data, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          })
          .then((response) => {
            navigate("/");
          });
    };

    return (
        <div className="createPostPage">
            <Formik 
                initialValues={initalValues} 
                onSubmit={onSubmit} 
                validateSchema={validationSchema}
            >
                <Form className="formContainer">
                    <h1>Create Post</h1>
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="title" 
                        placeholder="Enter title of your post" 
                    />
                    
                    <label>Section: </label>
                    <ErrorMessage name="section" component="span" />
                    <Field 
                        component="select"
                        id="inputCreatePost" 
                        name="section"
                    >
                        <option value="CS-121">CS-121</option>
                        <option value="CS-186">CS-186</option>
                        <option value="CS-187">CS-187</option>
                        <option value="CS-220">CS-220</option>
                        <option value="CS-230">CS-230</option>
                        <option value="Interview">Interview</option>
                    </Field>

                    <label>Type: </label>
                    <ErrorMessage name="postType" component="span" />
                    <Field 
                        component="select"
                        id="inputCreatePost" 
                        name="postType"
                    >
                        <option value="Note">Note</option>
                        <option value="Question">Question</option>
                        <option value="Other">Other</option>
                    </Field>
                    
                    <label>Message: </label>
                    <ErrorMessage name="postText" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePostMessage" 
                        name="postText" 
                        placeholder="Type in your message"
                    />
                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    )
}

export default CreatePost;