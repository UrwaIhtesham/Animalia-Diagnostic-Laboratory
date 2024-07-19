// import React, { useState} from "react";

// //import Chatbot from 'react-chatbot-kit';
// //import 'react-chatbot-kit/build/main.css';
// //import config from './chatbot/config';
// //import ActionProvider from './chatbot/ActionProvider';
// //import MessageParser from './chatbot/MessageParser';
// import Home from './home/home';
// import LandingPage from './Components/LandingPage/Landingpage'
// import Login from './Components/Login/Login'
// //import Appointment from "./Appointment/Appointment.js";
// import './App.css'


// function App() {
//   // const [state] = useState({});
//   // const stateRef = useRef(state);

//   // stateRef.current = state;

//   // return (
//   //   /*<div className="App">
//   //      <Chatbot
//   //         config={config}
//   //         messageParser={MessageParser}
//   //         actionProvider={ActionProvider}
//   //         avatarStyle={{
//   //           width: '50px',
//   //           height: '50px',
//   //         }}
//   //       />
        
//   //   </div>*/
//   //   //<Home/>
//   //   //<Appointment/>
//   //   <LandingPage/>
//   // );

//   const [showForm, setShowForm] = useState(false);
//   const [formMode, setFormMode] = useState('login');

//   const handleSignIn = () => {
//     console.log("Sign in clicked");
//     setFormMode('login');
//     setShowForm(true);
//   };

//   const handleSignUp = () => {
//     console.log("Sign up clicked");
//     setFormMode('signup');
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setShowForm(false);
//   };

//   return (

//   <div className="app">
//     {!showForm && <LandingPage onSignIn={handleSignIn} onSignUp={handleSignUp} />}
//     {showForm && (
//       <div className="overlay">
//         <div className="blurred-home">
//           <Home />
//         </div>
//         <div className="form-container">
//           <button className="close-button" onClick={closeForm}>X</button>
//           <Login mode={formMode} />
//         </div>
//       </div>
//     )}
//   </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Home from './home/home';
import LandingPage from './Components/LandingPage/Landingpage';
import Login from './Components/Login/Login';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('login');

  const handleSignIn = () => {
    setFormMode('login');
    setShowForm(true);
  };

  const handleSignUp = () => {
    setFormMode('signup');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={!showForm ? <LandingPage onSignIn={handleSignIn} onSignUp={handleSignUp} /> : (
            <div className="overlay">
              <div className="blurred-home">
                <Home />
              </div>
              <div className="form-container">
                <button className="close-button" onClick={closeForm}>X</button>
                <Login mode={formMode} />
              </div>
            </div>
          )} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
