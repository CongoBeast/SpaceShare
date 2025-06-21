import React, { useState, useEffect } from "react";
import { Tab, Tabs, Card, Button, Row, Col } from "react-bootstrap";
import { FaCheck, FaUser } from "react-icons/fa";
import axios from "axios"

const OfferRequestsPage = () => {
  const [key, setKey] = useState("pending");

  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);

    // Submit the edited offer
    const handleAccept = async (request) => {
      console.log(request._id)
      try {
        await axios.put(`http://localhost:3001/edit-request/${request._id}`, request);
        alert("Request updated successfully!");
        console.log(request)
        // setShowModal(false);
        fetchPendingRequests( localStorage.user , "Pending", setPendingRequests);
        fetchAcceptedRequests(localStorage.user , "Accepted" ,  setAcceptedRequests);
      } catch (error) {
        console.error("Error updating offer:", error);
      }
    };

  const fetchAcceptedRequests = async (username, status, setAcceptedRequests) => {
    try {
      const response = await axios.get("http://localhost:3001/recieved-requests/by-user", {
        params: { username, status },
      });
      setAcceptedRequests(response.data);
    } catch (error) {
      console.error("Error fetching packages by user:", error);
    }
  };

  const fetchPendingRequests = async (username, status, setPendingRequests) => {
    try {
      const response = await axios.get("http://localhost:3001/recieved-requests/by-user", {
        params: { username, status },
      });
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching packages by user:", error);
    }
  };

  useEffect(() => {
    fetchPendingRequests( localStorage.user , "Pending", setPendingRequests);
    fetchAcceptedRequests(localStorage.user , "Accepted" ,  setAcceptedRequests);
  }, []);

  // const requests = pendingRequests.concat(acceptedRequests)
 var requests = [ ...pendingRequests , ...acceptedRequests]


  var requests = Array.from(
    new Map(requests.map(item => [item.id, item])).values()
  );

  // console.log(uniqueRequests)

  // const handleAccept = (request) => {
  //   alert(`Request ID ${request._id} accepted!`);
  //   // Update the request status in your actual implementation
  // };

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
          eventKey="Pending"
          title={
            <span>
              <FaUser className="me-2" /> Pending Requests
            </span>
          }
        >
          <RequestTiles
            requests={requests.filter((req) => req.status === "Pending")}
            handleAccept={handleAccept}
          />
        </Tab>
        <Tab
          eventKey="Accepted"
          title={
            <span>
              <FaCheck className="me-2" /> Accepted Requests
            </span>
          }
        >
          <RequestTiles
            requests={requests.filter((req) => req.status === "Accepted")}
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
        <Col key={request._id}>
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
                  <Card.Title className="mb-0">{request.reqquestee}</Card.Title>
                  <small className="text-muted">
                    Requested on: {request.timestamp}
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
                <strong>Offer Details:</strong> {request.message} <br />
                <strong>Departure:</strong> {request.departure} <br />
                <strong>Destination:</strong> {request.destination} <br />
              </Card.Text>
              {handleAccept && (
                <Button
                  variant="success"
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => handleAccept(request)}
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

export default OfferRequestsPage;
