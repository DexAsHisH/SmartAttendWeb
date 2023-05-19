import { Field, Form, Formik } from "formik"
import "./Login.scss"
import { Button } from "antd"

export const Login = () => {
    return <div className="login-page">
        <Formik initialValues={{ email: "", password: "" }} onSubmit={(values) => {
            console.log(values)
        }}>
            <Form>
                <div className="login-form">
                    <div className="login-form__title">SmartAttend</div>
                    <div className="login-form__input">
                        <Field name="email" type="email" placeholder="Email" />
                    </div>
                    <div className="login-form__input">
                        <Field name="password" type="password" placeholder="Password" />

                    </div>
                    <div className="login-form__button">
                        <Button type="primary">Login</Button>
                        </div>

                        </div>  
            </Form>
        </Formik>
                    
    </div>
}