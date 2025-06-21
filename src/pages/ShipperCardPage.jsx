import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Image} from "react-bootstrap";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { IoChatbubbleEllipses } from "react-icons/io5";

const ShipperCardPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRates, setSelectedRates] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating login status
  

  const [shippers, setShippers] = useState([]);

  // Function to fetch all shippers from the server
  const fetchShippers = async () => {
    try {
      const response = await axios.post('http://localhost:3001/get-all-shippers');
      setShippers(response.data); // Update state with the fetched shippers
    } catch (error) {
      console.error('Error fetching shippers:', error);
    }
  };

  const navigate = useNavigate();

  const handleViewRates = (rates) => {
    setSelectedRates(rates);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRates("");
  };

  const handleShipperProfile = (companyName) => {
    // console.log("navigate button clicked")
    navigate(`/shipper-profile/${companyName}`)
  }

  const handleChat = (shipper) => {
    // alert(`Chat started with ${shipperName}`);
    // console.log(localStorage.getItem('user'))
    setIsSending(true);


      const chatData = {
        recieverName: shipper.companyName ,
        userName: localStorage.getItem('user') ,
        userId: localStorage.getItem('user'),
        recieverID: shipper.userId,
        lastMessage: "Hello, I am interested in your shipping services",
        lastTimestamp: new Date().toISOString(),
        timeCreated: new Date().toISOString(),
        avatar: shipper.avatar,
        read: false
      }
  
      fetch("http://localhost:3001/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create chat");
          }
          return response.json();
        })
        .then((data) => {
          const chatId = data.insertedId; // Depending on how you return it
    
          // console.log(data)
    
          // 👇 Build the message data
          const newMessage = {
            chatId: chatId,
            recieverName: shipper.companyName,
            userName: localStorage.getItem('user'),
            userId: localStorage.getItem('user'),
            recieverID: shipper.userId,
            message: "Hello, I am interested in your shipping services", // Replace with actual message input
            timeCreated: new Date().toISOString(),
            read: false,
          };
    
          // Send the message
          return fetch("http://localhost:3001/send-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to send message");
          }
          return response.json();
        })
        .then(() => {
          setToastMessage("Chat and message sent successfully!");
          setShowModal(false);
          navigate("/chat");
        })
        .catch((error) => {
          console.error("Error:", error);
          setToastMessage("Failed to create chat or send message.");
        })
        .finally(() => {
          setIsSending(false);
          setTimeout(() => setToastMessage(null), 3000);
        });


  };

  useEffect(() => {
    fetchShippers();
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="text-center mb-4">Pro Shippers</h3>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control type="text" placeholder="Search by name or city" />
        </Col>
        <Col md={2}>
          <Form.Select>
            <option>All Modes</option>
            <option>Air</option>
            <option>Sea</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select>
            <option>All Ratings</option>
            <option>4+ stars</option>
            <option>3+ stars</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select>
            <option>Sort By</option>
            <option>Name</option>
            <option>Rating</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Shipper Cards */}
      <Row>
        {shippers.map((shipper) => (
          <Col key={shipper.completeUserData.userID} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <Image
                      src={shipper.completeUserData.avatar} // fallback image
                      roundedCircle
                      width={50}
                      height={50}
                      alt="Shipper Avatar"
                    />
                  </div>
                  <div>
                    <Card.Title>{shipper.completeUserData.companyName}</Card.Title>
                    <Card.Subtitle className="text-muted">
                      {shipper.completeUserData.hqLocation}
                    </Card.Subtitle>
                  </div>
                </div>
                <p className="mb-1">
                  <strong>Modes:</strong> {shipper.completeUserData.transportModes.join(", ")}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {shipper.completeUserData.phoneNumber}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {shipper.completeUserData.email}
                </p>
                <p className="mb-3">
                  <strong>Rating:</strong> {shipper.rating} ★
                </p>
                {/* <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => handleChat(shipper.completeUserData)}
                >
                  Chat
                </Button> */}
               {isLoggedIn && (
                <button
                  type="button"
                  className="btn btn-primary m-2"
                  onClick={() => handleChat(shipper.completeUserData)}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending chat...
                    </>
                  ) : (
                    "Chat"
                  )}
                  <IoChatbubbleEllipses />
                </button>
              )}

                <Button
                  variant="outline-secondary"
                  className="m-2"
                  onClick={() => handleViewRates(shipper.rates)}
                >
                  View Rates
                </Button>

                <Button
                  variant="outline-secondary"
                  className="m-2"
                  onClick={() => handleShipperProfile(shipper.completeUserData.companyName)}
                >
                  View Profile
                </Button>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Rates Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Shipping Rates</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedRates}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShipperCardPage;
