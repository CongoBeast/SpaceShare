
import React, { useState } from 'react';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import axios from "axios";

export default function MessageInput({ chat , addMessage}) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
  
    setLoading(true);

    if(localStorage.user === chat.recieverName){
     console.log("this is true")

      const newMessage = {
      chatId: chat._id,
      recieverName: chat.recieverName,
      userName: chat.userName,
      userId: chat.userId,
      recieverID: chat.recieverID,
      message,
      timeCreated: new Date().toISOString(),
      read: false,
    };

    try {
      // First, send the new message
      await axios.post('https://spaceshare-backend.onrender.com/send-message', newMessage);
      
      // Then update the chat's last message and timestamp
      await axios.put(`https://spaceshare-backend.onrender.com/edit-chats/${chat._id}`, {
        lastMessage: message,
        lastTimestamp: new Date().toISOString(),
        read: false
      });
      
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  
    addMessage(newMessage);
    setLoading(false);

    }
    else{
      console.log("this is false")

    const newMessage = {
      chatId: chat._id,
      recieverName: chat.userId,
      userName: chat.userName,
      userId: chat.recieverName,
      recieverID: chat.recieverID,
      message,
      timeCreated: new Date().toISOString(),
      read: false,
    };

    try {
      // First, send the new message
      await axios.post('https://spaceshare-backend.onrender.com/send-message', newMessage);
      
      // Then update the chat's last message and timestamp
      await axios.put(`https://spaceshare-backend.onrender.com/edit-chats/${chat._id}`, {
        lastMessage: message,
        lastTimestamp: new Date().toISOString(),
        read: false
      });
      
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  
    addMessage(newMessage);
    setLoading(false);

    }
  
    // const newMessage = {
    //   chatId: chat._id,
    //   recieverName: chat.recieverName,
    //   userName: chat.userName,
    //   userId: chat.userId,
    //   recieverID: chat.recieverID,
    //   message,
    //   timeCreated: new Date().toISOString(),
    //   read: false,
    // };

    // console.log(newMessage)
  
    // try {
    //   // First, send the new message
    //   await axios.post('http://localhost:3001/send-message', newMessage);
      
    //   // Then update the chat's last message and timestamp
    //   await axios.put(`http://localhost:3001/edit-chats/${chat._id}`, {
    //     lastMessage: message,
    //     lastTimestamp: new Date().toISOString()
    //   });
      
    //   setMessage('');
    // } catch (err) {
    //   console.error('Error sending message:', err);
    // }
  
    // addMessage(newMessage);
    // setLoading(false);
  };
  
  return (
    <InputGroup>
      <Form.Control
        placeholder="Type message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
      />
      <Button variant="primary" onClick={handleSend} disabled={loading}>
        {loading ? (
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
          'Send'
        )}
      </Button>
    </InputGroup>
  );
}
