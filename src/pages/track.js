// import React, { useState } from 'react';
// import { Container, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
// import axios from 'axios';

// const TrackShipment = () => {
//   const [trackingId, setTrackingId] = useState('');
//   const [shipment, setShipment] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//         if (!trackingId.trim()) {
//             setError('Please enter a tracking ID');
//             return;
//         }

//         setLoading(true);
//         setError(null);
        
//         try {
//             const response = await axios.post('https://spaceshare-backend.onrender.com/track', {
//                 trackingId: trackingId.trim()
//             });

//             if (response.data) {
//                 setShipment(response.data);
//             } else {
//                 setError('No shipment found with this tracking ID');
//                 setShipment(null);
//             }
//         } catch (err) {
//             if (err.response && err.response.status === 404) {
//                 setError('No shipment found with this tracking ID');
//             } else {
//                 console.error('Error fetching shipment:', err);
//                 setError('Failed to fetch shipment details. Please try again.');
//             }
//             setShipment(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//   const handlePaste = async () => {
//     try {
//       const text = await navigator.clipboard.readText();
//       setTrackingId(text);
//     } catch (err) {
//       console.error('Failed to read clipboard:', err);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <Container className="my-4">
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <h2 className="mb-4">Track Your Shipment</h2>
          
//           <div className="d-flex align-items-center">
//             <Form.Control
//               type="text"
//               placeholder="Enter your tracking ID"
//               value={trackingId}
//               onChange={(e) => setTrackingId(e.target.value)}
//               className="me-2"
//             />
            
//             <Button 
//               variant="secondary" 
//               onClick={handlePaste}
//               className="me-2"
//               title="Paste from clipboard"
//             >
//               📋
//             </Button>
            
