import React, { useState , useRef } from 'react';
import { Form, Button, InputGroup, Spinner, Image } from 'react-bootstrap';
import axios from "axios";

export default function MessageInput({ chat , sendMessage}) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);


  const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSend = async () => {

    if (!message.trim() && !imageFile) return;
  
    setLoading(true);

    if(localStorage.user === chat.recieverName || localStorage.getItem('companyName') === chat.recieverName){
     console.log("this is true")

    const newMessage = {
      _id: generateId(),
      chatId: chat._id,
      recieverName: chat.userId,
      userName: chat.userName,
      userId: chat.recieverName,
      recieverID: chat.recieverID,
      type: imageFile ? 'image' : 'text',
      imageLink: '',
      message,
      timeCreated: new Date().toISOString(),
      read: false,
    };

    console.log(imageFile ? 'image' : 'text')

    try {

      
      // If there's an image, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('chatId', chat._id);

        console.log(imageFile)
        
        const uploadResponse = await axios.post(
          'https://spaceshare-backend.onrender.com/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        message = " • Photo"
        
        newMessage.imageLink = uploadResponse.data.url;

        console.log(uploadResponse.data.url)
      }
      // First, send the new message
      await axios.post('https://space-share-chat-nw7k.onrender.com/send-message', newMessage);
      
      // Then update the chat's last message and timestamp
      await axios.put(`https://space-share-chat-nw7k.onrender.com/edit-chats/${chat._id}`, {
        lastMessage: message,
        lastTimestamp: new Date().toISOString(),
        read: false
      });
      
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  
    // addMessage(newMessage);
    sendMessage(newMessage)
    setLoading(false);

    }
    else{

    const newMessage = {
        _id: generateId(),
      chatId: chat._id,
      recieverName: chat.recieverName,
      userName: chat.userName,
      userId: chat.userId,
      recieverID: chat.recieverID,
      type: imageFile ? 'image' : 'text',
      imageLink: '',
      message,
      timeCreated: new Date().toISOString(),
      read: false,
    };

    try {

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('chatId', chat._id);

        console.log(imageFile)
        
        const uploadResponse = await axios.post(
          'https://spaceshare-backend.onrender.com/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        newMessage.imageLink = uploadResponse.data.url;
      }
      // First, send the new message
      await axios.post('https://space-share-chat-nw7k.onrender.com/send-message', newMessage);
      
      // Then update the chat's last message and timestamp
      await axios.put(`https://space-share-chat-nw7k.onrender.com/edit-chats/${chat._id}`, {
        lastMessage: message,
        lastTimestamp: new Date().toISOString(),
        read: false
      });
      
      setMessage('');
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  
    sendMessage(newMessage)
    setLoading(false);

    }
  };
  
  return (
    // <InputGroup>
    //   <Form.Control
    //     placeholder="Type message here"
    //     value={message}
    //     onChange={(e) => setMessage(e.target.value)}
    //     disabled={loading}
    //   />
    //   <Button variant="primary" onClick={handleSend} disabled={loading}>
    //     {loading ? (
    //       <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
    //     ) : (
    //       'Send'
    //     )}
    //   </Button>
    // </InputGroup>
        <div className="message-input-container">
          {imagePreview && (
            <div className="image-preview-container mb-2">
              <Image src={imagePreview} thumbnail className="message-image-preview" />
              <Button 
                variant="danger" 
                size="sm" 
                className="remove-image-btn"
                onClick={removeImage}
              >
                ×
              </Button>
            </div>
          )}
          
          <InputGroup>
            <Form.Control
              placeholder="Type message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <InputGroup.Text>
              <Button 
                variant="link" 
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
              >
                <i className="bi bi-image"></i>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </InputGroup.Text>
            <Button 
              variant="primary" 
              onClick={handleSend} 
              disabled={loading || (!message.trim() && !imageFile)}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                'Send'
              )}
            </Button>
          </InputGroup>
          
          <style jsx>{`
            .message-input-container {
              position: relative;
            }
            .image-preview-container {
              position: relative;
              max-width: 200px;
            }
            .message-image-preview {
              max-height: 150px;
              object-fit: contain;
            }
            .remove-image-btn {
              position: absolute;
              top: 5px;
              right: 5px;
              border-radius: 50%;
              width: 24px;
              height: 24px;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}</style>
        </div>
  );
}

