import { Field, Form, Formik } from "formik"
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss"
import { useDispatch } from "react-redux";
import http from 'axios'
import { setAuthenticated } from '../../../store/authentication';
import { setUserDetails } from '../../../store/userDetails';
import {
    UserOutlined,
    VideoCameraOutlined,
    ProfileOutlined
  } from '@ant-design/icons';


export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (values : any) => {
        console.log('signing');

        http.post('http://0.0.0.0:8000/login', { email: values.email, password: values.password }).then((response) => {
            dispatch(setAuthenticated(true))
            dispatch(setUserDetails(response.data))
            // console.log()
            
            // console.log(response.data)
            // const googleresponse = {
            //     name:response.data.username,
            //          email: '',
            //          token: '',
            //          image: `https://avatars.dicebear.com/api/gridy/${Math.floor(Math.random() * 5000)}.svg`,
            //          userId: response.data.userid,
            //        };
            //        console.log(googleresponse)
                 //  dispatch(setUserDetails(googleresponse))
                   navigate("/dashboard")
        }).catch((err) => {
            console.log("Error", err)
        })
    }

    return <div className="login-page">
        <div className="login-page__form">
            <Formik initialValues={{ email: "", password: ""}} onSubmit={handleLogin}>
                <Form className="login-page__form">
                    <div className="login-page__form-title">SmartAttend</div>
                    <div className="login-page__form-heading"></div>
                    <div className="login-page__form-input">
                        <Field name="email" type="email" placeholder="Email" />
                    </div>
                    <div className="login-page__form-input">
                        <Field name="password" type="password" placeholder="Password" />
                    </div>
                    <div className="login-page__form-button">
                        <button type="submit">Login</button>
                    </div>
                </Form>
            </Formik>
            <div className="login-page__form-button">
                <Link to={"/signup"}>Signup</Link>
            </div>
        </div>
    </div>
}