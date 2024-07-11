import React from "react";

import './BotAvatar.css'
import chatbot from './chatbot.png'

const BotAvatar = () => {
    return (
    <div className="bot-avatar">
        <img src={chatbot} alt="avatar"/>
    </div>
    );
};

export default BotAvatar;