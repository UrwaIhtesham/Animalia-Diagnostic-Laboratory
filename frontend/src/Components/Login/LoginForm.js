import React, { Component } from 'react';
import Input from './Input';
import './login.css';
import axios from 'axios';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fullname: '',
      email: '',
      createpassword: '',
      repeatpassword: '',
      message: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { mode } = this.props;
    const { username, password, fullname, email, createpassword, repeatpassword } = this.state;

    try {
      if (mode === 'login') {
        const response = await axios.post('http://localhost:3001/login', { email: username, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        this.setState({ message: 'Login successful' });
      } else {
        if (createpassword !== repeatpassword) {
          this.setState({ message: 'Passwords do not match' });
          return;
        }
        
        const response= await axios.post('http://localhost:3001/register', { name: fullname, email,password: createpassword, confirmpassword: repeatpassword });
        if(response.status===401)
        {
            this.setState({message: 'Email Already exists'});
        }
        else if(response.status===201)
        {
            this.setState({ message: 'Registration successful' });
        }
      }
    } catch (error) {
      this.setState({ message: mode === 'login' ? 'Incorrect email or password' : 'Registration failed' });
      

    }
  };

  render() {
    const { mode } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-block__input-wrapper">
          <div className="form-group form-group--login">
            <Input
              type="email"
              id="username"
              label="user name"
              required={true}
              disabled={mode === 'signup'}
              onChange={this.handleChange}
            />
            <Input
              type="password"
              id="password"
              label="password"
              required={true}
              disabled={mode === 'signup'}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group form-group--signup">
            <Input
              type="text"
              id="fullname"
              label="full name"
              disabled={mode === 'login'}
              onChange={this.handleChange}
            />
            <Input
              type="email"
              id="email"
              label="email"
              disabled={mode === 'login'}
              onChange={this.handleChange}
            />
            <Input
              type="password"
              id="createpassword"
              label="password"
              disabled={mode === 'login'}
              onChange={this.handleChange}
            />
            <Input
              type="password"
              id="repeatpassword"
              label="repeat password"
              disabled={mode === 'login'}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <button className="button button--primary full-width" type="submit">
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
        {this.state.message && <p>{this.state.message}</p>}
      </form>
    );
  }
}

export default LoginForm;

