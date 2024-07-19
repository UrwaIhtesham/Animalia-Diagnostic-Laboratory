// import React, { useState, useNavigate, Component } from 'react';
// import Input from './Input';
// import './login.css';
// import axios from 'axios';

// class LoginForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: '',
//       password: '',
//       fullname: '',
//       email: '',
//       createpassword: '',
//       repeatpassword: '',
//       message: ''
//     };
//   }

//   handleChange = (e) => {
//     this.setState({ [e.target.id]: e.target.value });
//   };

//   handleSubmit = async (e) => {
//     e.preventDefault();
//     const { mode } = this.props;
//     const {fullname, email, password, createpassword, repeatpassword} = this.state;
//   //   const { fullname, email, password, createpassword, repeatpassword } = this.state;

//   //   try {
//   //     if (mode === 'login') {
//   //       const response = await axios.post('http://localhost:5000/login', { email, password: createpassword });
//   //       console.log('Login Response:', response); // Log the entire response
//   //       const { token } = response.data;
//   //       console.log('Login Token:', token); // Log the token
//   //       localStorage.setItem('token', token);
//   //       this.setState({ message: 'Login successful' });
//   //     } else if (mode === 'signup'){
        
//   //       if (createpassword !== repeatpassword) {
//   //         this.setState({ message: 'Passwords do not match' });
//   //         return;
//   //       }

//   //       const response= await axios.post('http://localhost:5000/register', { name: fullname, email,password: createpassword, confirmpassword: repeatpassword });
//   //       console.log('Register Response:', response); // Log the entire response
//   //       if(response.status===401)
//   //       {
//   //           this.setState({message: 'Email Already exists'});
//   //       }
//   //       else if(response.status===201)
//   //       {
//   //           this.setState({ message: 'Registration successful' });
//   //       }
//   //     }
//   //   }
//   //   } catch (error) {
//   //     console.error('Error:', error); // Log the error
//   // console.log('Error Response:', error.response); // Log the error response if it exists
//   //     this.setState({ message: mode === 'login' ? 'Incorrect email or password' : 'Registration failed' });
      

//   //   }

//     //const {username, password, fullname, email, createpassword, repeatpassword} = this.state;
//     //let data = {email, password};

//     if (mode === 'signup') {
//       const [name, setName] = useState('');
//       const [email, setEmail] = useState('');
//       const [password, setPassword] = useState('');

//       // if (createpassword!== repeatpassword){
//       //   this.setState({message: 'Passwords do not match'});
//       //   return;
//       // }
//       // const data = {name: fullname, email, password:createpassword, confirm_password: repeatpassword};
  

//       // try {
//       //   console.log("Inside sign up")
//       //   const response = await axios.post('http://localhost:5000/register', data);
//       //   console.log(response.data);
//       //   if(response.status === 201){
//       //     this.setState({message: 'Registration successful'});
//       //   }
//       //   else {
//       //     this.setState({message: 'Registration failed'});
//       //   }
//       // } catch (error){
//       //   // console.error('Error: ', error.response.data);
//       //   // this.setState({message: error.response.data.message || 'An error occurred'});
//       //   console.error('Error:', error);
//       //   if (error.response) {
//       //     console.error('Error Response: ', error.response.data);
//       //     this.setState({message: error.response.data.message || 'An error occurred'});
//       //   } else {
//       //     this.setState({message: 'An error occurred'});
//       //   }
//       // }

//       axios.post('http://localhost/register', {
//         name: name,
//         email: email,
//         password: password
//       })
//       .then(function(response){
//         console.log(response);
//         console.log(response.status);
//       })
//       .catch(function (error) {
//         console.log(error, 'error');
//         if (error.response.status === 401){
//           alert("Invalid credentials");
//         }
//       })
//     } else if (mode === 'login'){
//       // const data = {email, password};
//       // try {
//       //   console.log("Inside login")
//       //   const response = await axios.post('http://localhost:5000/login', data);
//       //   console.log(response.data);

//       //   if (response.status === 200){
//       //   this.setState({message: 'Login successful!'});
//       //   } else{
//       //     this.setState({message: 'Login failed'});
//       //   }
//       // } catch (error){
//       //   console.error('Error: ', error);
//       //   if (error.response) {
//       //     console.error('Error Response: ', error.response.data);
//       //     this.setState({message: error.response.data.message || 'An error occurred'});
//       //   } else {
//       //     this.setState({message: 'An error occurred'});
//       //   }

//       //   //this.setState({message: error.response.data.message || 'An error occurred'});
//       // }
//       const [email,setEmil] = useState('');
//       const [password, setPassword] = useState('');

//       //const navigate = useNavigate();

//       if (email.length === 0){
//         alert ("Email has left blank!");
//       } else if (password.length === 0){
//         alert("Password has left Blank!");
//       } else {
//           axios.post('http://localhost:5000/login', {
//             email: email,
//             password:password
//           })
//           .then(function(response){
//             console.log(response);
//             console.log(response.status)
//           })
//           .catch(function(error){
//             console.log(error, 'error');
//             if (error.response.status === 401){
//               alert("Invalid credentials");
//             }
//           });
//         }
//     }

//   };

//   render() {
//     const { mode } = this.props;
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <div className="form-block__input-wrapper">
//           <div className="form-group form-group--login">
//             <Input
//               type="email"
//               id="username"
//               label="User name"
//               className="input-text"
//               required={true}
//               disabled={mode === 'signup'}
//               onChange={this.handleChange}
//             />
//             <Input
//               type="password"
//               id="password"
//               label="Password"
//               className="input-text"
//               required={true}
//               disabled={mode === 'signup'}
//               onChange={this.handleChange}
//             />
//           </div>
//           <div className="form-group form-group--signup">
//             <Input
//               type="text"
//               id="fullname"
//               label="Full name"
//               className="input-text"
//               disabled={mode === 'login'}
//               onChange={this.handleChange}
//             />
//             <Input
//               type="email"
//               id="email"
//               label="Email"
//               className="input-text"
//               disabled={mode === 'login'}
//               onChange={this.handleChange}
//             />
//             <Input
//               type="password"
//               id="createpassword"
//               label="Password"
//               className="input-text"
//               disabled={mode === 'login'}
//               onChange={this.handleChange}
//             />
//             <Input
//               type="password"
//               id="repeatpassword"
//               label="Repeat password"
//               className="input-text"
//               disabled={mode === 'login'}
//               onChange={this.handleChange}
//             />
//           </div>
//         </div>
//         <button className="button button--primary full-width" type="submit">
//           {mode === 'login' ? 'Log In' : 'Sign Up'}
//         </button>
//         {this.state.message && <p className='message'>{this.state.message}</p>}
//       </form>
//     );
//   }
// }

// export default LoginForm;

import React, { useState } from 'react';
import Input from './Input';
import './login.css';
import axios from 'axios';

const LoginForm = ({ mode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');

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
        const response = await axios.post('http://localhost:5000/login', { email: username, password });
        console.log('Login Response:', response);
        const { token } = response.data;
        console.log('Login Token:', token);
        localStorage.setItem('token', token);
        setMessage('Login successful');
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
