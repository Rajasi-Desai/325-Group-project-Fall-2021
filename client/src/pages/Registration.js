import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Allows us to create form for input/submission
import * as Yup from 'yup'; // Library to create validation easily
import axios from "axios"; // Library to make api calls
import { useNavigate } from 'react-router-dom';

function Registration() {
    let navigate = useNavigate();

    // Object that will store the data from inputs in form
    const initalValues = {
        username: "",
        email: "",
        password: "",
    };

    // Validation
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(), 
        email: Yup.string().min(1).required(), 
        password: Yup.string().min(4).max(20).required(), 
    });

    // Function to login via "Enter" key
    const onEnterKey = (event) => {
        if(event.key === 'Enter'){
          onSubmit();
        }
    };
    
    // Submit function that will make api call to POST data into database
    const onSubmit = (data) => { // Data contain username and password from input
        axios.post("http://localhost:3001/auth", data).then((response) => {
            console.log(response.data);
            alert("You are successfully signed up! You will now be sent to the login in, so please log in with your username and password.");
            navigate("/login"); // Navigate to login page
        });
    };

    return (
        <div>
            <Formik 
                initialValues={initalValues} 
                onSubmit={onSubmit} 
                validateSchema={validationSchema}
            >
                <Form className="formContainer">
                    <h1>Registration</h1>
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="username" 
                        placeholder="Create username" 
                    />
                    <label>UMass Email: </label>
                    <ErrorMessage name="email" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="email" 
                        placeholder="Ex: user@umass.edu" 
                    />
                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field 
                        autoComplete="off"
                        type="password"
                        id="inputCreatePost" 
                        name="password" 
                        placeholder="Create password" 
                        onKeyPress={onEnterKey}
                    />
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration
