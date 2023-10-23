import React, { useEffect, useState } from 'react';
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/sendLogo.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";
import logo from '../../images/logo.jpg';
import {user} from "../Join/Join";
let socket;
const ENDPOINT = "https://online-chat-backend-kszt.onrender.com/";

const predefinedEmojis = ['😀', '👍', '❤️', '😂', '🔥', '👋', '🎉', '🙏', '🥇'];

const Chat = () => {
    const [id, setid] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    // Define your user data or object
    // const user = {
    //     // Define user properties here
    // };

    const send = () => {
        socket.emit('message', { message: messageText, id });
        document.getElementById('chatInput').value = "";
        setMessageText('');
        setIsEmojiPickerOpen(false);
    };

    const insertEmoji = (emoji) => {
        // Insert the selected emoji at the cursor position in the input box
        const input = document.getElementById('chatInput');
        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;
        const text = input.value;
        const newText = text.substring(0, startPos) + emoji + text.substring(endPos, text.length);
        setMessageText(newText);
        input.focus();
        input.setSelectionRange(startPos + emoji.length, startPos + emoji.length);
    };

    const toggleEmojiPicker = () => {
        setIsEmojiPickerOpen(!isEmojiPickerOpen);
    };

    useEffect(() => {
        socket = socketIO(ENDPOINT, { transports: ['websocket'] });

        socket.on("connect", () => {
            alert("Connected");
            setid(socket.id);
        });

        socket.emit('joined', { user });

        socket.on('welcome', (data) => {
            setMessages([...messages, data]);
        });

        socket.on('userJoined', (data) => {
            setMessages([...messages, data]);
        });

        socket.on('leave', (data) => {
            setMessages([...messages, data]);
        });

        return () => {
            socket.emit('disconnnect');
            socket.off();
        };
    }, []);

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setMessages([...messages, data]);
        });

        return () => {
            socket.off();
        };
    }, [messages]);

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <img className='my1' src={logo} alt="" />
                    <h2>Chit - Chat</h2>
                    <a href="/"> <img className='my' src={closeIcon} alt="close" /></a>
                </div>
                <ReactScrollToBottom className="chatBox">
                    {messages.map((item, i) => (
                        <Message
                            user={item.id === id ? '' : item.user}
                            message={item.message}
                            classs={item.id === id ? 'right' : 'left'}
                        />
                    ))}
                </ReactScrollToBottom>
                <div className="InputBox">
                <div className="emoji-picker">
                        <button
                            onClick={toggleEmojiPicker}
                            className="emoji-picker-button"
                        >
                            😃
                        </button>
                        {isEmojiPickerOpen && (
                            <div className="emoji-list">
                                {predefinedEmojis.map((emoji, index) => (
                                    <span
                                        key={index}
                                        role="img"
                                        aria-label={emoji}
                                        onClick={() => insertEmoji(emoji)}
                                    >
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                    onKeyPress={(event)=>event.key === 'Enter'? send():null}
                        type="text"
                        id="chatInput"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button onClick={send} className="sendBtn">
                        <img src={sendLogo} alt="Send" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
