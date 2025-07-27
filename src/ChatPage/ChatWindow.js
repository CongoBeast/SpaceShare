import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Image, Dropdown, Modal, Button, Row, Col, Form, Badge } from 'react-bootstrap'; 
import { IoArrowBack } from "react-icons/io5";
import MessageInput from './MessageInput';
import moment from 'moment';
import { io } from 'socket.io-client';
import axios from 'axios'
import MessageItem from './MessageItem';

export default function ChatWindow({ chat, onBack, isMobile }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showManageClientModal , setShowManageClientModal] = useState(false)
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const [loading , setLoading] = useState(false);

  const [userAddress , setUserAddress] = useState('')

  const [savingList, setSavingList] = useState(false)

  const [shipper , setShipper] = useState([]);
  const [userData , setUserData] = useState();

  // Packing List State
  const [packingItems, setPackingItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    type: 'phones',
    units: 'pieces',
    quantity: 1
  });

  // Shipment State
  const [availableShipments, setAvailableShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [selectedShipmentId , setSelectedShipmentId] = useState('');

  const [showManageClient , setShowManageClient] = useState(false)

    const fetchUserData = async () => {
    try {
      setLoading(false)

      const username = localStorage.user

      // if(localStorage.user === chat.userName){
      //   username = localStorage.user
      // }
      // else{
      //   username = chat.userName
      // }
      

      const response = await axios.post('https://spaceshare-backend.onrender.com/get-user', { username });
      const userData = response.data[0];
  
      setUserData(userData);

      setUserAddress(userData.shippingAddress)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user information:', error);
      throw error; // so it can be caught in fetchAll
    } finally {
    }
  };

  // Handle packing list item addition
  const handleAddItem = () => {
    if (currentItem.quantity > 0) {
      setPackingItems([...packingItems, {
        ...currentItem,
        _id: Date.now() // Temporary ID
      }]);
      setCurrentItem({
        type: 'phones',
        units: 'pieces',
        quantity: 1
      });
    }
  };

  // Handle shipment selection
  const handleSelectShipment = (shipmentId) => {
    setSelectedShipment(shipmentId);
  };

    const fetchShipper = async () => {
      try {
        const companyName = localStorage.companyName
  
        setLoading(true);
        const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipper', { companyName });
        const shipperData = response.data;
  
        setShipper(shipperData);
  
        return shipperData; // 🔁 return the data here
      } catch (error) {
        console.error('Error fetching shipper information:', error);
        throw error; // so it can be caught in fetchAll
      } finally {
        setLoading(false);
      }
    };



  const savePackingList = async () => {
  try {
    setSavingList(true);

    const chatUserId = chat.userName;

    console.log(chatUserId)

    // Prepare packing list data
    const packingList = {
      chat_id: chat._id,
      items: packingItems,
      timeAdded: new Date().toISOString(),
      shipper: localStorage.companyName,
      user_id: chatUserId,
      shipmentId: selectedShipmentId,
    };

    // Send to your /set-packing-list endpoint
    await axios.post('https://spaceshare-backend.onrender.com/set-packing-list', packingList);

    handleManageClientClose();
    setSavingList(false);
    
  } catch (error) {
    console.error('Error saving packing list:', error);
    setSavingList(false);
    // Optionally show error message to user
    alert('Failed to save packing list. Please try again.');
  }
};

    const fetchShipments = async (companyId) => {
          try {
      
            console.log(companyId)
      
            const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipments', { companyId });
            const data = response.data;

            setAvailableShipments(data)
      
          } catch (error) {
            console.error("Error fetching shipments:", error);
          }
     };

  // Add to shipment
  const addToShipment = async () => {
    if (!selectedShipment) return;

    console.log(selectedShipment)

    setSelectedShipmentId(selectedShipment)

    
    // try {
    //   await axios.put(`/api/shipments/${selectedShipment}/add-client`, {
    //     userId: chat._id,
    //     packingList: packingItems
    //   });
    //   handleManageClientClose();
    // } catch (error) {
    //   console.error('Error adding to shipment:', error);
    // }
  };

  const handleManageClientClose = () => {
    setShowManageClientModal(false)
  }

const fetchData = async () => {
  try {
    if (localStorage.companyName) {
      await fetchShipper();
    } else {
      await fetchUserData();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Call this in useEffect
useEffect(() => {
  fetchData();
  fetchShipments(localStorage.companyId);
}, []);

console.log(availableShipments)

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
      const response = await fetch("https://spaceshare-backend.onrender.com/get-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch messages");
  
      const data = await response.json();
      setMessages(data);

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

  const [socket, setSocket] = useState(null);

useEffect(() => {
  const newSocket = io('http://localhost:3001');
  setSocket(newSocket);

  return () => newSocket.disconnect();
}, []);

useEffect(() => {
  if (socket && chat?._id) {
    socket.emit('join-chat', chat._id);
    
    socket.on('new-message', (serverMessage) => {
      // if (message.chatId === chat._id) {
      //   console.log(message)
      //   setMessages(prev => [...prev, message]);
      // }
      console.log(serverMessage)

    if (serverMessage.chatId === chat._id) {
            setMessages(prev => {
              // Check if this message already exists (by userId + message + time)
              const isDuplicate = prev.some(msg => 
                msg.userId === serverMessage.userId &&
                msg.message === serverMessage.message &&
                Math.abs(new Date(msg.timeCreated) - new Date(serverMessage.timeCreated)) < 1000 // Same time (±1s)
              );

              // If duplicate, ignore it
              if (isDuplicate) return prev;

              // Otherwise, add the new message
              return [...prev, serverMessage];
            });
          }

    });

    return () => {
      socket.off('new-message');
    };
  }
}, [socket, chat?._id]);

const sendMessage = (message) => {

  if (socket) {

    setMessages((prev) => [...prev, message]);

    socket.emit('send-message', message);
    // addMessage(messageObj); // Optimistic update
    
  }
};

// console.log(localStorage.companyName ? shipper[0]?.shippingAddress : userData?.shippingAddress)

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
             
              <div className="fw-bold"> 
                {chat.recieverName === localStorage.getItem('user') || chat.recieverName === localStorage.getItem('companyName') ? chat.userId : chat.recieverName}
              </div>
              <div className="text-muted small">Last active: 2 hours ago</div>
            </div>
          </div>

          {!loading && (
            <Button variant={ "primary"} size="sm" className="text-left d-flex align-items-center"   style={{ marginBottom: "1rem", padding: "0.25rem 0.75rem"}} 
            disabled={!userAddress || userAddress.trim() === ""} >           
            <span style={{ marginLeft: "1rem" }}>Send shipping address</span>
            </Button>
          )}
          
          
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" className="border-0 p-0">
            <span className="fs-4">⋯</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setShowProfileModal(true)}>View Profile</Dropdown.Item>
            {localStorage.companyName && (
            <Dropdown.Item onClick={() => setShowManageClientModal(true)}>Manage Client</Dropdown.Item>
            )}
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
              <div className="mb-1"><strong>Posted:</strong> {chat.posted}</div>
              <div className="mb-1"><strong>Price:</strong> {chat.offerDetails.price}</div>
              <div className="mb-1"><strong>Departure Date:</strong> {chat.offerDetails.departureDate}</div>
            </Card.Body>
          </Card>
        )}

          <ListGroup variant="flush">

            {messages.map((msg, index) => {
              const currentUserId = localStorage.getItem("companyName") || localStorage.getItem("user");

              const isCurrentUser = (
                msg.userId === currentUserId ||
                msg.senderId === currentUserId ||
                (msg.user && msg.user._id === currentUserId) ||
                (msg.sender && msg.sender._id === currentUserId)
              );

              // Safe name display
              const displayName = isCurrentUser ? 'You' : msg.recieverName || msg.senderName || msg.userName || 'Unknown';

              return (
                <MessageItem
                  key={msg._id || index}
                  msg={msg}
                  isCurrentUser={isCurrentUser}
                  displayName={displayName}
                />
              );
            })}

          </ListGroup>
        </Card.Body>

        <Card.Footer className="p-2">
          <MessageInput chat={chat} sendMessage={sendMessage}/>
        </Card.Footer>
      </Card>

  
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

      <Modal show={showManageClientModal} onHide={handleManageClientClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Shipping Details for </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <img 
                  src="https://images.unsplash.com/photo-1752801516481-cfb8c47ee9a3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8"
                  className="rounded-circle"
                  width="80"
                  height="80"
                />
              </Col>
              <Col md={9}>
                <h5>Thomas Tshuma</h5>
                <p className="text-muted mb-1">thomastshuma43@gmail.com</p>
                <p className="text-muted">+86 19950133252</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

   
        <Card className="mb-4">
          <Card.Header>Create Packing List</Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Item Type</Form.Label>
                    <Form.Control
                      as="select"
                      value={currentItem.type}
                      onChange={(e) => setCurrentItem({...currentItem, type: e.target.value})}
                    >
                      <option value="phones">Phones</option>
                      <option value="laptops">Laptops</option>
                      <option value="electronics">Other Electronics</option>
                      <option value="general">General Goods</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Units</Form.Label>
                    <Form.Control
                      as="select"
                      value={currentItem.units}
                      onChange={(e) => setCurrentItem({...currentItem, units: e.target.value})}
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="boxes">Boxes</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleAddItem}
                    disabled={!currentItem.quantity}
                  >
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>

      
            {packingItems.length > 0 && (
              <div className="mt-3">
                <h6>Current Items:</h6>
                <ListGroup>
                  {packingItems.map((item, index) => (
                    <ListGroup.Item key={item._id || index}>
                      <div className="d-flex justify-content-between">
                        <span>
                          <Badge bg="info" className="me-2">{item.type}</Badge>
                          {item.quantity} {item.units}
                        </span>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-danger"
                          onClick={() => setPackingItems(packingItems.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            <Form.Group>
              <Form.Label>Select Shipment</Form.Label>
              <Form.Control
                as="select"
                value={selectedShipment || ''}
                onChange={(e) => handleSelectShipment(e.target.value)}
              >
                <option value="">Choose a shipment...</option>
                {availableShipments.map(shipment => (
                  <option key={shipment._id} value={shipment._id}>
                    {shipment.shipmentID} ({shipment.departureDate})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button 
              variant="success" 
              onClick={addToShipment}
              disabled={!selectedShipment || packingItems.length === 0}
            >
              Add to Shipment
            </Button>

          </Card.Body>
          <Card.Footer className="text-end">
            <Button 
              variant="primary" 
              onClick={savePackingList}
              disabled={packingItems.length === 0}
            >
              Save Packing List
            </Button>
          </Card.Footer>
        </Card>

      </Modal.Body>
    </Modal>
    </>
  );
}
