import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Allows us to create form for input/submission
import * as Yup from 'yup'; // Library to create validation easily
import axios from "axios"; // Library to make api calls

function Registration() {
    // Object that will store the data from inputs in form
    const initalValues = {
        username: "",
        password: "",
    };

    // Validation
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(), 
        password: Yup.string().min(4).max(20).required(), 
    });
    
    // Submit function that will make api call to POST data into database
    const onSubmit = (data) => { // Data contain username and password from input
        axios.post("http://localhost:3001/auth", data).then((response) => {
            console.log(response.data);

            // navigate("/"); // Navigate back to home page
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
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="username" 
                        placeholder="Create username" 
                    />
                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field 
                        autoComplete="off"
                        type="password"
                        id="inputCreatePost" 
                        name="password" 
                        placeholder="Create password" 
                    />
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration
