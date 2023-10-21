import React, { useState, useEffect } from 'react';
import './Join.css';
import logo1 from '../../images/logo1.jpg';
import { Link } from 'react-router-dom';


let user;

const Join = () => {
  const [name, setName] = useState('');

  // Animated text
  const greetingText = "WelCome to \nSaurabh Gawali's \nGroup Chat";
  const [animatedText, setAnimatedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  // Function to add the next character
  const typeWriterEffect = () => {
    if (charIndex < greetingText.length) {
      setAnimatedText((prevText) => {
        const char = greetingText.charAt(charIndex);
        return prevText + char;
      });
      
      setCharIndex(charIndex + 1);
    }
  };

  useEffect(() => {
    const timer = setInterval(typeWriterEffect, 80); // Delay between characters
    return () => clearInterval(timer); // Cleanup on component unmount
  }, [charIndex]);

  const sendUser = () => {
    user = document.getElementById('JoinInput').value;
    console.log(user);
    document.getElementById('JoinInput').value = '';
  };

  return (
    <div className="JoinPage">
      {/* <div className="animated-text">{animatedText}</div> */}
      <div className="animated-text left-corner">{animatedText}</div>
      <div className="JoinContainer">
        <img src={logo1} alt="" />
        <h1>What's App</h1>
        <input onChange={(e) => setName(e.target.value)} placeholder="Enter Your good name" type="text" id="JoinInput" />
        
        <Link onClick={(event) => !name ? event.preventDefault() : null} to="/chat">
          <button onClick={sendUser} className="Joinbtn">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join
export {user}