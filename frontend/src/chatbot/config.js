import { createChatBotMessage } from 'react-chatbot-kit';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';
import SymptomsDropdown from './SymptomsDropdown';

//import avatar from './Avatar';

const config = {
  initialMessages: [createChatBotMessage(`Hi. Please enter your animal category!`)],
  botName: 'Doctor',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#474d5e',
    },
    chatButton: {
      backgroundColor: '#474d5e',
    },
  },
  customComponents:{

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