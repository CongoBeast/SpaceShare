// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
// import axios from 'axios'
// import { FaEdit, FaTrashAlt } from "react-icons/fa";

// const ManageShipments = () => {

//   const [shipments , setShipments] = useState([])

//   // const [announcements, setAnnouncements] = useState([
//   //   { id: 1, title: 'New Shipping Rates', content: 'Updated rates effective June 1st', date: '2023-05-25' },
//   //   { id: 2, title: 'Holiday Schedule', content: 'No shipments on July 4th', date: '2023-05-20' },
//   // ]);
//   const [announcements, setAnnouncements] = useState([])

//   const [showAddShipment, setShowAddShipment] = useState(false);
//   const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
//   const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

//   const [shipmentForm, setShipmentForm] = useState({
//     _id: '',
//     shipperID: '',
//     transportMode: '',
//     clientsCount: 0,
//     status: '',
//     currentLocation: '',
//     departureDate: '',
//     eta: '',
//     timestamps: []
//     });

//   const [editingShipment, setEditingShipment] = useState(null);

//   const [stats , setStats] = useState({
//         totalClients: 0,
//         totalShipments: 0,
//         inTransit: 0,
//         delivered: 0,
//         pending: 0
//       })

//   const [showTrackingModal, setShowTrackingModal] = useState(false);
//   const [currentTrackingShipment, setCurrentTrackingShipment] = useState(null);
//   const [trackingUpdate, setTrackingUpdate] = useState({
//     location: '',
//     status: '',
//     eta: '',
//     notes: ''
//   });

//   const [showTrackingHistoryModal, setShowTrackingHistoryModal] = useState(false);
//   const [selectedShipment, setSelectedShipment] = useState(null);


//   // Stats data
//   // const stats = {
//   //   totalClients: 42,
//   //   totalShipments: 18,
//   //   inTransit: 5,
//   //   delivered: 10,
//   //   pending: 3
//   // };

//   // Card gradient styles
//   const cardStyles = [
//     { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
//     { background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' },
//     { background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
//     { background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
//   ];

//   // For editing an existing shipment
//     const handleEdit = (shipment) => {
//     setEditingShipment(shipment.id);
//     setShipmentForm({
//         shipperID: shipment.shipperID,
//         transportMode: shipment.transportMode,
//         clientsCount: shipment.clientsCount,
//         status: shipment.status,
//         currentLocation: shipment.currentLocation,
//         departureDate: shipment.departureDate,
//         eta: shipment.eta
//     });
//     setShowAddShipment(true);
//     };

//   //  const handleSaveShipment = async () => {
//   //       // Validate form
//   //       if (!shipmentForm.transportMode || !shipmentForm.clientsCount || 
//   //           !shipmentForm.status || !shipmentForm.currentLocation || 
//   //           !shipmentForm.departureDate || !shipmentForm.eta) {
//   //           alert('Please fill all required fields');
//   //           return;
//   //       }

//   //       try {
//   //           // Generate shipping ID (using the function we created)
//   //           const shipperID = generateShippingID();
            
//   //           // Prepare the shipment data
//   //           const shipmentData = {
//   //           ...shipmentForm,
//   //           shipperID, // Use the generated ID
//   //           createdAt: new Date().toISOString(),
//   //           updatedAt: new Date().toISOString(),
//   //           companyId: localStorage.companyId
//   //           };

//   //           // Remove the local ID if it exists (since MongoDB will generate its own _id)
//   //           delete shipmentData.id;

//   //           // Send to backend
//   //           const response = await axios.post('https://spaceshare-backend.onrender.com/set-shipment', shipmentData);

//   //           if (response.data && response.data.insertedId) {
//   //           // Update local state with the new shipment (including MongoDB _id)
//   //           setShipments([...shipments, { ...shipmentData, _id: response.data.insertedId }]);
            
//   //           // Reset and close
//   //           setShipmentForm({
//   //               shipperID: '',
//   //               transportMode: '',
//   //               clientsCount: 0,
//   //               status: '',
//   //               currentLocation: '',
//   //               departureDate: '',
//   //               eta: ''
//   //           });
//   //           setShowAddShipment(false);
            
//   //           // Show success message
//   //           alert('Shipment saved successfully!');
//   //           }
//   //       } catch (error) {
//   //           console.error('Error saving shipment:', error);
//   //           alert('Failed to save shipment. Please try again.');
//   //       }
//   //       };

//     const handleSaveShipment = async () => {
//       // Validate form
//       if (!shipmentForm.transportMode || !shipmentForm.clientsCount || 
//           !shipmentForm.status || !shipmentForm.currentLocation || 
//           !shipmentForm.departureDate || !shipmentForm.eta) {
//           alert('Please fill all required fields');
//           return;
//       }

//       try {
//           // Generate shipping ID
//           const shipmentID = generateShippingID();
//           const shipperID= localStorage.companyId
          
//           // Create initial timestamp
//           const initialTimestamp = {
//             date: new Date().toISOString(),
//             location: shipmentForm.currentLocation,
//             status: shipmentForm.status,
//             eta: shipmentForm.eta,
//             notes: 'Shipment created',
//             updatedBy: localStorage.userName || 'Admin'
//           };

//           // Prepare the shipment data with initial timestamp
//           const shipmentData = {
//             ...shipmentForm,
//             shipmentID,
//             shipperID,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             companyId: localStorage.companyId,
//             timestamps: [initialTimestamp] // Initialize with first timestamp
//           };

//           // Remove the local ID if it exists
//           delete shipmentData.id;

//           // Send to backend
//           const response = await axios.post('https://spaceshare-backend.onrender.com/set-shipment', shipmentData);

//           if (response.data && response.data.insertedId) {
//             // Update local state with the new shipment (including MongoDB _id)
//             setShipments([...shipments, { 
//               ...shipmentData, 
//               _id: response.data.insertedId 
//             }]);
            
