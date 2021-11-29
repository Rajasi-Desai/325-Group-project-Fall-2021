import React, { useContext, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Allows us to create form for input/submission
import * as Yup from 'yup'; // Library to create validation easily
import axios from "axios"; // Library to make api calls
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();
    
    // Object that will store the data from inputs in form
    const initalValues = {
        title: "",
        postText: "",
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            // history.pushState("/login");
            navigate("/login");
        }
    }, []);

    // Validation
    const validationSchema = Yup.object().shape({
        // Validates that title must be a string (w/ custom title)
        title: Yup.string().min(3).required("You must have a Title!"), 
        // Validates that title must be a string 
        postText: Yup.string().min(3).required(),
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
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="title" 
                        placeholder="(Ex: Title)" 
                    />
                    <label>Post: </label>
                    <ErrorMessage name="postText" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="postText" 
                        placeholder="(Ex: This is a message)" 
                    />
                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    )
}

export default CreatePost;