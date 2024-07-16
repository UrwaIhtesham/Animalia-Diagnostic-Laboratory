import React, { useState, useRef } from "react";

//import Chatbot from 'react-chatbot-kit';
//import 'react-chatbot-kit/build/main.css';
//import config from './chatbot/config';
//import ActionProvider from './chatbot/ActionProvider';
//import MessageParser from './chatbot/MessageParser';
//import Home from './home/home';
//import LandingPage from './Components/LandingPage/Landingpage'
import Appointment from "./Appointment/Appointment.js";
import './App.css'


function App() {
  const [state] = useState({});
  const stateRef = useRef(state);

  stateRef.current = state;

  return (
    /*<div className="App">
       /*<Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          avatarStyle={{
            width: '50px',
            height: '50px',
          }}
        />
    </div>*/
    //<Home/>
    <div className="app">
      <Appointment />
    </div>

    
    //<LandingPage/>
  );
}

export default App;