//             // Reset and close
//             setShipmentForm({
//                 _id: '',
//                 shipperID: '',
//                 transportMode: '',
//                 clientsCount: 0,
//                 status: '',
//                 currentLocation: '',
//                 departureDate: '',
//                 eta: ''
//             });
//             setShowAddShipment(false);
            
//             // Show success message
//             alert('Shipment saved successfully with initial tracking record!');
//           }
//       } catch (error) {
//           console.error('Error saving shipment:', error);
//           alert('Failed to save shipment. Please try again.');
//       }
//     };
    
//     const handleOpenTrackingModal = (shipment) => {
//         setCurrentTrackingShipment(shipment);
//         setTrackingUpdate({
//           location: shipment.currentLocation,
//           status: shipment.status,
//           eta: shipment.eta,
//           notes: ''
//         });
//         setShowTrackingModal(true);
//       };

//       const handleTrackingUpdate = async () => {
//         if (!trackingUpdate.location || !trackingUpdate.status) {
//           alert('Please fill in at least location and status');
//           return;
//         }

//         try {
//           // Create the timestamp object
//           const timestamp = {
//             date: new Date().toISOString(),
//             location: trackingUpdate.location,
//             status: trackingUpdate.status,
//             eta: trackingUpdate.eta,
//             notes: trackingUpdate.notes,
//             updatedBy: localStorage.userName || 'Admin' // Assuming you store user info
//           };

//           // Prepare the update data for the backend
//           const updateData = {
//             filter: {
//               _id: currentTrackingShipment._id
//             },
//             update: {
//               currentLocation: trackingUpdate.location,
//               status: trackingUpdate.status,
//               eta: trackingUpdate.eta,
//               // $push the new timestamp to the timestamps array
//               timestamps: timestamp
//             }
//           };

//           // Send to backend
//           const response = await axios.post('https://spaceshare-backend.onrender.com/update-shipments', updateData);

//           console.log(response.data)

//           if (response.data) {
//             // Update local state by adding the new timestamp
//             setShipments(shipments.map(ship => {
//               if (ship._id === currentTrackingShipment._id) {
//                 return {
//                   ...ship,
//                   currentLocation: trackingUpdate.location,
//                   status: trackingUpdate.status,
//                   eta: trackingUpdate.eta,
//                   timestamps: [...(ship.timestamps || []), timestamp]
//                 };
//               }
//               return ship;
//             }));
            
//             // Close modal and reset
//             setShowTrackingModal(false);
//             setCurrentTrackingShipment(null);
//             setTrackingUpdate({
//               location: '',
//               status: '',
//               eta: '',
//               notes: ''
//             });
            
//             alert('Tracking update saved successfully!');
//           }
//         } catch (error) {
//           console.error('Error saving tracking update:', error);
//           alert('Failed to save tracking update. Please try again.');
//         }
//       };

//      const handleAddAnnouncement = async () => {
//         // Validate form
//         if (!newAnnouncement.title || !newAnnouncement.content) {
//             alert('Please fill both title and content fields');
//             return;
//         }

//         try {
//             // Prepare the announcement data
//             const announcementData = {
//             title: newAnnouncement.title,
//             content: newAnnouncement.content,
//             date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
//             createdAt: new Date().toISOString(),
//             companyId: localStorage.companyId
//             };

//             // Send to backend
//             const response = await axios.post('https://spaceshare-backend.onrender.com/set-announcements', announcementData);

//             if (response.data && response.data.insertedId) {
//             // Update local state with the new announcement (including MongoDB _id)
//             setAnnouncements([...announcements, { 
//                 ...announcementData, 
//                 _id: response.data.insertedId 
//             }]);
            
//             // Reset form and close modal
//             setNewAnnouncement({ title: '', content: '' });
//             setShowAddAnnouncement(false);
            
//             // Show success message
//             alert('Announcement added successfully!');
//             }
//         } catch (error) {
//             console.error('Error adding announcement:', error);
//             alert('Failed to add announcement. Please try again.');
//         }
//         };

//       const handleShowTrackingHistory = (shipment) => {
//         setSelectedShipment(shipment);
//         setShowTrackingHistoryModal(true);
//       };

//       const generateShippingID = () => {
//         // Get company name from localStorage (fallback to 'COM' if not available)
//         const companyPrefix = localStorage.companyName 
//             ? localStorage.companyName.slice(0, 3).toUpperCase() 
//             : 'COM';

//         // Get current date components
//         const now = new Date();
//         const day = String(now.getDate()).padStart(2, '0');
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const dateCode = `${day}${month}`; // DDMM format

//         // Generate random 3-character alphanumeric code
//         const randomChars = Math.random().toString(36).slice(2, 5).toUpperCase();

//         // Combine all parts to make 9-character code
//         const shippingID = `${companyPrefix}${dateCode}${randomChars}`;

//         // Ensure exactly 9 characters (in case company prefix was shorter)
//         return shippingID.slice(0, 9).padEnd(9, 'X'); // Pad with X if needed
//         }

//     const fetchShipments = async (companyId) => {
//         try {
    
//           console.log(companyId)
    
//           const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipments', { companyId });
//           const data = response.data;
    
//           if (data){
//             setShipments(data);
//             const stats = {
//               totalClients: 0,
//               totalShipments: 0,
//               inTransit: 0,
//               delivered: 0,
//               pending: 0
//             };

//             // Calculate statistics
//             data.forEach(shipment => {
//               stats.totalShipments += 1;
//               stats.totalClients += shipment.clientsCount || 0;
              
//               switch(shipment.status) {
//                 case 'In Transit':
//                   stats.inTransit += 1;
//                   break;
//                 case 'Delivered':
//                   stats.delivered += 1;
//                   break;
//                 case 'Pending':
//                   stats.pending += 1;
//                   break;
//                 // Add more status cases if needed
//               }
//             });

//              setStats(stats)

