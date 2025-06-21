import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Image, Dropdown, Modal, Button } from 'react-bootstrap'; 
import { IoArrowBack } from "react-icons/io5";
import MessageInput from './MessageInput';
import moment from 'moment';

export default function ChatWindow({ chat, onBack, isMobile }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);


  const offer = {
    space: '5kg',
    goodsType: 'Clothes',
    from: 'Guangzhou',
    to: 'Harare',
    posted: 'Today',
    price: '20 USD',
    departureDate: '2025-05-29',
  };

  const profile = {
    picture: chat?.avatar,
    name: chat?.name,
    rating: 4.8,
    fulfilled: 23,
  };

  const fetchMessages = async (chatId) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch("http://localhost:3001/get-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch messages");
  
      const data = await response.json();
      setMessages(data);

      console.log(data)

    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };
  
  // console.log(chat)

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  useEffect(() => {
    if (chat?._id) {
      fetchMessages(chat._id);
    }
  }, [chat]);

  if (!chat) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center text-muted">
        Select a chat to view messages
      </div>
    );
  }

  return (
    <>

  {isLoadingMessages && (
    <div className="loading-overlay">Loading messages...</div>
  )}


      <Card className="h-100 border-0 rounded-0 position-relative">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center">
            {isMobile && (
              <Button
                variant="link"
                className="me-2 p-0 text-decoration-none"
                onClick={onBack}
              >
                <IoArrowBack />
              </Button>
            )}

            <Image
              src={chat.avatar}
              roundedCircle
              width="40"
              height="40"
              className="me-2"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowProfileModal(true)}
            />
            <div>
              {/* <div className="fw-bold">{chat.recieverName}</div> */}
              <div className="fw-bold">
                {chat.recieverName === localStorage.getItem('user') ? chat.userId : chat.recieverName}
              </div>
              <div className="text-muted small">Last active: 2 hours ago</div>
            </div>
          </div>

          {/* Dropdown remains unchanged */}
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" className="border-0 p-0">
            <span className="fs-4">⋯</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setShowProfileModal(true)}>View Profile</Dropdown.Item>
            <Dropdown.Item>Mute</Dropdown.Item>
            <Dropdown.Item>Delete Chat</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        </Card.Header>

        <Card.Body className="overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {chat.offerDetails && (
          <Card className="mb-3 bg-light border-start border-4 border-primary rounded shadow-sm">
            <Card.Body className="p-3">
              <h6 className="fw-bold mb-2">Offer Details</h6>
              <div className="mb-1"><strong>Space Needed:</strong> {chat.offerDetails.space}</div>
              <div className="mb-1"><strong>Goods Type:</strong> {chat.offerDetails.goodsType}</div>
              <div className="mb-1"><strong>Departure:</strong> {chat.offerDetails.departure}</div>
              <div className="mb-1"><strong>Destination:</strong> {chat.offerDetails.destination}</div>
              <div className="mb-1"><strong>Posted:</strong> {offer.posted}</div>
              <div className="mb-1"><strong>Price:</strong> {chat.offerDetails.price}</div>
              <div className="mb-1"><strong>Departure Date:</strong> {chat.offerDetails.departureDate}</div>
            </Card.Body>
          </Card>
        )}

          <ListGroup variant="flush">
            {messages.map((msg, index) => {
              const isSender = msg.userId !== localStorage.getItem("user");

              console.log(msg.userId)

              return (
                <ListGroup.Item
                  key={msg._id || index}
                  className={`border-0 ${isSender ? 'text-end' : ''}`}
                >
                  <div
                    className={`d-inline-block p-2 rounded ${isSender ? 'bg-primary text-white' : 'bg-light'}`}
                  >
                    {msg.message}
                  </div>
                  <div className="text-muted small mt-1">
                    {isSender ? 'You' : msg.userId} • {moment(msg.timeCreated).format('h:mm A, MMM D')}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>

        <Card.Footer className="p-2">
          <MessageInput chat={chat} addMessage={addMessage}/>
        </Card.Footer>
      </Card>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={profile.picture} roundedCircle width={100} height={100} className="mb-3" />
          <h5>{profile.name}</h5>
          <p className="mb-1"><strong>Rating:</strong> ⭐ {profile.rating}</p>
          <p><strong>Offers Fulfilled:</strong> {profile.fulfilled}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
