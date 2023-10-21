import React from 'react';
import "./Message.css";

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const twelveHourFormat = hours % 12 || 12; // Convert to 12-hour format
  const formattedHours = twelveHourFormat.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
};

const Message = ({ user, message, classs }) => {
  const time = getCurrentTime();

  const messageContent = user ? `${user}: ${message}` : `You: ${message}`;

  return (
    <div className={'messageBox ' + classs}>
      <div className="messageContent">{messageContent}</div>
      <div className="messageTime">{time}</div>
    </div>
  );
}

export default Message;