//             <Button 
//               variant="primary" 
//               onClick={handleSearch}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Spinner
//                     as="span"
//                     animation="border"
//                     size="sm"
//                     role="status"
//                     aria-hidden="true"
//                     className="me-2"
//                   />
//                   Searching...
//                 </>
//               ) : 'Track'}
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       {error && (
//         <Alert variant="danger" className="mb-4">
//           {error}
//         </Alert>
//       )}

//       {shipment ? (
//         <Card className="shadow-sm">
//           <Card.Body>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h4>Shipment: {shipment.shipperID}</h4>
//               <Badge 
//                 bg={
//                   shipment.status === 'Delivered' ? 'success' : 
//                   shipment.status === 'In Transit' ? 'warning' : 
//                   'secondary'
//                 }
//               >
//                 {shipment.status}
//               </Badge>
//             </div>

//             <div className="mb-3">
//               <p><strong>Current Location:</strong> {shipment.currentLocation}</p>
//               <p><strong>Transport Mode:</strong> {shipment.transportMode}</p>
//               <p><strong>Estimated Arrival:</strong> {formatDate(shipment.eta)}</p>
//             </div>

//             <div className="tracking-timeline">
//               <h5 className="mb-3">Tracking History</h5>
              
//               {shipment.timestamps?.length > 0 ? (
//                 shipment.timestamps
//                   .sort((a, b) => new Date(b.date) - new Date(a.date))
//                   .map((timestamp, index) => (
//                     <div key={index} className="timeline-item mb-3">
//                       <div className="d-flex">
//                         <div className="timeline-point me-3"></div>
//                         <div className="flex-grow-1">
//                           <div className="d-flex justify-content-between">
//                             <h6>{timestamp.location}</h6>
//                             <small className="text-muted">
//                               {formatDate(timestamp.date)}
//                             </small>
//                           </div>
//                           <div className="d-flex align-items-center mb-2">
//                             <Badge 
//                               bg={
//                                 timestamp.status === 'Delivered' ? 'success' : 
//                                 timestamp.status === 'In Transit' ? 'warning' : 
//                                 'secondary'
//                               }
//                               className="me-2"
//                             >
//                               {timestamp.status}
//                             </Badge>
//                             {timestamp.eta && (
//                               <small>ETA: {formatDate(timestamp.eta)}</small>
//                             )}
//                           </div>
//                           {timestamp.notes && (
//                             <div className="bg-light p-2 rounded">
//                               <p className="mb-0">{timestamp.notes}</p>
//                               <small className="text-muted">
//                                 Updated by: {timestamp.updatedBy}
//                               </small>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//               ) : (
//                 <p className="text-muted">No tracking history available</p>
//               )}
//             </div>
//           </Card.Body>
//         </Card>
//       ) : (
//         !loading && !error && (
//           <Card className="shadow-sm">
//             <Card.Body className="text-center py-5">
//               <h5 className="text-muted">Enter a tracking ID to view shipment details</h5>
//               <p className="text-muted mb-0">Your tracking ID can be found in your confirmation email</p>
//             </Card.Body>
//           </Card>
//         )
//       )}

//       <style jsx>{`
//         /* TrackShipment.css */
//             .tracking-timeline {
//             position: relative;
//             padding-left: 20px;
//             }

//             .timeline-item {
//             position: relative;
//             padding-bottom: 20px;
//             }

//             .timeline-point {
//             position: absolute;
//             left: 0;
//             top: 5px;
//             width: 12px;
//             height: 12px;
//             border-radius: 50%;
//             background-color: #0d6efd;
//             border: 2px solid white;
//             z-index: 2;
//             }

//             .timeline-item:not(:last-child)::before {
//             content: '';
//             position: absolute;
//             left: 5px;
//             top: 17px;
//             height: calc(100% - 10px);
//             width: 2px;
//             background-color: #e9ecef;
//             }
//         /* ... rest of the styles ... */
//         `}</style>
//     </Container>
//   );
// };

// export default TrackShipment;
import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Badge, 
  Spinner, 
  Alert, 
  Row, 
  Col,
  ProgressBar,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import axios from 'axios';

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // Toast notification helper
  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    console.log(trackingId.trim())

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('https://spaceshare-backend.onrender.com/track', {
        trackingId: trackingId.trim()
      });

      if (response.data) {
        setShipment(response.data);
        showNotification('Shipment found successfully!');
      } else {
        setError('No shipment found with this tracking ID');
        setShipment(null);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No shipment found with this tracking ID');
      } else {
        console.error('Error fetching shipment:', err);
        setError('Failed to fetch shipment details. Please try again.');
      }
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTrackingId(text);
      showNotification('Tracking ID pasted from clipboard', 'info');
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      showNotification('Failed to paste from clipboard', 'warning');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'in transit':
      case 'shipped':
        return 'warning';
      case 'processing':
      case 'preparing':
        return 'info';
      case 'cancelled':
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'fas fa-check-circle';
      case 'in transit':
      case 'shipped':
        return 'fas fa-truck';
      case 'processing':
      case 'preparing':
        return 'fas fa-box';
      case 'cancelled':
      case 'failed':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-clock';
    }
  };

  const getTransportIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'sea':
      case 'ship':
        return 'fas fa-ship';
      case 'air':
      case 'plane':
        return 'fas fa-plane';
      case 'express':
      case 'courier':
        return 'fas fa-rocket';
      case 'truck':
      case 'road':
        return 'fas fa-truck';
      default:
        return 'fas fa-shipping-fast';
    }
  };

  const calculateProgress = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
      case 'preparing':
        return 20;
      case 'shipped':
      case 'in transit':
        return 60;
      case 'out for delivery':
        return 90;
      case 'delivered':
        return 100;
      default:
        return 10;
    }
  };

  return (
    <Container className="my-4">
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="position-fixed" style={{ zIndex: 1050 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? '✓ Success' : 
               toastVariant === 'info' ? 'ℹ Info' : 
               toastVariant === 'warning' ? '⚠ Warning' : '✗ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Header Section */}
      <Card className="mb-4 border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card.Body className="text-white p-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="mb-2 fw-bold">
                <i className="fas fa-search-location me-3"></i>
                Track Your Shipment
              </h1>
              <p className="mb-0 opacity-75 fs-5">
                Enter your tracking ID to get real-time updates on your package
              </p>
            </Col>
            <Col xs="auto" className="d-none d-md-block">
              <div className="text-end">
                <i className="fas fa-globe fs-1 opacity-25"></i>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Search Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Form>
            <Row className="align-items-end">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-semibold mb-2">
                    <i className="fas fa-barcode text-primary me-2"></i>
                    Tracking ID
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your tracking ID (e.g., SS123456789)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="form-control-lg"
                    style={{ fontSize: '1.1rem' }}
                  />
                  {/* <Form.Text className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Your tracking ID can be found in your confirmation email
                  </Form.Text> */}
                </Form.Group>
              </Col>
              <Col md={4}>
                <div className="d-flex gap-2">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Paste from clipboard</Tooltip>}
                  >
                    <Button 
                      variant="outline-secondary" 
                      onClick={handlePaste}
                      className="px-4 py-3"
                      style={{ minWidth: '60px' }}
                    >
                      <i className="fas fa-paste fs-5"></i>
                    </Button>
                  </OverlayTrigger>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-3 flex-grow-1"
                    style={{ minWidth: '120px' }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-2"></i>
                        Track Package
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4 border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle fs-4 me-3"></i>
            <div>
              <Alert.Heading className="h6 mb-1">Tracking Error</Alert.Heading>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </Alert>
      )}

      {/* Shipment Details */}
      {shipment ? (
        <>
          {/* Shipment Overview */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row className="align-items-center mb-4">
                <Col>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="fas fa-box text-primary fs-4"></i>
                    </div>
                    <div>
                      <h3 className="mb-1 fw-bold">Shipment #{shipment.shipperID}</h3>
                      <p className="text-muted mb-0">Tracking your package in real-time</p>
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <Badge 
                    bg={getStatusColor(shipment.status)}
                    className="px-4 py-2 fs-6 fw-normal"
                  >
                    <i className={`${getStatusIcon(shipment.status)} me-2`}></i>
                    {shipment.status}
                  </Badge>
                </Col>
              </Row>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="fw-semibold text-muted">DELIVERY PROGRESS</small>
                  <small className="fw-semibold text-muted">{calculateProgress(shipment.status)}%</small>
                </div>
                <ProgressBar 
                  now={calculateProgress(shipment.status)} 
                  variant={getStatusColor(shipment.status)}
                  style={{ height: '8px' }}
                  className="mb-0"
                />
              </div>

              {/* Key Information */}
              <Row className="g-4">
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-map-marker-alt text-info"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Current Location</small>
                      <strong>{shipment.currentLocation}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                      <i className={`${getTransportIcon(shipment.transportMode)} text-warning`}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Transport Mode</small>
                      <strong className="text-capitalize">{shipment.transportMode}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-calendar-alt text-success"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Estimated Arrival</small>
                      <strong>{formatDate(shipment.eta)}</strong>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tracking Timeline */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-route text-primary me-2"></i>
                Tracking Timeline
              </h5>
              <p className="text-muted mb-0 mt-1">Complete journey of your package</p>
            </Card.Header>
            <Card.Body className="p-4">
              {shipment.timestamps?.length > 0 ? (
                <div className="tracking-timeline">
                  {shipment.timestamps
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((timestamp, index) => (
                      <div key={index} className="timeline-item mb-4">
                        <div className="d-flex">
                          <div className="timeline-marker me-4">
                            <div 
                              className={`timeline-point bg-${getStatusColor(timestamp.status)}`}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                border: '3px solid white',
                                boxShadow: '0 0 0 3px var(--bs-gray-200)',
                                position: 'relative',
                                zIndex: 2
                              }}
                            ></div>
                            {index < shipment.timestamps.length - 1 && (
                              <div 
                                className="timeline-line"
                                style={{
                                  position: 'absolute',
                                  left: '7px',
                                  top: '22px',
                                  width: '2px',
                                  height: '60px',
                                  backgroundColor: 'var(--bs-gray-300)',
                                  zIndex: 1
                                }}
                              ></div>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <Card className="border-0 bg-light">
                              <Card.Body className="p-3">
                                <Row className="align-items-center mb-2">
                                  <Col>
                                    <h6 className="mb-1 fw-bold">
                                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                      {timestamp.location}
                                    </h6>
                                  </Col>
                                  <Col xs="auto">
                                    <small className="text-muted">
                                      <i className="fas fa-clock me-1"></i>
                                      {formatDate(timestamp.date)}
                                    </small>
                                  </Col>
                                </Row>
                                
                                <div className="d-flex align-items-center mb-2">
                                  <Badge 
                                    bg={getStatusColor(timestamp.status)}
                                    className="px-3 py-1 me-3"
                                  >
                                    <i className={`${getStatusIcon(timestamp.status)} me-1`}></i>
                                    {timestamp.status}
                                  </Badge>
                                  {timestamp.eta && (
                                    <small className="text-muted">
                                      <i className="fas fa-calendar-check me-1"></i>
                                      ETA: {formatDate(timestamp.eta)}
                                    </small>
                                  )}
                                </div>
                                
                                {timestamp.notes && (
                                  <div className="bg-white rounded p-3 border">
                                    <p className="mb-2">{timestamp.notes}</p>
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      Updated by: <strong>{timestamp.updatedBy}</strong>
                                    </small>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-history text-muted fs-1 mb-3"></i>
                  <h5 className="text-muted mb-2">No tracking history available</h5>
                  <p className="text-muted mb-0">
                    Tracking information will appear here once your package starts its journey
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      ) : (
        !loading && !error && (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <div className="mb-4">
                <i className="fas fa-search text-muted" style={{ fontSize: '4rem' }}></i>
              </div>
              <h4 className="text-muted mb-3">Ready to Track Your Package?</h4>
              <p className="text-muted mb-4 fs-5">
                Enter your tracking ID above to get detailed information about your shipment
              </p>
              <div className="bg-light rounded p-4 mx-auto" style={{ maxWidth: '500px' }}>
                <h6 className="mb-3">📧 Where to find your tracking ID:</h6>
                <ul className="list-unstyled mb-0 text-start">
                  <li className="mb-2">
                    <i className="fas fa-envelope text-primary me-2"></i>
                    Check your confirmation email
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-receipt text-success me-2"></i>
                    Look at your shipping receipt
                  </li>
                  <li className="mb-0">
                    <i className="fas fa-mobile-alt text-info me-2"></i>
                    Check SMS notifications
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        )
      )}

      {/* Quick Actions */}
      {shipment && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline-primary" 
            onClick={() => {
              setTrackingId('');
              setShipment(null);
              setError(null);
            }}
            className="me-3 px-4"
          >
            <i className="fas fa-search-plus me-2"></i>
            Track Another Package
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => window.print()}
            className="px-4"
          >
            <i className="fas fa-print me-2"></i>
            Print Details
          </Button>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .tracking-timeline {
          position: relative;
          padding-left: 0;
        }

        .timeline-item {
          position: relative;
        }

        .timeline-marker {
          position: relative;
          width: 16px;
          flex-shrink: 0;
        }

        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        
        .form-control-lg {
          border-radius: 12px;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }
        
        .form-control-lg:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }
        
        .btn {
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
        
        .card {
          border-radius: 16px;
        }
        
        .badge {
          border-radius: 8px;
        }
        
        .timeline-point {
          transition: all 0.3s ease;
        }
        
        .timeline-item:hover .timeline-point {
          transform: scale(1.2);
        }

        @media print {
          .btn, .toast-container {
            display: none !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default TrackShipment;