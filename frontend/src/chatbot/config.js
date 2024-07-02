import { createChatBotMessage } from 'react-chatbot-kit';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';
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
  state: {},
  actionProvider: new ActionProvider(), // Make sure to instantiate with correct arguments if needed
  messageParser: new MessageParser()
  
};

export default config;