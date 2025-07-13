import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ListGroup, Form, Image, Button, ButtonGroup, Badge, Spinner } from 'react-bootstrap';
import axios from "axios";

export default function ChatList({ onSelectChat }) {
  const [filter, setFilter] = useState('all');
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChatList = async () => {
    // const username = localStorage.user;
    const username = localStorage.getItem('companyName') || localStorage.getItem('user');
    
    console.log(localStorage.getItem('companyName'))

    try {
      setLoading(true); // Start loading
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-chats', { username });
      setChatList(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSelectChat = async (chat) => {
    if (!chat.read) {
      try {
        await axios.put(`https://spaceshare-backend.onrender.com/edit-chats/${chat._id}`, { read: true });
  
        // Update local state for immediate feedback
        setChatList(prevChats =>
          prevChats.map(c => (c._id === chat._id ? { ...c, read: true } : c))
        );
      } catch (err) {
        console.error("Failed to mark chat as read:", err);
      }
    }
  
    onSelectChat(chat); // continue with original behavior
  };


  console.log(chatList)
  

  useEffect(() => {
    fetchChatList();
  }, []);

  const truncateMessage = (msg, maxLength = 25) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + '...' : msg;
  };

  const filteredChats = chatList.filter(chat =>
    filter === 'all' ? true : filter === 'unread' ? !chat.read : chat.read
  );

  return (
    <div className="h-100 d-flex flex-column bg-light p-3 rounded">
  <h5 className="text-center mb-3 fw-bold">Space Share Chat</h5>

  <Form.Control type="text" placeholder="Search..." className="mb-2" />

  <ButtonGroup className="mb-3 w-100">
    <Button
      variant={filter === 'all' ? 'primary' : 'outline-primary'}
      onClick={() => setFilter('all')}
    >
      All
    </Button>
    <Button
      variant={filter === 'read' ? 'primary' : 'outline-primary'}
      onClick={() => setFilter('read')}
    >
      Read
    </Button>
    <Button
      variant={filter === 'unread' ? 'primary' : 'outline-primary'}
      onClick={() => setFilter('unread')}
    >
      Unread
    </Button>
  </ButtonGroup>

  {loading ? (
    <div className="d-flex justify-content-center align-items-center flex-grow-1">
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '500px' }}>
      <ListGroup variant="flush">
        {filteredChats.length === 0 ? (
          <div className="text-center text-muted my-4">No chats yet</div>
        ) : (
          filteredChats.map(chat => (
            <ListGroup.Item
              key={chat._id}
              action
              onClick={() => handleSelectChat(chat)}
              className="d-flex justify-content-between align-items-start mb-2 rounded px-3 py-2"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <div className="d-flex align-items-start">
                <Image
                  src={chat.avatar}
                  roundedCircle
                  width="40"
                  height="40"
                  className="me-3"
                />
                <div>
                  <div className="fw-bold">
                    {chat.recieverName === localStorage.getItem("user")
                      ? chat.userId
                      : chat.recieverName}
                  </div>
                  <div className="text-muted small">
                    {truncateMessage(chat.lastMessage)}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <div className="text-muted small">
                  {formatDistanceToNow(new Date(chat.lastTimestamp), {
                    addSuffix: true,
                  })}
                </div>
                {!chat.read && (
                  <Badge bg="danger" className="mt-1">
                    Unread
                  </Badge>
                )}
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  )}
</div>

  );
}
