import React, { useState } from 'react';
import { Container, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const TrackShipment = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
        if (!trackingId.trim()) {
            setError('Please enter a tracking ID');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('https://spaceshare-backend.onrender.com/track', {
                trackingId: trackingId.trim()
            });

            if (response.data) {
                setShipment(response.data);
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
    } catch (err) {
      console.error('Failed to read clipboard:', err);
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

  return (
    <Container className="my-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h2 className="mb-4">Track Your Shipment</h2>
          
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Enter your tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="me-2"
            />
            
            <Button 
              variant="secondary" 
              onClick={handlePaste}
              className="me-2"
              title="Paste from clipboard"
            >
              📋
            </Button>
            
            <Button 
              variant="primary" 
              onClick={handleSearch}
              disabled={loading}
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
              ) : 'Track'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {shipment ? (
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Shipment: {shipment.shipperID}</h4>
              <Badge 
                bg={
                  shipment.status === 'Delivered' ? 'success' : 
                  shipment.status === 'In Transit' ? 'warning' : 
                  'secondary'
                }
              >
                {shipment.status}
              </Badge>
            </div>

            <div className="mb-3">
              <p><strong>Current Location:</strong> {shipment.currentLocation}</p>
              <p><strong>Transport Mode:</strong> {shipment.transportMode}</p>
              <p><strong>Estimated Arrival:</strong> {formatDate(shipment.eta)}</p>
            </div>

            <div className="tracking-timeline">
              <h5 className="mb-3">Tracking History</h5>
              
              {shipment.timestamps?.length > 0 ? (
                shipment.timestamps
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((timestamp, index) => (
                    <div key={index} className="timeline-item mb-3">
                      <div className="d-flex">
                        <div className="timeline-point me-3"></div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <h6>{timestamp.location}</h6>
                            <small className="text-muted">
                              {formatDate(timestamp.date)}
                            </small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Badge 
                              bg={
                                timestamp.status === 'Delivered' ? 'success' : 
                                timestamp.status === 'In Transit' ? 'warning' : 
                                'secondary'
                              }
                              className="me-2"
                            >
                              {timestamp.status}
                            </Badge>
                            {timestamp.eta && (
                              <small>ETA: {formatDate(timestamp.eta)}</small>
                            )}
                          </div>
                          {timestamp.notes && (
                            <div className="bg-light p-2 rounded">
                              <p className="mb-0">{timestamp.notes}</p>
                              <small className="text-muted">
                                Updated by: {timestamp.updatedBy}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-muted">No tracking history available</p>
              )}
            </div>
          </Card.Body>
        </Card>
      ) : (
        !loading && !error && (
          <Card className="shadow-sm">
            <Card.Body className="text-center py-5">
              <h5 className="text-muted">Enter a tracking ID to view shipment details</h5>
              <p className="text-muted mb-0">Your tracking ID can be found in your confirmation email</p>
            </Card.Body>
          </Card>
        )
      )}

      <style jsx>{`
        /* TrackShipment.css */
            .tracking-timeline {
            position: relative;
            padding-left: 20px;
            }

            .timeline-item {
            position: relative;
            padding-bottom: 20px;
            }

            .timeline-point {
            position: absolute;
            left: 0;
            top: 5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #0d6efd;
            border: 2px solid white;
            z-index: 2;
            }

            .timeline-item:not(:last-child)::before {
            content: '';
            position: absolute;
            left: 5px;
            top: 17px;
            height: calc(100% - 10px);
            width: 2px;
            background-color: #e9ecef;
            }
        /* ... rest of the styles ... */
        `}</style>
    </Container>
  );
};

export default TrackShipment;