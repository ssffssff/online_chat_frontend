import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import socketIO from 'socket.io-client';

const VideoChat = () => {
  const videoRef = useRef();
  const peerRef = useRef();
  const socket = socketIO('http://localhost:4500'); // Your signaling server

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        peerRef.current = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        peerRef.current.on('signal', (data) => {
          socket.emit('signal', data);
        });

        socket.on('signal', (data) => {
          peerRef.current.signal(data);
        });
      })
      .catch((error) => {
        // console.error('Error accessing camera/microphone:', error);
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};

export default VideoChat;
