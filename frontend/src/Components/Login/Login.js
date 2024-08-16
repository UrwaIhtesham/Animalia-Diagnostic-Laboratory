import React, { useState } from "react";
import LoginForm from './LoginForm';
import { useMediaQuery } from "react-responsive";

const Login = (props) => {
    const [mode, setMode] = useState(props.mode);

    const isMobile = useMediaQuery({query: '(max-width:425px'});
    const isTablet = useMediaQuery({query: '(max-width: 768px'});


    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
    }

    return (
        <div className={`formlogin ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
            <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>
            <section className={`form-block form-block--is-${mode}`}>
                <header className="form-block__header">
                    <h1>{mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
                    <div className="form-block__toggle-block">
                        <span>{mode === 'login' ? 'Don\'t' : 'Already'} have an account?<br /> Click here &#8594;</span>
                        <input id="form-toggler" type="checkbox" onClick={toggleMode} />
                        <label htmlFor="form-toggler"></label>
                    </div>
                </header>
                <LoginForm mode={mode} onSubmit={props.onSubmit} />
            </section>
        </div>
    );
}

export default Login;
