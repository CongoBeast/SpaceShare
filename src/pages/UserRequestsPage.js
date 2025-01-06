import React, { useState } from "react";
import { Tab, Tabs, Card, Button, Row, Col } from "react-bootstrap";
import { FaCheck, FaUser } from "react-icons/fa";

const UserRequestsPage = () => {
  const [key, setKey] = useState("pending");

  // Sample data
  const requests = [
    {
      id: 1,
      requester: "JaneDoe",
      requesterImage: "https://via.placeholder.com/50",
      dateRequested: "2025-01-02",
      offerDetails: "Space Needed: 50 cubic meters | Goods: Furniture",
      departure: "Chicago",
      destination: "Houston",
      status: "pending",
    },
    {
      id: 2,
      requester: "JohnSmith",
      requesterImage: "https://via.placeholder.com/50",
      dateRequested: "2025-01-03",
      offerDetails: "Space Available: 100 cubic meters | Goods: Electronics",
      departure: "New York",
      destination: "Los Angeles",
      status: "accepted",
    },
  ];

  const handleAccept = (id) => {
    alert(`Request ID ${id} accepted!`);
    // Update the request status in your actual implementation
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Requests for Your Offers</h2>

      <Tabs
        id="requests-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4 justify-content-center"
      >
        <Tab
          eventKey="pending"
          title={
            <span>
              <FaUser className="me-2" /> Pending Requests
            </span>
          }
        >
          <RequestTiles
            requests={requests.filter((req) => req.status === "pending")}
            handleAccept={handleAccept}
          />
        </Tab>
        <Tab
          eventKey="accepted"
          title={
            <span>
              <FaCheck className="me-2" /> Accepted Requests
            </span>
          }
        >
          <RequestTiles
            requests={requests.filter((req) => req.status === "accepted")}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

const RequestTiles = ({ requests, handleAccept }) => {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {requests.map((request) => (
        <Col key={request.id}>
          <Card
            className="shadow-sm"
            style={{
              borderRadius: "10px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <Card.Title className="mb-0">{request.requester}</Card.Title>
                  <small className="text-muted">
                    Requested on: {request.dateRequested}
                  </small>
                </div>
                <img
                  src={request.requesterImage}
                  alt={request.requester}
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
              <Card.Text>
                <strong>Offer Details:</strong> {request.offerDetails} <br />
                <strong>Departure:</strong> {request.departure} <br />
                <strong>Destination:</strong> {request.destination} <br />
              </Card.Text>
              {handleAccept && (
                <Button
                  variant="success"
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => handleAccept(request.id)}
                >
                  <FaCheck className="me-2" /> Accept Request
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default UserRequestsPage;
