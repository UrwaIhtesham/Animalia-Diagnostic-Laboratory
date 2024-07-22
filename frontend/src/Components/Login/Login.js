import React, {Component} from "react";
import LoginForm from './LoginForm';
class Login extends Component{
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            mode: this.props.mode
        }
        console.log(this.state);
    }

    toggleMode = () => {
        const newMode = this.state.mode === 'login' ? 'signup' : 'login';
        this.setState({ mode: newMode });
    }

    handleSubmit =(e) => {
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <div className={`form-block-wrapper form-block-wrapper--is-${this.state.mode}`}></div>
                <section className={`form-block form-block--is-${this.state.mode}`}>
                    <header className="form-block__header">
                        <h1>{this.state.mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
                        <div className="form-block__toggle-block">
                            <span>{this.state.mode === 'login' ? 'Don\'t' : 'Already'} have an account?<br></br> Click here &#8594;</span>
                            <input id="form-toggler" type="checkbox" onClick={this.toggleMode} />
                            <label htmlFor="form-toggler"></label>
                        </div>
                    </header>
                    {
                    <LoginForm mode={this.state.mode} onSubmit={this.props.onSubmit} />
                    }
                </section>
            </div>
        )
    }

}
export default Login