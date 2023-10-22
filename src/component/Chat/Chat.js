import React, { useEffect, useState } from 'react'
import {user} from "../Join/Join";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/sendLogo.png";
import Message from "../Message/Message";
import ReactScrollToBottom  from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";
import logo from '../../images/logo.jpg';


let socket;
const ENDPOINT = "https://online-chat-backend-kszt.onrender.com/";


const Chat = () => {

    const [id,setid] = useState("");
    const [messages, setMessages] = useState([]);

    const send=()=>{
        const message = document.getElementById('chatInput').value;
        socket.emit('message',{message,id})

        document.getElementById('chatInput').value="";
    }
    // console.log(messages);
    useEffect(() => {
        socket = socketIO(ENDPOINT, {transports:['websocket'] });

        socket.on("connect",()=>{
            alert("Connected");
            setid(socket.id);
        })
        // console.log(socket);
        socket.emit('joined',{user})

        socket.on('welcome',(data)=>{
            setMessages([...messages,data]);
            // console.log(data.user, data.message)
        })

        socket.on('userJoined',(data)=>{
            setMessages([...messages,data]);
            // console.log(data.user,data.message);
        })

        socket.on('leave',(data) => {
            setMessages([...messages,data]);
            // console.log(data.user,data.message);
        })

        return () => {
            socket.emit('disconnnect');
            socket.off();
        }
    },[])

    useEffect(()=>{
        socket.on('sendMessage',(data)=>{
            setMessages([...messages,data]);
            // console.log(data,user,data.message,data.id);
        }) 
        return () =>{
            socket.off();
        }
    },[messages])

  return (
    <div className="chatPage">
        <div className="chatContainer">
            <div className="header"> 
                <img className='my1' src={logo} alt="" />
                <h2>Chit - Chat</h2>
                <a href="/"> <img className='my' src={closeIcon} alt="close" /></a>
            </div>
            <ReactScrollToBottom className="chatBox">
                {messages.map((item,i)=> <Message user={item.id === id? '' : item.user} message={item.message} classs={item.id === id? 'right' : 'left'}/>)}
            </ReactScrollToBottom>
            <div className="InputBox">
                {/* <input type="file" name="" id="" /> */}
                <input onKeyPress={(event)=>event.key === 'Enter'? send():null} type="text" id="chatInput" />
                <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send" /></button>
            </div>
        </div>
    </div>
  )
}

export default Chat