//             // return { shipments: data, stats };
//           } 
//           else {
//             console.warn("No shipments found.");
//             return { shipments: [], stats: {
//               totalClients: 0,
//               totalShipments: 0,
//               inTransit: 0,
//               delivered: 0,
//               pending: 0
//             }};
//           }
//         } catch (error) {
//           console.error("Error fetching shipments:", error);
//         }
//       };

//     const fetchAnnouncements = async (companyId) => {
//         try {
    
//           console.log(companyId)
    
//           const response = await axios.post('https://spaceshare-backend.onrender.com/get-announcements', { companyId });
//           const data = response.data;
    
//           if (data) setAnnouncements(data);
//           else console.warn("No announcements found.");
//         } catch (error) {
//           console.error("Error fetching announcements:", error);
//         }
//       };
    
//     useEffect(() => {
//       //   try {
//       //   const { shipments, stats } = fetchShipments(localStorage.companyId);
//       //   console.log(shipments)
//       //   setShipments(shipments);
//       //   setStats(stats); // Assuming you have a stats state
//       //   console.log('Current stats:', stats);
//       // } catch (error) {
//       //   console.log(error)
//       // }
//        fetchShipments(localStorage.companyId);
//         fetchAnnouncements(localStorage.companyId);
//       }, []);

//   return (
//     <Container fluid className="py-4">
//       {/* Stats Cards Row */}
//       <Row className="mb-4">
//         <Col md={3} className="mb-3">
//           <Card className="shadow-sm border-0" style={cardStyles[0]}>
//             <Card.Body className="text-white">
//               <h5 className="card-title">Total Clients</h5>
//               <h2 className="mb-0">{shipments ? stats.totalClients : 0}</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} className="mb-3">
//           <Card className="shadow-sm border-0" style={cardStyles[1]}>
//             <Card.Body className="text-white">
//               <h5 className="card-title">Total Shipments</h5>
//               <h2 className="mb-0">{shipments ? stats.totalShipments : 0}</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} className="mb-3">
//           <Card className="shadow-sm border-0" style={cardStyles[2]}>
//             <Card.Body className="text-white">
//               <h5 className="card-title">In Transit</h5>
//               <h2 className="mb-0">{shipments ? stats.inTransit : 0}</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} className="mb-3">
//           <Card className="shadow-sm border-0" style={cardStyles[3]}>
//             <Card.Body className="text-white">
//               <h5 className="card-title">Delivered</h5>
//               <h2 className="mb-0">{shipments ? stats.delivered : 0}</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Shipments Table */}
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <Card.Title className="mb-0">Shipment Management</Card.Title>
//             <Button variant="primary" onClick={() => setShowAddShipment(true)}>
//               <i className="fas fa-plus me-2"></i>Add Shipment
//             </Button>
//           </div>
          
//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>Shipment ID</th>
//                 <th>Transport Mode</th>
//                 <th>Clients</th>
//                 <th>Current Location</th>
//                 <th>Status</th>
//                 <th>Departure Date</th>
//                 <th>ETA</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {shipments.map((shipment) => (
//                 <tr key={shipment._id}>
//                   {/* <td>{shipment.shipperID}</td> */}
//                   <td>
//                     <Button 
//                       variant="link" 
//                       onClick={() => handleShowTrackingHistory(shipment)}
//                       style={{ padding: 0, border: 0 }}
//                     >
//                       {shipment.shipmentID}
//                     </Button>
//                   </td>
//                   <td>{shipment.transportMode}</td>
//                   <td>{shipment.clientsCount}</td>
//                   <td>{shipment.currentLocation}</td>
//                   <td>
//                     <span className={`badge bg-${shipment.status === 'Delivered' ? 'success' : shipment.status === 'In Transit' ? 'warning' : 'secondary'}`}>
//                       {shipment.status}
//                     </span>
//                   </td>
//                   <td>{shipment.departureDate}</td>
//                   <td>{shipment.eta}</td>
//                   <td>
//                     <Button 
//                         variant="outline-primary" 
//                         size="sm" 
//                         className="me-2"
//                         onClick={() => handleOpenTrackingModal(shipment)}
//                         >
//                         <FaEdit />
//                     </Button>
//                     <Button variant="outline-danger" size="sm" disabled={true}>
//                       <FaTrashAlt />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//         </Card.Body>
//       </Card>

//       {/* Announcements Card */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <Card.Title className="mb-0">Announcements</Card.Title>
//             <Button variant="outline-primary" onClick={() => setShowAddAnnouncement(true)}>
//               <i className="fas fa-plus me-2"></i>Add Announcement
//             </Button>
//           </div>
          
//           {announcements.map((announcement) => (
//             <Card key={announcement._id} className="mb-3">
//               <Card.Body>
//                 <div className="d-flex justify-content-between">
//                   <h5>{announcement.title}</h5>
//                   <small className="text-muted">{announcement.date}</small>
//                 </div>
//                 <p className="mb-0">{announcement.content}</p>
//               </Card.Body>
//             </Card>
//           ))}
//         </Card.Body>
//       </Card>

//       {/* Add Announcement Modal */}
//       <Modal show={showAddAnnouncement} onHide={() => setShowAddAnnouncement(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Announcement</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Title</Form.Label>
//               <Form.Control 
//                 type="text" 
//                 value={newAnnouncement.title}
//                 onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
//               />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Content</Form.Label>
//               <Form.Control 
//                 as="textarea" 
//                 rows={3}
//                 value={newAnnouncement.content}
//                 onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddAnnouncement(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleAddAnnouncement}>
//             Save Announcement
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add Shipment Modal (Placeholder) */}
//         <Modal show={showAddShipment} onHide={() => setShowAddShipment(false)} size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>{editingShipment ? 'Edit Shipment' : 'Add New Shipment'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                 <Row>
//                     <Col md={6}>
//                     <Form.Group className="mb-3" controlId="formTransportMode">
//                         <Form.Label>Transport Mode</Form.Label>
//                         <Form.Control
//                         as="select"
//                         value={shipmentForm.transportMode}
//                         onChange={(e) => setShipmentForm({...shipmentForm, transportMode: e.target.value})}
//                         required
//                         >
//                         <option value="">Select Transport Mode</option>
//                         <option value="Express">Air Express</option>
//                         <option value="Air">Air</option>
//                         <option value="Sea">Sea</option>
//                         </Form.Control>
//                     </Form.Group>
//                     </Col>
//                 </Row>

