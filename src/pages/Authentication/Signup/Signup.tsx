import { Field, Form, Formik } from "formik"
import "./Signup.scss"
import { Link, useNavigate } from "react-router-dom"
import http from 'axios'

export const Signup = () => {

    const navigate = useNavigate();

    const handleSignIn = (value : any) => {

        console.log('signing');
        http.post('http://0.0.0.0:8000/signup', { name: value.name, email: value.email, password: value.password, role: value.role }).then((response) => {
            navigate("/login")
        }).catch((err) => {
            console.log("Error", err)
        })
    }

    return <div className="signup-page">
         <div className="signup-page__form">
        <Formik initialValues={{ email: "", password: "", role: "student" }} onSubmit={handleSignIn}>
            <Form className="signup-page__form">
                <div className="signup-page__form">
                    <div className="signup-page__form-title">SmartAttend</div>
                    <div className="signup-page__form-heading">Signup</div>
                    <div className="signup-page__form-input">
                        <Field name="name" type="text" placeholder="Name" />
                    </div>
                    <div className="signup-page__form-input">
                        <Field name="email" type="email" placeholder="Email" />
                    </div>
                    <div className="signup-page__form-input">
                        <Field name="password" type="password" placeholder="Password" />

                    </div>
                    <div className="signup-page__form-input">
                        <Field name="confirm-password" type="password" placeholder="Confirm password" />

                    </div>
                    <div className="signup-page__select">
                        <Field name="role" as="select">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </Field>
                    </div>
                    <div className="signup-page__form-button">
                        <button type="submit">Signup</button>
                        </div>

                        </div>  
            </Form>
        </Formik>
        <Link to={"/login"}>Back to Login</Link>   
        </div>
    </div>
}