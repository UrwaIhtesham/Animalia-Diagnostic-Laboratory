import { createChatBotMessage } from 'react-chatbot-kit';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';
import SymptomsDropdown from './SymptomsDropdown';
import React from 'react';
import BotAvatar from '../Components/BotAvatar/BotAvatar';

//import avatar from './Avatar';

const config = {
  initialMessages: [createChatBotMessage(<React.Fragment>
    Hi.<br /> <br/>
    WELCOME TO ANIMALIA DIAGNOSTIC CENTRE. <br/> <br/>
    Please Enter your Animal Category (Pets, Livestock, Poultry)
  </React.Fragment>)],
  botName: 'Animalia',
  customStyles: {
    botMessageBox: 'bg-lightgray text-black text-lg',
      //backgroundColor: 'lightgray',
      //color: 'black',
      //fontSize: 'larger',
    chatButton: {
      backgroundColor: 'maroon',
    },
  },
  customComponents:{
    botAvatar: (props) => <BotAvatar {...props}/>
  },
  
  widgets: [
    {
      widgetName: "SymptomsDropdown",
      widgetFunc: (props) => <SymptomsDropdown {...props} />,

    }
],

  state: {},
  actionProvider: new ActionProvider(), 
  messageParser: new MessageParser(),
  
  
};

export default config;