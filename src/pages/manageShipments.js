import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios'
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ManageShipments = () => {

  const [shipments , setShipments] = useState([])

  // const [announcements, setAnnouncements] = useState([
  //   { id: 1, title: 'New Shipping Rates', content: 'Updated rates effective June 1st', date: '2023-05-25' },
  //   { id: 2, title: 'Holiday Schedule', content: 'No shipments on July 4th', date: '2023-05-20' },
  // ]);
  const [announcements, setAnnouncements] = useState([])

  const [showAddShipment, setShowAddShipment] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  const [shipmentForm, setShipmentForm] = useState({
    shipperID: '',
    transportMode: '',
    clientsCount: '',
    status: '',
    currentLocation: '',
    departureDate: '',
    eta: ''
    });

  const [editingShipment, setEditingShipment] = useState(null);

  const [stats , setStats] = useState({
        totalClients: 0,
        totalShipments: 0,
        inTransit: 0,
        delivered: 0,
        pending: 0
      })


  // Stats data
  // const stats = {
  //   totalClients: 42,
  //   totalShipments: 18,
  //   inTransit: 5,
  //   delivered: 10,
  //   pending: 3
  // };

  // Card gradient styles
  const cardStyles = [
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' },
    { background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
  ];

  // For editing an existing shipment
    const handleEdit = (shipment) => {
    setEditingShipment(shipment.id);
    setShipmentForm({
        shipperID: shipment.shipperID,
        transportMode: shipment.transportMode,
        clientsCount: shipment.clientsCount,
        status: shipment.status,
        currentLocation: shipment.currentLocation,
        departureDate: shipment.departureDate,
        eta: shipment.eta
    });
    setShowAddShipment(true);
    };

   const handleSaveShipment = async () => {
        // Validate form
        if (!shipmentForm.transportMode || !shipmentForm.clientsCount || 
            !shipmentForm.status || !shipmentForm.currentLocation || 
            !shipmentForm.departureDate || !shipmentForm.eta) {
            alert('Please fill all required fields');
            return;
        }

        try {
            // Generate shipping ID (using the function we created)
            const shipperID = generateShippingID();
            
            // Prepare the shipment data
            const shipmentData = {
            ...shipmentForm,
            shipperID, // Use the generated ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            companyId: localStorage.companyId
            };

            // Remove the local ID if it exists (since MongoDB will generate its own _id)
            delete shipmentData.id;

            // Send to backend
            const response = await axios.post('https://spaceshare-backend.onrender.com/set-shipment', shipmentData);

            if (response.data && response.data.insertedId) {
            // Update local state with the new shipment (including MongoDB _id)
            setShipments([...shipments, { ...shipmentData, _id: response.data.insertedId }]);
            
            // Reset and close
            setShipmentForm({
                shipperID: '',
                transportMode: '',
                clientsCount: '',
                status: '',
                currentLocation: '',
                departureDate: '',
                eta: ''
            });
            setShowAddShipment(false);
            
            // Show success message
            alert('Shipment saved successfully!');
            }
        } catch (error) {
            console.error('Error saving shipment:', error);
            alert('Failed to save shipment. Please try again.');
        }
        };

     const handleAddAnnouncement = async () => {
        // Validate form
        if (!newAnnouncement.title || !newAnnouncement.content) {
            alert('Please fill both title and content fields');
            return;
        }

        try {
            // Prepare the announcement data
            const announcementData = {
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            createdAt: new Date().toISOString(),
            companyId: localStorage.companyId
            };

            // Send to backend
            const response = await axios.post('https://spaceshare-backend.onrender.com/set-announcements', announcementData);

            if (response.data && response.data.insertedId) {
            // Update local state with the new announcement (including MongoDB _id)
            setAnnouncements([...announcements, { 
                ...announcementData, 
                _id: response.data.insertedId 
            }]);
            
            // Reset form and close modal
            setNewAnnouncement({ title: '', content: '' });
            setShowAddAnnouncement(false);
            
            // Show success message
            alert('Announcement added successfully!');
            }
        } catch (error) {
            console.error('Error adding announcement:', error);
            alert('Failed to add announcement. Please try again.');
        }
        };


  const generateShippingID = () => {
    // Get company name from localStorage (fallback to 'COM' if not available)
    const companyPrefix = localStorage.companyName 
        ? localStorage.companyName.slice(0, 3).toUpperCase() 
        : 'COM';

    // Get current date components
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateCode = `${day}${month}`; // DDMM format

    // Generate random 3-character alphanumeric code
    const randomChars = Math.random().toString(36).slice(2, 5).toUpperCase();

    // Combine all parts to make 9-character code
    const shippingID = `${companyPrefix}${dateCode}${randomChars}`;

    // Ensure exactly 9 characters (in case company prefix was shorter)
    return shippingID.slice(0, 9).padEnd(9, 'X'); // Pad with X if needed
    }

    const fetchShipments = async (companyId) => {
        try {
    
          console.log(companyId)
    
          const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipments', { companyId });
          const data = response.data;
    
          if (data){
            setShipments(data);
            const stats = {
              totalClients: 0,
              totalShipments: 0,
              inTransit: 0,
              delivered: 0,
              pending: 0
            };

            // Calculate statistics
            data.forEach(shipment => {
              stats.totalShipments += 1;
              stats.totalClients += shipment.clientsCount || 0;
              
              switch(shipment.status) {
                case 'In Transit':
                  stats.inTransit += 1;
                  break;
                case 'Delivered':
                  stats.delivered += 1;
                  break;
                case 'Pending':
                  stats.pending += 1;
                  break;
                // Add more status cases if needed
              }
            });

             setStats(stats)

            // return { shipments: data, stats };
          } 
          else {
            console.warn("No shipments found.");
            return { shipments: [], stats: {
              totalClients: 0,
              totalShipments: 0,
              inTransit: 0,
              delivered: 0,
              pending: 0
            }};
          }
        } catch (error) {
          console.error("Error fetching shipments:", error);
        }
      };

    const fetchAnnouncements = async (companyId) => {
        try {
    
          console.log(companyId)
    
          const response = await axios.post('https://spaceshare-backend.onrender.com/get-announcements', { companyId });
          const data = response.data;
    
          if (data) setAnnouncements(data);
          else console.warn("No announcements found.");
        } catch (error) {
          console.error("Error fetching announcements:", error);
        }
      };
    
    useEffect(() => {
      //   try {
      //   const { shipments, stats } = fetchShipments(localStorage.companyId);
      //   console.log(shipments)
      //   setShipments(shipments);
      //   setStats(stats); // Assuming you have a stats state
      //   console.log('Current stats:', stats);
      // } catch (error) {
      //   console.log(error)
      // }
       fetchShipments(localStorage.companyId);
        fetchAnnouncements(localStorage.companyId);
      }, []);

  return (
    <Container fluid className="py-4">
      {/* Stats Cards Row */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="shadow-sm border-0" style={cardStyles[0]}>
            <Card.Body className="text-white">
              <h5 className="card-title">Total Clients</h5>
              <h2 className="mb-0">{shipments ? stats.totalClients : 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="shadow-sm border-0" style={cardStyles[1]}>
            <Card.Body className="text-white">
              <h5 className="card-title">Total Shipments</h5>
              <h2 className="mb-0">{shipments ? stats.totalShipments : 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="shadow-sm border-0" style={cardStyles[2]}>
            <Card.Body className="text-white">
              <h5 className="card-title">In Transit</h5>
              <h2 className="mb-0">{shipments ? stats.inTransit : 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="shadow-sm border-0" style={cardStyles[3]}>
            <Card.Body className="text-white">
              <h5 className="card-title">Delivered</h5>
              <h2 className="mb-0">{shipments ? stats.delivered : 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Shipments Table */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">Shipment Management</Card.Title>
            <Button variant="primary" onClick={() => setShowAddShipment(true)}>
              <i className="fas fa-plus me-2"></i>Add Shipment
            </Button>
          </div>
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Shipper ID</th>
                <th>Transport Mode</th>
                <th>Clients</th>
                <th>Status</th>
                <th>Current Location</th>
                <th>Departure Date</th>
                <th>ETA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment._id}>
                  <td>{shipment.shipperID}</td>
                  <td>{shipment.transportMode}</td>
                  <td>{shipment.clientsCount}</td>
                  <td>{shipment.currentLocation}</td>
                  <td>
                    <span className={`badge bg-${shipment.status === 'Delivered' ? 'success' : shipment.status === 'In Transit' ? 'warning' : 'secondary'}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td>{shipment.departureDate}</td>
                  <td>{shipment.eta}</td>
                  <td>
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(shipment)}
                        >
                        <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" disabled={true}>
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Announcements Card */}
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">Announcements</Card.Title>
            <Button variant="outline-primary" onClick={() => setShowAddAnnouncement(true)}>
              <i className="fas fa-plus me-2"></i>Add Announcement
            </Button>
          </div>
          
          {announcements.map((announcement) => (
            <Card key={announcement._id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <h5>{announcement.title}</h5>
                  <small className="text-muted">{announcement.date}</small>
                </div>
                <p className="mb-0">{announcement.content}</p>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>

      {/* Add Announcement Modal */}
      <Modal show={showAddAnnouncement} onHide={() => setShowAddAnnouncement(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddAnnouncement(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAnnouncement}>
            Save Announcement
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Shipment Modal (Placeholder) */}
        <Modal show={showAddShipment} onHide={() => setShowAddShipment(false)} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>{editingShipment ? 'Edit Shipment' : 'Add New Shipment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Row>
                <Col md={6}>
                <Form.Group className="mb-3" controlId="formTransportMode">
                    <Form.Label>Transport Mode</Form.Label>
                    <Form.Control
                    as="select"
                    value={shipmentForm.transportMode}
                    onChange={(e) => setShipmentForm({...shipmentForm, transportMode: e.target.value})}
                    required
                    >
                    <option value="">Select Transport Mode</option>
                    <option value="Express">Air Express</option>
                    <option value="Air">Air</option>
                    <option value="Sea">Sea</option>
                    </Form.Control>
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                <Form.Group className="mb-3" controlId="formClientsCount">
                    <Form.Label>Number of Clients</Form.Label>
                    <Form.Control
                    type="number"
                    min="1"
                    value={shipmentForm.clientsCount}
                    onChange={(e) => setShipmentForm({...shipmentForm, clientsCount: e.target.value})}
                    required
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                    as="select"
                    value={shipmentForm.status}
                    onChange={(e) => setShipmentForm({...shipmentForm, status: e.target.value})}
                    required
                    >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    </Form.Control>
                </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formCurrentLocation">
                <Form.Label>Current Location</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter current location"
                value={shipmentForm.currentLocation}
                onChange={(e) => setShipmentForm({...shipmentForm, currentLocation: e.target.value})}
                required
                />
            </Form.Group>

            <Row>
                <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartureDate">
                    <Form.Label>Departure Date</Form.Label>
                    <Form.Control
                    type="date"
                    value={shipmentForm.departureDate}
                    onChange={(e) => setShipmentForm({...shipmentForm, departureDate: e.target.value})}
                    required
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3" controlId="formETA">
                    <Form.Label>Estimated Arrival (ETA)</Form.Label>
                    <Form.Control
                    type="date"
                    value={shipmentForm.eta}
                    onChange={(e) => setShipmentForm({...shipmentForm, eta: e.target.value})}
                    required
                    />
                </Form.Group>
                </Col>
            </Row>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddShipment(false)}>
            Cancel
        </Button>
            <Button variant="primary" onClick={handleSaveShipment}>
            {editingShipment ? 'Update Shipment' : 'Save Shipment'}
            </Button>
        </Modal.Footer>
        </Modal>
    </Container>
  );
};

export default ManageShipments;