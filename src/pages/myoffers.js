import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";


const MyOffersPage = () => {
  // Sample offers data (can be fetched from an API)
  const [offers, setOffers] = useState([
    {
      id: 1,
      username: "JohnDoe",
      datePosted: "2025-01-01",
      goodsType: "Electronics",
      departure: "New York",
      destination: "Los Angeles",
      dateDeparture: "2025-01-10",
      dateExpiration: "2025-01-15",
      spaceAvailable: "100 cubic meters",
      price: 500,
    },
    {
      id: 2,
      username: "JaneSmith",
      datePosted: "2025-01-02",
      goodsType: "Furniture",
      departure: "Chicago",
      destination: "Houston",
      dateDeparture: "2025-01-12",
      dateExpiration: "2025-01-18",
      spaceNeeded: "50 cubic meters",
    },
  ]);
  const navigate = useNavigate();

  // Handle edit action
  const handleEdit = (id) => {
    alert(`Edit offer with ID: ${id}`);
    // Add your logic here for editing (e.g., show a modal or navigate to an edit page)
  };

  // Handle delete action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Posted Offers</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {offers.map((offer) => (
          <Col key={offer.id}>
            <Card className="shadow-sm" style={{ borderRadius: "10px" }}>
              <Card.Body>
                <Card.Title className="mb-3">
                  {offer.username} <span className="text-muted fs-6">({offer.datePosted})</span>
                </Card.Title>
                <Card.Text>
                  <strong>Goods Type:</strong> {offer.goodsType} <br />
                  <strong>Departure:</strong> {offer.departure} <br />
                  <strong>Destination:</strong> {offer.destination} <br />
                  <strong>Departure Date:</strong> {offer.dateDeparture} <br />
                  <strong>Expiration Date:</strong> {offer.dateExpiration} <br />
                  {offer.spaceNeeded ? (
                    <strong>Space Needed:</strong>
                  ) : (
                    <>
                      <strong>Space Available:</strong> {offer.spaceAvailable} <br />
                      <strong>Price:</strong> ${offer.price} <br />
                    </>
                  )}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center"
                    onClick={() => handleEdit(offer.id)}
                  >
                    <FaEdit className="me-2" /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="d-flex align-items-center"
                    onClick={() => handleDelete(offer.id)}
                  >
                    <FaTrash className="me-2" /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MyOffersPage;
