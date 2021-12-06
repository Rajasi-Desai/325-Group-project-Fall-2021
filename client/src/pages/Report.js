import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Allows us to create form for input/submission
import * as Yup from 'yup'; // Library to create validation easily
import axios from "axios"; // Library to make api calls
import { useParams, useNavigate } from 'react-router-dom';

function Report() {
    var id = 0;
    let navigate = useNavigate();
    
    // Object that will store the data from inputs in form
    const initalValues = {
        type: "cheating/plagiarism",
        details: "",
    };

    // useEffect to grab the PostId that was obtained from the previous page
    useEffect(() => {
        id = sessionStorage.getItem('PostId'); // Id represents postId passed in, so we know which user we want to query for the profile page
        sessionStorage.removeItem('PostId');
    }, []);

    // Validation
    const validationSchema = Yup.object().shape({
        // Validates that title must be a string 
        // (details is optional, so no need for validation)
        type: Yup.string().required(), 
    });

    // Submit function that will make api call to POST data into database
    const onSubmit = (data) => {
        console.log("id: " + id);
        axios.post(`http://localhost:3001/reports`, {
            postId: id,
            details: data, 
        }, {
            headers: { accessToken: localStorage.getItem("accessToken") },
        }).then((response) => {
            alert("Report Submitted!");
            navigate("/"); // Navigate back to home page
        });
    };

    return (
        <div className="fileReportPage">
            <Formik 
                initialValues={initalValues} 
                onSubmit={onSubmit} 
                validateSchema={validationSchema}
            >
                <Form className="formContainer">
                    <h1>Report</h1>
                    <h4>Report post for: </h4>
                    <ErrorMessage name="type" component="span" />
                    <Field 
                        component="select"
                        id="inputReport" 
                        name="type" 
                    >
                        <option value="cheating/plagiarism">Cheating/Plagiarism</option>
                        <option value="inappropriate">Inappropriate Content</option>
                    </Field>
                    <h4>Details: </h4>
                    <ErrorMessage name="details" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputReportDetails" 
                        name="details" 
                        placeholder="(optional)" 
                    />
                    <button type="submit">Submit Report</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Report
