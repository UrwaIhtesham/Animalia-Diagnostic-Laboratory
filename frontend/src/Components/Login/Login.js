// import React, {Component} from "react";
// import LoginForm from './LoginForm';
// import { useMediaQuery } from "react-responsive";

// class Login extends Component{
//     constructor(props) {
//         super(props);
//         console.log(props);
//         this.state = {
//             mode: this.props.mode
//         }
//         console.log(this.state);
//     }

//     toggleMode = () => {
//         const newMode = this.state.mode === 'login' ? 'signup' : 'login';
//         this.setState({ mode: newMode });
//     }

//     handleSubmit =(e) => {
//         e.preventDefault();
//     }

//     render() {
//         const isMobile = useMediaQuery({query: '(max-width:425px'});
//         const isTablet = useMediaQuery({query: '(max-width: 768px'});

//         return (
//             <div>
//                 <div className={`form-block-wrapper form-block-wrapper--is-${this.state.mode}`}></div>
//                 <section className={`form-block form-block--is-${this.state.mode}`}>
//                     <header className="form-block__header">
//                         <h1>{this.state.mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
//                         <div className="form-block__toggle-block">
//                             <span>{this.state.mode === 'login' ? 'Don\'t' : 'Already'} have an account?<br></br> Click here &#8594;</span>
//                             <input id="form-toggler" type="checkbox" onClick={this.toggleMode} />
//                             <label htmlFor="form-toggler"></label>
//                         </div>
//                     </header>
//                     {
//                     <LoginForm mode={this.state.mode} onSubmit={this.props.onSubmit} />
//                     }
//                 </section>
//             </div>
//         )
//     }

// }
// export default Login

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
