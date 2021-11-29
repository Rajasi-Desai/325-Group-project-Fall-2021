import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Allows us to create form for input/submission
import * as Yup from 'yup'; // Library to create validation easily
import axios from "axios"; // Library to make api calls
import { useNavigate } from 'react-router-dom';

function Report() {
    let navigate = useNavigate();
    
    // Object that will store the data from inputs in form
    const initalValues = {
        type: "",
        details: "",
    };

    // Validation
    const validationSchema = Yup.object().shape({
        // Validates that title must be a string 
        // (details is optional, so no need for validation)
        type: Yup.string().required(), 
    });

    // Submit function that will make api call to POST data into database
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/reports", data).then((response) => {
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
                {/* <label>Report Post</label> */}
                <Form className="formContainer">
                    <label>Report post for: </label>
                    <ErrorMessage name="type" component="span" />
                    <Field 
                        component="select"
                        id="inputReport" 
                        name="type" 
                    >
                        <option value="cheating">Cheating</option>
                        <option value="inappropriate">Inappropriate Content</option>
                    </Field>
                    <label>Details: </label>
                    <ErrorMessage name="details" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputReport" 
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
