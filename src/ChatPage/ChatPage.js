import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewChat, setViewChat] = useState(false);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (isMobile) setViewChat(true); // switch to chat view on mobile
  };

  const handleBack = () => {
    setViewChat(false);
    setSelectedChat(null);
  };


  return (
    // <Container fluid className="vh-100">
    //   <Row className="h-100">
    //     <Col md={4} className="border-end p-0">
    //       <ChatList onSelectChat={setSelectedChat} />
    //     </Col>
    //     <Col md={8} className="p-0">
    //       <ChatWindow chat={selectedChat} />
    //     </Col>
    //   </Row>
    // </Container>
    <Container fluid className="vh-100">
    <Row className="h-100">
      {/* Show ChatList on desktop OR mobile if not in chat view */}
      {(!isMobile || !viewChat) && (
        <Col md={4} className="border-end p-0">
          <ChatList onSelectChat={handleSelectChat} />
        </Col>
      )}

      {/* Show ChatWindow on desktop OR mobile if in chat view */}
      {(selectedChat && (!isMobile || viewChat)) && (
        <Col md={8} className="p-0">
          <ChatWindow chat={selectedChat} onBack={handleBack} isMobile={isMobile} />
        </Col>
      )}
    </Row>
  </Container>
  );
}
