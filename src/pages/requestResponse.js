import React, { useState } from "react";
import { Tabs, Tab, Card, Button } from "react-bootstrap";

const RequestResponses = ({ requests }) => {
  const [activeTab, setActiveTab] = useState("pending");

  const renderCard = (request, isAccepted) => (
    <Card className="mb-4 shadow-sm" key={request.id} style={{ borderRadius: "10px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">{request.offerUsername}</h5>
            <p className="mb-1">
              <strong>Goods Type:</strong> {request.goodsType}
            </p>
            <p className="mb-1">
              <strong>Departure:</strong> {request.departure}
            </p>
            <p className="mb-1">
              <strong>Destination:</strong> {request.destination}
            </p>
            {isAccepted && (
              <>
                <p className="mb-1">
                  <strong>Contact:</strong> {request.contactInfo}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {request.email}
                </p>
              </>
            )}
            <p className="mb-0 text-muted">
              <strong>Requested On:</strong> {new Date(request.requestDate).toLocaleDateString()}
            </p>
          </div>
          <img
            src={request.offerImage || "https://via.placeholder.com/50"}
            alt="Offer Owner"
            className="rounded-circle"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
        {!isAccepted && (
          <div className="d-flex justify-content-center mt-3">
            <Button variant="warning" disabled>
              Pending Response
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Requests</h2>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        variant="pills"
        justify
        style={{ fontSize: "1.1rem" }}
      >
        <Tab eventKey="pending" title="Pending Requests">
          <div>
            {requests
              .filter((req) => !req.isAccepted)
              .map((request) => renderCard(request, false))}
          </div>
        </Tab>
        <Tab eventKey="accepted" title="Accepted Requests">
          <div>
            {requests
              .filter((req) => req.isAccepted)
              .map((request) => renderCard(request, true))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default RequestResponses;
