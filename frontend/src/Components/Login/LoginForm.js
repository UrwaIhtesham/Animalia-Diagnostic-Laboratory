import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Input from './Input';
import './login.css';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const LoginForm = ({ mode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'fullname':
        setFullname(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'createpassword':
        setCreatePassword(value);
        break;
      case 'repeatpassword':
        setRepeatPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        const response = await axios.post('http://localhost:5000/login', { email: username, password },{withCredentials:true});
        console.log('Login Response:', response);
        localStorage.setItem('token', response.data.token)
        // localStorage.setItem('token', response.data.access_token);
        // console.log(response.data.access_token);
        setMessage('Login successful');
        setTimeout(() => {
          const successfulemail= response.data.email;
          console.log("Email in LoginFOrm",successfulemail );
          localStorage.setItem('userEmail', successfulemail);
          login();
          if(response.data.email === 'admin@gmail.com')
          {
            navigate('/dashboard');
          }
          else
          {
            navigate('/home');
          }
          
        }, 2000);
      } else if (mode === 'signup') {
        if (createPassword !== repeatPassword) {
          setMessage('Passwords do not match');
          return;
        }

        const response = await axios.post('http://localhost:5000/register', {
          name: fullname,
          email,
          password: createPassword,
          confirm_password: repeatPassword
        });

        console.log('Register Response:', response);

        if (response.status === 401) {
          setMessage('Email Already exists');
        } else if (response.status === 201) {
          setMessage('Registration successful');
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Error Response:', error.response);
      setMessage(mode === 'login' ? 'Incorrect email or password' : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-block__input-wrapper">
        <div className="form-group form-group--login">
          <Input
            type="email"
            id="username"
            label="User name"
            className="input-text"
            required={true}
            disabled={mode === 'signup'}
            onChange={handleChange}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            className="input-text"
            required={true}
            disabled={mode === 'signup'}
            onChange={handleChange}
          />
        </div>
        <div className="form-group form-group--signup">
          <Input
            type="text"
            id="fullname"
            label="Full name"
            className="input-text"
            disabled={mode === 'login'}
            onChange={handleChange}
          />
          <Input
            type="email"
            id="email"
            label="Email"
            className="input-text"
            disabled={mode === 'login'}
            onChange={handleChange}
          />
          <Input
            type="password"
            id="createpassword"
            label="Password"
            className="input-text"
            disabled={mode === 'login'}
            onChange={handleChange}
          />
          <Input
            type="password"
            id="repeatpassword"
            label="Repeat password"
            className="input-text"
            disabled={mode === 'login'}
            onChange={handleChange}
          />
        </div>
      </div>
      <button className="button button--primary full-width" type="submit">
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </button>
      {message && <p className='message'>{message}</p>}
    </form>
  );
};

export default LoginForm;