//                 <Row>
//                     <Col md={6}>
//                     <Form.Group className="mb-3" controlId="formClientsCount">
//                         <Form.Label>Number of Clients</Form.Label>
//                         <Form.Control
//                         type="number"
//                         min="1"
//                         value={shipmentForm.clientsCount}
//                         onChange={(e) => setShipmentForm({...shipmentForm, clientsCount: e.target.value})}
//                         required
//                         />
//                     </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                     <Form.Group className="mb-3" controlId="formStatus">
//                         <Form.Label>Status</Form.Label>
//                         <Form.Control
//                         as="select"
//                         value={shipmentForm.status}
//                         onChange={(e) => setShipmentForm({...shipmentForm, status: e.target.value})}
//                         required
//                         >
//                         <option value="">Select Status</option>
//                         <option value="Pending">Pending</option>
//                         <option value="In Transit">In Transit</option>
//                         <option value="Delivered">Delivered</option>
//                         <option value="Cancelled">Cancelled</option>
//                         </Form.Control>
//                     </Form.Group>
//                     </Col>
//                 </Row>

//                 <Form.Group className="mb-3" controlId="formCurrentLocation">
//                     <Form.Label>Current Location</Form.Label>
//                     <Form.Control
//                     type="text"
//                     placeholder="Enter current location"
//                     value={shipmentForm.currentLocation}
//                     onChange={(e) => setShipmentForm({...shipmentForm, currentLocation: e.target.value})}
//                     required
//                     />
//                 </Form.Group>

//                 <Row>
//                     <Col md={6}>
//                     <Form.Group className="mb-3" controlId="formDepartureDate">
//                         <Form.Label>Departure Date</Form.Label>
//                         <Form.Control
//                         type="date"
//                         value={shipmentForm.departureDate}
//                         onChange={(e) => setShipmentForm({...shipmentForm, departureDate: e.target.value})}
//                         required
//                         />
//                     </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                     <Form.Group className="mb-3" controlId="formETA">
//                         <Form.Label>Estimated Arrival (ETA)</Form.Label>
//                         <Form.Control
//                         type="date"
//                         value={shipmentForm.eta}
//                         onChange={(e) => setShipmentForm({...shipmentForm, eta: e.target.value})}
//                         required
//                         />
//                     </Form.Group>
//                     </Col>
//                 </Row>
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={() => setShowAddShipment(false)}>
//                 Cancel
//             </Button>
//                 <Button variant="primary" onClick={handleSaveShipment}>
//                 {editingShipment ? 'Update Shipment' : 'Save Shipment'}
//                 </Button>
//             </Modal.Footer>
//         </Modal>


//         {/* Tracking Update Modal */}
//         <Modal show={showTrackingModal} onHide={() => setShowTrackingModal(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Update Shipment Tracking</Modal.Title>
//             <small className="text-muted ms-2">Shipment ID: {currentTrackingShipment?.shipperID}</small>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Current Location</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={trackingUpdate.location}
//                   onChange={(e) => setTrackingUpdate({...trackingUpdate, location: e.target.value})}
//                   required
//                 />
//               </Form.Group>
              
//               <Form.Group className="mb-3">
//                 <Form.Label>Status</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={trackingUpdate.status}
//                   onChange={(e) => setTrackingUpdate({...trackingUpdate, status: e.target.value})}
//                   required
//                 >
//                   <option value="">Select Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="In Transit">In Transit</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </Form.Control>
//               </Form.Group>
              
//               <Form.Group className="mb-3">
//                 <Form.Label>Updated ETA</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={trackingUpdate.eta}
//                   onChange={(e) => setTrackingUpdate({...trackingUpdate, eta: e.target.value})}
//                 />
//               </Form.Group>
              
//               <Form.Group className="mb-3">
//                 <Form.Label>Notes</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={trackingUpdate.notes}
//                   onChange={(e) => setTrackingUpdate({...trackingUpdate, notes: e.target.value})}
//                   placeholder="Any additional notes about this update"
//                 />
//               </Form.Group>
//             </Form>
            
//             {/* Timestamps history display */}
//             {currentTrackingShipment?.timestamps?.length > 0 && (
//               <div className="mt-4">
//                 <h6>Tracking History</h6>
//                 <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                   {currentTrackingShipment.timestamps
//                     .sort((a, b) => new Date(b.date) - new Date(a.date))
//                     .map((ts, index) => (
//                       <div key={index} className="mb-2 p-2 border-bottom">
//                         <div className="d-flex justify-content-between">
//                           <strong>{ts.location}</strong>
//                           <small>{new Date(ts.date).toLocaleString()}</small>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                           <span className={`badge bg-${ts.status === 'Delivered' ? 'success' : ts.status === 'In Transit' ? 'warning' : 'secondary'}`}>
//                             {ts.status}
//                           </span>
//                           {ts.eta && <small>ETA: {new Date(ts.eta).toLocaleDateString()}</small>}
//                         </div>
//                         {ts.notes && <small className="text-muted">{ts.notes}</small>}
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowTrackingModal(false)}>
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleTrackingUpdate}>
//               Save Update
//             </Button>
//           </Modal.Footer>
//         </Modal>


