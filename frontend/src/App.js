import React, { useState, useRef } from "react";
//import Chatbot from 'react-chatbot-kit';
//import 'react-chatbot-kit/build/main.css';
//import config from './chatbot/config';
//import ActionProvider from './chatbot/ActionProvider';
//import MessageParser from './chatbot/MessageParser';
import LandingPage from "./Components/LandingPage/Landingpage";
import './App.css'

function App() {
  const [state] = useState({});
  const stateRef = useRef(state);

  stateRef.current = state;

  return (
    <div className="App">
        {/* <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          avatarStyle={{
            width: '50px',
            height: '50px',
          }}
        /> */}
        <LandingPage/>
    </div>
  );
}

export default App;
