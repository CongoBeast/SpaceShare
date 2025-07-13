import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Modal, Form, Breadcrumb, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useParams, Link } from 'react-router-dom';

const MyOffersPage = () => {
  const [buyPackages, setBuyPackages] = useState([]);
  const [sellPackages, setSellPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [offerData, setOfferData] = useState({
    id: "",
    type: "sell",
    space: "",
    goodsType: "",
    denomination: "",
    departure: "",
    destination: "",
    departureDate: "",
    price: "",
  });

  // Fetch Buy and Sell Offers
  useEffect(() => {
    fetchPackages( localStorage.user , "buy", setBuyPackages);
    fetchPackages(localStorage.user , "sell" ,  setSellPackages);
  }, []);

  // const fetchPackages = async (type, setPackages) => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/packages", {
  //       params: { type },
  //     });
  //     setPackages(response.data);
  //   } catch (error) {
  //     console.error("Error fetching packages:", error);
  //   }
  // };
  const fetchPackages = async (username, type, setPackages) => {
    try {
      const response = await axios.get("https://spaceshare-backend.onrender.com/packages/by-user", {
        params: { username, type },
      });
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages by user:", error);
    }
  };

  // Merge buy and sell packages into one array
  const offers = buyPackages.concat(sellPackages);

  // Handle input change in modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal with pre-filled data
  const handleEdit = (offer) => {
    setOfferData(offer);
    setShowModal(true);
  };

  // Submit the edited offer
  const handleUpdate = async () => {
    console.log(offerData.id)
    try {
      await axios.put(`https://spaceshare-backend.onrender.com/edit-offer/${offerData.id}`, offerData);
      alert("Offer updated successfully!");
      console.log(offerData)
      setShowModal(false);
      fetchPackages(localStorage.user, "buy" , setBuyPackages);
      fetchPackages(localStorage.user, "sell",  setSellPackages);
    } catch (error) {
      console.error("Error updating offer:", error);
    }
  };

  // Delete offer
  const handleDelete = async (id) => {
    console.log(id)
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axios.delete(`https://spaceshare-backend.onrender.com/delete-offer/${id}`);
        alert("Offer deleted successfully!");
        fetchPackages(localStorage.user, "buy", setBuyPackages);
        fetchPackages(localStorage.user, "sell", setSellPackages);
      } catch (error) {
        console.error("Error deleting offer:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Posted Offers</h2>


      <Breadcrumb className='p-3 rounded'>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/profile' }}>
            <Badge bg="primary">My Profile</Badge>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
            <Badge bg="dark">My Posted Offers</Badge>
            </Breadcrumb.Item>
        </Breadcrumb>

      <Row xs={1} md={2} lg={3} className="g-4">
        {offers.map((offer) => (
          <Col key={offer._id}>
            <Card className="shadow-sm" style={{ borderRadius: "10px" , backgroundColor: offer.type === "buyers" ? "#e8f4fc" : "#fde8e8", }}>
              <Card.Body>
                <Card.Title>
                  {offer.username} <span className="text-muted fs-6">({offer.type})</span>
                </Card.Title>
                <Card.Text>
                  <strong>Goods Type:</strong> {offer.goodsType} <br />
                  <strong>Departure:</strong> {offer.departure} <br />
                  <strong>Destination:</strong> {offer.destination} <br />
                  <strong>Departure Date:</strong> {offer.departureDate} <br />
                  <strong>Expiration Date:</strong> {offer.dateExpiration} <br />
                  {offer.spaceNeeded ? (
                    <strong>Space Needed:</strong>
                  ) : (
                    <>
                      <strong>Space Available:</strong> {offer.space} <br />
                      <strong>Price:</strong> ${offer.price} <br />
                    </>
                  )}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="outline-primary" onClick={() => handleEdit(offer)}>
                    <FaEdit className="me-2" /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDelete(offer.id)}>
                    <FaTrash className="me-2" /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Offer Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Type of Offer</Form.Label>
              <Form.Select name="type" value={offerData.type} onChange={handleInputChange}>
                <option value="sell">Sell</option>
                <option value="buy">Buy</option>
              </Form.Select>
            </Form.Group>

            {["space", "goodsType", "denomination", "departure", "destination", "departureDate", "price"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === "departureDate" ? "date" : field === "price" ? "number" : "text"}
                  name={field}
                  value={offerData[field]}
                  onChange={handleInputChange}
                  placeholder={
                    field === "space" ? "Enter available space (e.g. 2 phones, 5kg)" :
                    field === "goodsType" ? "Enter goods type (e.g., Electronics)" :
                    field === "denomination" ? "Enter currency (e.g., USD)" :
                    field === "departure" ? "Enter departure location" :
                    field === "destination" ? "Enter destination" :
                    field === "price" ? "Enter price (e.g., 500/kg)" : ""
                  }
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyOffersPage;