//         {/* Tracking History Modal */}
//       <Modal 
//         show={showTrackingHistoryModal} 
//         onHide={() => setShowTrackingHistoryModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title>
//             <div className="d-flex align-items-center">
//               <img 
//                 src="/path-to-your-logo.png" 
//                 alt="Company Logo" 
//                 style={{ height: '30px', marginRight: '10px' }} 
//               />
//               Shipment Tracking History
//             </div>
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedShipment && (
//             <div className="tracking-container">
//               <div className="tracking-header mb-4">
//                 <h4>Shipment: {selectedShipment.shipperID}</h4>
//                 <div className="d-flex justify-content-between">
//                   <div>
//                     <strong>Status:</strong> 
//                     <span className={`badge bg-${selectedShipment.status === 'Delivered' ? 'success' : selectedShipment.status === 'In Transit' ? 'warning' : 'secondary'} ms-2`}>
//                       {selectedShipment.status}
//                     </span>
//                   </div>
//                   <div>
//                     <strong>Current Location:</strong> {selectedShipment.currentLocation}
//                   </div>
//                   <div>
//                     <strong>ETA:</strong> {new Date(selectedShipment.eta).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>

//               <div className="tracking-timeline">
//                 {selectedShipment.timestamps?.length > 0 ? (
//                   selectedShipment.timestamps
//                     .sort((a, b) => new Date(b.date) - new Date(a.date))
//                     .map((timestamp, index) => (
//                       <div key={index} className="timeline-item">
//                         <div className="timeline-point"></div>
//                         <div className="timeline-content">
//                           <div className="d-flex justify-content-between">
//                             <h5>{timestamp.location}</h5>
//                             <small className="text-muted">
//                               {new Date(timestamp.date).toLocaleString()}
//                             </small>
//                           </div>
//                           <div className="d-flex align-items-center mb-2">
//                             <span className={`badge bg-${timestamp.status === 'Delivered' ? 'success' : timestamp.status === 'In Transit' ? 'warning' : 'secondary'} me-2`}>
//                               {timestamp.status}
//                             </span>
//                             {timestamp.eta && (
//                               <small>ETA: {new Date(timestamp.eta).toLocaleDateString()}</small>
//                             )}
//                           </div>
//                           {timestamp.notes && (
//                             <div className="timeline-notes">
//                               <p>{timestamp.notes}</p>
//                               <small className="text-muted">
//                                 Updated by: {timestamp.updatedBy}
//                               </small>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <div className="text-center py-4">
//                     <p>No tracking history available for this shipment</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer className="bg-light">
//           <Button 
//             variant="secondary" 
//             onClick={() => setShowTrackingHistoryModal(false)}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <style>{`
//         .tracking-timeline {
//           position: relative;
//           padding-left: 30px;
//         }
        
//         .timeline-item {
//           position: relative;
//           padding-bottom: 20px;
//         }
        
//         .timeline-point {
//           position: absolute;
//           left: -20px;
//           top: 0;
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background-color: #0d6efd;
//           border: 2px solid white;
//           z-index: 2;
//         }
        
//         .timeline-item:not(:last-child)::before {
//           content: '';
//           position: absolute;
//           left: -15px;
//           top: 12px;
//           height: 100%;
//           width: 2px;
//           background-color: #e9ecef;
//         }
        
//         .timeline-content {
//           background: #f8f9fa;
//           padding: 15px;
//           border-radius: 5px;
//           margin-bottom: 10px;
//         }
        
//         .timeline-notes {
//           background: white;
//           padding: 10px;
//           border-radius: 3px;
//           border-left: 3px solid #0d6efd;
//         }
//       `}</style>
//     </Container>
//   );
// };

// export default ManageShipments;

import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Form, Modal, 
  Badge, Alert, Spinner, Toast, ToastContainer, Dropdown,
  ProgressBar, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import { 
  FaEdit, FaTrashAlt, FaPlus, FaShip, FaTruck, FaPlane, 
  FaEye, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaBox,
  FaBullhorn, FaHistory, FaSearch, FaFilter
} from "react-icons/fa";
import { BsBoxSeam, BsTruck, BsAirplane, BsShip } from "react-icons/bs";

const ManageShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [shipmentForm, setShipmentForm] = useState({
    _id: '',
    shipperID: '',
    transportMode: '',
    clientsCount: 0,
    status: '',
    currentLocation: '',
    departureDate: '',
    eta: '',
    timestamps: []
  });

  const [editingShipment, setEditingShipment] = useState(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0
  });

  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [currentTrackingShipment, setCurrentTrackingShipment] = useState(null);
  const [trackingUpdate, setTrackingUpdate] = useState({
    location: '',
    status: '',
    eta: '',
    notes: ''
  });

  const [showTrackingHistoryModal, setShowTrackingHistoryModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Enhanced card styles with modern gradients
  const cardStyles = [
    { 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: FaUsers,
      color: '#667eea'
    },
    { 
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: BsBoxSeam,
      color: '#f093fb'
    },
    { 
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: FaTruck,
      color: '#4facfe'
    },
    { 
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: FaBox,
      color: '#43e97b'
    }
  ];

  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const getTransportIcon = (mode) => {
    switch(mode?.toLowerCase()) {
      case 'air': case 'express': return <BsAirplane className="me-1" />;
      case 'sea': return <FaShip className="me-1" />;
      default: return <BsTruck className="me-1" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Delivered': 'success',
      'In Transit': 'primary',
      'Pending': 'warning',
      'Cancelled': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'} className="px-2 py-1">{status}</Badge>;
  };

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
    if (!shipmentForm.transportMode || !shipmentForm.clientsCount || 
        !shipmentForm.status || !shipmentForm.currentLocation || 
        !shipmentForm.departureDate || !shipmentForm.eta) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    try {
      setLoading(true);
      const shipmentID = generateShippingID();
      const shipperID = localStorage.companyId;
      
      const initialTimestamp = {
        date: new Date().toISOString(),
        location: shipmentForm.currentLocation,
        status: shipmentForm.status,
        eta: shipmentForm.eta,
        notes: 'Shipment created',
        updatedBy: localStorage.userName || 'Admin'
      };

      const shipmentData = {
        ...shipmentForm,
        shipmentID,
        shipperID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyId: localStorage.companyId,
        timestamps: [initialTimestamp]
      };

      delete shipmentData.id;

      const response = await axios.post('https://spaceshare-backend.onrender.com/set-shipment', shipmentData);

      if (response.data && response.data.insertedId) {
        setShipments([...shipments, { 
          ...shipmentData, 
          _id: response.data.insertedId 
        }]);
        
        setShipmentForm({
          _id: '',
          shipperID: '',
          transportMode: '',
          clientsCount: 0,
          status: '',
          currentLocation: '',
          departureDate: '',
          eta: ''
        });
        setShowAddShipment(false);
        showNotification('Shipment created successfully!');
        fetchShipments(localStorage.companyId);
      }
    } catch (error) {
      console.error('Error saving shipment:', error);
      showNotification('Failed to save shipment', 'error');
    } finally {
      setLoading(false);
    }
  };
    
  const handleOpenTrackingModal = (shipment) => {
    setCurrentTrackingShipment(shipment);
    setTrackingUpdate({
      location: shipment.currentLocation,
      status: shipment.status,
      eta: shipment.eta,
      notes: ''
    });
    setShowTrackingModal(true);
  };

  const handleTrackingUpdate = async () => {
    if (!trackingUpdate.location || !trackingUpdate.status) {
      showNotification('Please fill in at least location and status', 'error');
      return;
    }

    try {
      setLoading(true);
      const timestamp = {
        date: new Date().toISOString(),
        location: trackingUpdate.location,
        status: trackingUpdate.status,
        eta: trackingUpdate.eta,
        notes: trackingUpdate.notes,
        updatedBy: localStorage.userName || 'Admin'
      };

      const updateData = {
        filter: { _id: currentTrackingShipment._id },
        update: {
          currentLocation: trackingUpdate.location,
          status: trackingUpdate.status,
          eta: trackingUpdate.eta,
          timestamps: timestamp
        }
      };

      const response = await axios.post('https://spaceshare-backend.onrender.com/update-shipments', updateData);

      if (response.data) {
        setShipments(shipments.map(ship => {
          if (ship._id === currentTrackingShipment._id) {
            return {
              ...ship,
              currentLocation: trackingUpdate.location,
              status: trackingUpdate.status,
              eta: trackingUpdate.eta,
              timestamps: [...(ship.timestamps || []), timestamp]
            };
          }
          return ship;
        }));
        
        setShowTrackingModal(false);
        setCurrentTrackingShipment(null);
        setTrackingUpdate({ location: '', status: '', eta: '', notes: '' });
        showNotification('Tracking updated successfully!');
        fetchShipments(localStorage.companyId);
      }
    } catch (error) {
      console.error('Error saving tracking update:', error);
      showNotification('Failed to update tracking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showNotification('Please fill both title and content fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const announcementData = {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        companyId: localStorage.companyId
      };

      const response = await axios.post('https://spaceshare-backend.onrender.com/set-announcements', announcementData);

      if (response.data && response.data.insertedId) {
        setAnnouncements([...announcements, { 
          ...announcementData, 
          _id: response.data.insertedId 
        }]);
        
        setNewAnnouncement({ title: '', content: '' });
        setShowAddAnnouncement(false);
        showNotification('Announcement added successfully!');
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
      showNotification('Failed to add announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowTrackingHistory = (shipment) => {
    setSelectedShipment(shipment);
    setShowTrackingHistoryModal(true);
  };

  const generateShippingID = () => {
    const companyPrefix = localStorage.companyName 
        ? localStorage.companyName.slice(0, 3).toUpperCase() 
        : 'COM';

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateCode = `${day}${month}`;

    const randomChars = Math.random().toString(36).slice(2, 5).toUpperCase();
    const shippingID = `${companyPrefix}${dateCode}${randomChars}`;

    return shippingID.slice(0, 9).padEnd(9, 'X');
  };

  const fetchShipments = async (companyId) => {
    try {
      setLoading(true);
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipments', { companyId });
      const data = response.data;

      if (data) {
        setShipments(data);
        const stats = {
          totalClients: 0,
          totalShipments: 0,
          inTransit: 0,
          delivered: 0,
          pending: 0
        };

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
          }
        });

        setStats(stats);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      showNotification('Failed to fetch shipments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async (companyId) => {
    try {
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-announcements', { companyId });
      const data = response.data;
      if (data) setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.shipmentID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.currentLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchShipments(localStorage.companyId);
    fetchAnnouncements(localStorage.companyId);
  }, []);

  if (loading && shipments.length === 0) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="py-4 bg-light min-vh-100">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1 fw-bold text-dark">Shipment Dashboard</h2>
                <p className="text-muted mb-0">Manage your shipments and track deliveries</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={() => setShowAddAnnouncement(true)}
                  className="d-flex align-items-center"
                >
                  <FaBullhorn className="me-2" />
                  Add Announcement
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setShowAddShipment(true)}
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-2" />
                  New Shipment
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          {[
            { label: 'Total Clients', value: stats.totalClients, index: 0 },
            { label: 'Total Shipments', value: stats.totalShipments, index: 1 },
            { label: 'In Transit', value: stats.inTransit, index: 2 },
            { label: 'Delivered', value: stats.delivered, index: 3 }
          ].map((stat, idx) => {
            const IconComponent = cardStyles[idx].icon;
            return (
              <Col md={3} key={idx} className="mb-3">
                <Card className="border-0 shadow-sm h-100 overflow-hidden position-relative">
                  <div 
                    className="position-absolute w-100 h-100"
                    style={{
                      background: cardStyles[idx].background,
                      opacity: 0.1
                    }}
                  />
                  <Card.Body className="position-relative">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="text-muted mb-2 fw-normal">{stat.label}</h6>
                        <h2 className="mb-0 fw-bold" style={{ color: cardStyles[idx].color }}>
                          {stat.value}
                        </h2>
                      </div>
                      <div 
                        className="p-3 rounded-circle"
                        style={{ 
                          backgroundColor: cardStyles[idx].color + '20',
                          color: cardStyles[idx].color 
                        }}
                      >
                        <IconComponent size={24} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Shipments Management */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 fw-bold">Shipment Management</h5>
                <small className="text-muted">Track and manage all your shipments</small>
              </div>
              <div className="d-flex gap-2">
                <InputGroup style={{ width: '250px' }}>
                  <InputGroup.Text className="bg-light border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search shipments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="d-flex align-items-center">
                    <FaFilter className="me-2" />
                    Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setStatusFilter('all')}>All Status</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('Pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('In Transit')}>In Transit</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('Delivered')}>Delivered</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            {filteredShipments.length === 0 ? (
              <div className="text-center py-5">
                <BsBoxSeam size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No shipments found</h5>
                <p className="text-muted">Create your first shipment to get started</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 fw-semibold">Shipment ID</th>
                    <th className="border-0 fw-semibold">Transport</th>
                    <th className="border-0 fw-semibold">Clients</th>
                    <th className="border-0 fw-semibold">Location</th>
                    <th className="border-0 fw-semibold">Status</th>
                    <th className="border-0 fw-semibold">Departure</th>
                    <th className="border-0 fw-semibold">ETA</th>
                    <th className="border-0 fw-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment._id} className="align-middle">
                      <td>
                        <Button 
                          variant="link" 
                          onClick={() => handleShowTrackingHistory(shipment)}
                          className="p-0 fw-semibold text-decoration-none"
                        >
                          {shipment.shipmentID}
                        </Button>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getTransportIcon(shipment.transportMode)}
                          {shipment.transportMode}
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="px-2 py-1">
                          {shipment.clientsCount}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaMapMarkerAlt className="text-muted me-1" size={12} />
                          {shipment.currentLocation}
                        </div>
                      </td>
                      <td>{getStatusBadge(shipment.status)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="text-muted me-1" size={12} />
                          {new Date(shipment.departureDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="text-muted me-1" size={12} />
                          {new Date(shipment.eta).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleOpenTrackingModal(shipment)}
                            title="Update Tracking"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            onClick={() => handleShowTrackingHistory(shipment)}
                            title="View History"
                          >
                            <FaHistory />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            disabled
                            title="Delete (Disabled)"
                          >
                            <FaTrashAlt />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Announcements */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 fw-bold">Announcements</h5>
                <small className="text-muted">Company-wide announcements and updates</small>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body>
            {announcements.length === 0 ? (
              <div className="text-center py-4">
                <FaBullhorn size={32} className="text-muted mb-3" />
                <p className="text-muted">No announcements yet</p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement._id} className="mb-3 border border-primary border-opacity-25">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-2">{announcement.title}</h6>
                        <p className="mb-2 text-muted">{announcement.content}</p>
                      </div>
                      <Badge bg="primary" className="ms-3">
                        {new Date(announcement.date).toLocaleDateString()}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Add Announcement Modal */}
      <Modal show={showAddAnnouncement} onHide={() => setShowAddAnnouncement(false)} centered>
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="fw-bold">
            <FaBullhorn className="me-2" />
            New Announcement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                placeholder="Enter announcement content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="outline-secondary" onClick={() => setShowAddAnnouncement(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAnnouncement} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Save Announcement
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Shipment Modal */}
      <Modal show={showAddShipment} onHide={() => setShowAddShipment(false)} size="lg" centered>
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="fw-bold">
            <FaShip className="me-2" />
            {editingShipment ? 'Edit Shipment' : 'New Shipment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Transport Mode</Form.Label>
                  <Form.Select
                    value={shipmentForm.transportMode}
                    onChange={(e) => setShipmentForm({...shipmentForm, transportMode: e.target.value})}
                  >
                    <option value="">Select Transport Mode</option>
                    <option value="Express">✈️ Air Express</option>
                    <option value="Air">✈️ Air</option>
                    <option value="Sea">🚢 Sea</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Number of Clients</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Enter client count"
                    value={shipmentForm.clientsCount}
                    onChange={(e) => setShipmentForm({...shipmentForm, clientsCount: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    value={shipmentForm.status}
                    onChange={(e) => setShipmentForm({...shipmentForm, status: e.target.value})}
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">⏳ Pending</option>
                    <option value="In Transit">🚚 In Transit</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Current Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter current location"
                    value={shipmentForm.currentLocation}
                    onChange={(e) => setShipmentForm({...shipmentForm, currentLocation: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Departure Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={shipmentForm.departureDate}
                    onChange={(e) => setShipmentForm({...shipmentForm, departureDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Estimated Arrival (ETA)</Form.Label>
                  <Form.Control
                    type="date"
                    value={shipmentForm.eta}
                    onChange={(e) => setShipmentForm({...shipmentForm, eta: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="outline-secondary" onClick={() => setShowAddShipment(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveShipment} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {editingShipment ? 'Update Shipment' : 'Save Shipment'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tracking Update Modal */}
      <Modal show={showTrackingModal} onHide={() => setShowTrackingModal(false)} centered>
        <Modal.Header closeButton className="border-bottom-0 bg-primary text-white">
          <Modal.Title className="fw-bold d-flex align-items-center">
            <FaEdit className="me-2" />
            Update Shipment Tracking
            <Badge bg="light" text="dark" className="ms-2 fs-6">
              {currentTrackingShipment?.shipmentID}
            </Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-primary" />
                Current Location
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter current location"
                value={trackingUpdate.location}
                onChange={(e) => setTrackingUpdate({...trackingUpdate, location: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Status</Form.Label>
              <Form.Select
                value={trackingUpdate.status}
                onChange={(e) => setTrackingUpdate({...trackingUpdate, status: e.target.value})}
              >
                <option value="">Select Status</option>
                <option value="Pending">⏳ Pending</option>
                <option value="In Transit">🚚 In Transit</option>
                <option value="Delivered">✅ Delivered</option>
                <option value="Cancelled">❌ Cancelled</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-primary" />
                Updated ETA
              </Form.Label>
              <Form.Control
                type="date"
                value={trackingUpdate.eta}
                onChange={(e) => setTrackingUpdate({...trackingUpdate, eta: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any additional notes about this update"
                value={trackingUpdate.notes}
                onChange={(e) => setTrackingUpdate({...trackingUpdate, notes: e.target.value})}
              />
            </Form.Group>
          </Form>
          
          {/* Recent Tracking History */}
          {currentTrackingShipment?.timestamps?.length > 0 && (
            <div className="mt-4">
              <h6 className="fw-bold text-primary mb-3">
                <FaHistory className="me-2" />
                Recent Updates
              </h6>
              <div 
                className="border rounded p-3 bg-light"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                {currentTrackingShipment.timestamps
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 3)
                  .map((ts, index) => (
                    <div key={index} className="mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{ts.location}</div>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            {getStatusBadge(ts.status)}
                            {ts.eta && (
                              <small className="text-muted">
                                ETA: {new Date(ts.eta).toLocaleDateString()}
                              </small>
                            )}
                          </div>
                          {ts.notes && (
                            <small className="text-muted fst-italic">{ts.notes}</small>
                          )}
                        </div>
                        <small className="text-muted">
                          {new Date(ts.date).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="outline-secondary" onClick={() => setShowTrackingModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleTrackingUpdate} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Save Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tracking History Modal */}
      <Modal 
        show={showTrackingHistoryModal} 
        onHide={() => setShowTrackingHistoryModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-bottom-0 bg-gradient" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <Modal.Title className="text-white fw-bold d-flex align-items-center">
            <FaHistory className="me-2" />
            Shipment Tracking History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedShipment && (
            <>
              {/* Shipment Header Info */}
              <Card className="mb-4 border-0 bg-light">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <h4 className="fw-bold mb-2">
                        Shipment: {selectedShipment.shipmentID}
                      </h4>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="d-flex align-items-center">
                          <strong className="me-2">Status:</strong>
                          {getStatusBadge(selectedShipment.status)}
                        </div>
                        <div className="d-flex align-items-center">
                          <FaMapMarkerAlt className="text-primary me-1" />
                          <strong className="me-2">Location:</strong>
                          {selectedShipment.currentLocation}
                        </div>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="text-primary me-1" />
                          <strong className="me-2">ETA:</strong>
                          {new Date(selectedShipment.eta).toLocaleDateString()}
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="d-flex align-items-center justify-content-end">
                        {getTransportIcon(selectedShipment.transportMode)}
                        <span className="fw-semibold">{selectedShipment.transportMode}</span>
                      </div>
                      <Badge bg="primary" className="mt-2">
                        {selectedShipment.clientsCount} Clients
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Timeline */}
              <div className="tracking-timeline">
                {selectedShipment.timestamps?.length > 0 ? (
                  selectedShipment.timestamps
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((timestamp, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-point"></div>
                        <Card className="timeline-content border-0 shadow-sm">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="fw-bold mb-0 d-flex align-items-center">
                                <FaMapMarkerAlt className="text-primary me-2" size={14} />
                                {timestamp.location}
                              </h6>
                              <Badge bg="light" text="dark" className="fs-7">
                                {new Date(timestamp.date).toLocaleString()}
                              </Badge>
                            </div>
                            
                            <div className="d-flex align-items-center gap-3 mb-2">
                              {getStatusBadge(timestamp.status)}
                              {timestamp.eta && (
                                <small className="text-muted d-flex align-items-center">
                                  <FaCalendarAlt className="me-1" size={12} />
                                  ETA: {new Date(timestamp.eta).toLocaleDateString()}
                                </small>
                              )}
                            </div>
                            
                            {timestamp.notes && (
                              <Alert variant="light" className="mb-2 py-2">
                                <small className="mb-0">{timestamp.notes}</small>
                              </Alert>
                            )}
                            
                            <small className="text-muted">
                              Updated by: <span className="fw-semibold">{timestamp.updatedBy}</span>
                            </small>
                          </Card.Body>
                        </Card>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-5">
                    <FaHistory size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No tracking history available</h5>
                    <p className="text-muted">Updates will appear here as the shipment progresses</p>
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0 bg-light">
          <Button 
            variant="primary" 
            onClick={() => setShowTrackingHistoryModal(false)}
            className="px-4"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} 
          autohide
          bg={toastVariant === 'error' ? 'danger' : toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'error' ? '❌' : '✅'} Notification
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'error' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Custom Styles */}
      <style>{`
        .tracking-timeline {
          position: relative;
          padding-left: 40px;
        }
        
        .timeline-item {
          position: relative;
          padding-bottom: 30px;
        }
        
        .timeline-point {
          position: absolute;
          left: -28px;
          top: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          z-index: 2;
        }
        
        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: -22px;
          top: 24px;
          height: calc(100% - 16px);
          width: 4px;
          background: linear-gradient(180deg, #667eea 0%, rgba(102, 126, 234, 0.2) 100%);
          border-radius: 2px;
        }
        
        .timeline-content {
          margin-left: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .timeline-content:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }

        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }

        .card:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }

        .table tbody tr:hover {
          background-color: rgba(102, 126, 234, 0.05);
        }

        .btn-outline-primary:hover,
        .btn-outline-info:hover,
        .btn-outline-danger:hover {
          transform: translateY(-1px);
          transition: transform 0.1s ease;
        }
      `}</style>
    </>
  );
};

export default ManageShipments;