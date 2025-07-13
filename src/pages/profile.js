import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button, Modal, Form, Table, Alert} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'


const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerBuyCount , setOfferBuyCount] = useState(0)
  const [offerSellCount , setOfferSellCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [offerData, setOfferData] = useState({
    type: "buy",
    space: "",
    goodsType: "",
    units: "",
    denomination: "",
    departure: "",
    destination: "",
    departureDate: "",
    price: "",
    username: localStorage.user
  });

  const [userData , setUserData] = useState()

  const [formData, setFormData] = useState({
    email: userData?.email || '',
    phoneNumber: userData?.phoneNumber || '',
    weChatId: userData?.weChatId || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () =>{
    setShowContactModal(false )
  }

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const username = localStorage.user

      const response = await axios.post('https://spaceshare-backend.onrender.com/get-user', { username });
      const userData = response.data[0];
  
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user information:', error);
      throw error; // so it can be caught in fetchAll
    } finally {
    }
  };

   const fetchBuyOfferCount = async (username, type, setOfferBuyCount) => {
      try {
        const response = await axios.get("https://spaceshare-backend.onrender.com/packages/by-user", {
          params: { username, type },
        });
        setOfferBuyCount(response.data.length);
      } catch (error) {
        console.error("Error fetching packages by user:", error);
      }
    };

    const fetchSellOfferCount = async (username, type, setOfferSellCount) => {
      try {
        const response = await axios.get("https://spaceshare-backend.onrender.com/packages/by-user", {
          params: { username, type },
        });
        setOfferSellCount(response.data.length);
      } catch (error) {
        console.error("Error fetching packages by user:", error);
      }
    };

    useEffect(() => {
      fetchBuyOfferCount( localStorage.user , "buy", setOfferBuyCount);
      fetchSellOfferCount( localStorage.user , "sell", setOfferSellCount);
      fetchUserData();
      }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Get user info from localStorage
    const username = localStorage.getItem("user");
    const email = localStorage.getItem("email");

    // Calculate expiration date (2 days after departure date)
    const departureDate = new Date(offerData.departureDate);
    const expirationDate = new Date(departureDate);
    expirationDate.setDate(departureDate.getDate() + 2);

    // Add username, email, and expiration date to the offer data
    const offerWithUserData = {
      ...offerData,
      username,
      email,
      expirationDate: expirationDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    };

    // Submit data to the server
    fetch("https://spaceshare-backend.onrender.com/submit-package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offerWithUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        setToastMessage("Offer submitted successfully!");
        setShowModal(false); // Close modal on success
      })
      .catch((error) => {
        setToastMessage("Failed to submit the offer.");
        console.error("Error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
      });
  };

    const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await handleSubmit(formData);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDeleteModal(false)
  };

  const handleDelete = async() => {

    const payload = {
      filter: {
        _id: userData._id  // For MongoDB Data API
      },
      update: {
          accountStatus: false
      }
    };

    try {
      const res = await axios.post(`https://spaceshare-backend.onrender.com/delete-user`, payload);
      setIsSaving(true);
      console.log("Updated the user", res.data);
    } catch (err) {
      console.error("Error updating user: ", err);
      alert("Failed to update");
    } finally {


      setIsSaving(false);
      setShowDeleteModal(false)
    }

  };

  console.log(userData?.email)

  return (
  
    <div className="container mt-4">
      <div className="text-center my-3">
        <div className="d-flex justify-content-center mb-2">
          <img
            src={userData?.avatar || "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true"}
            alt="User Avatar"
            className="rounded-circle"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              border: "2px solid #f8f9fa",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
            onError={(e) => {
              e.target.src = "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true";
            }}
          />
        </div>
        <h2 className="h3 font-weight-bold text-dark mb-0" style={{ fontSize: '2rem' }}>
          Hello, {localStorage.user || "Guest User"}
        </h2>
      </div>

      <div className="row mt-4">
        {/* Stat Cards with Gradient Backgrounds */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm gradient-card-1 text-white">
            <div className="card-body">
              <h2 className="card-title mb-0">{offerBuyCount + offerSellCount}</h2>
              <p className="card-text small">Offers Made</p>
              <button className="btn btn-light btn-sm mt-2" onClick={() => handleNavClick('/myoffers')}>
                <i className="bi bi-card-list me-2"></i> View My Offers
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary me-3"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i> Make New Offer
        </button>

        <button
          className="btn btn-secondary me-3"
          onClick={() => setShowContactModal(true)}
        >
          <i className="bi bi-gear-fill me-2"></i> Change Contact Settings
        </button>

        <button
          className="btn btn-danger me-3 "
          onClick={() => setShowDeleteModal(true)}
        >
          <i className="bi bi-trash-fill me-2"></i> Delete Account
        </button>
      </div>
        

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">New Offer</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>

                  <div>
                    <label for="type">Type of Offer</label>
                    <select id="type" name="type" class="form-control" value={offerData.type} onChange={handleInputChange}>
                      <option value="sell">Sell</option>
                      <option value="buy">Buy</option>
                    </select>
                  </div>

                  <div>
                    <label for="goodsType">Goods type</label>
                    <select id="goodsType" name="goodsType" class="form-control" value={offerData.goodsType} onChange={handleInputChange}>
                      <option value="phones">Phones</option>
                      <option value="laptops">Laptops</option>
                      <option value="other-electronics">Other Electronics</option>
                      <option value="clothes">Clothes</option>
                      <option value="documents">Documents</option>
                      <option value="food">Food</option>
                    </select>
                  </div>

                  <div>
                    <label>Number of units</label>
                    <div class="form-control">
                      <label>
                        <input 
                          type="radio" 
                          id="units" 
                          name="units" 
                          value="kgs" 
                          checked={offerData.units === "kgs"} 
                          onChange={handleInputChange}
                        /> Kgs
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          id="units" 
                          name="units" 
                          value="pcs" 
                          checked={offerData.units === "pcs"} 
                          onChange={handleInputChange}
                        /> Pieces
                      </label>
                    </div>
                  </div>

                  <div>
                    <label>Deal Currency</label>
                    <div class="form-control">
                      <label>
                        <input 
                          type="radio" 
                          id="denomination" 
                          name="denomination" 
                          value="usd" 
                          checked={offerData.denomination === "usd"} 
                          onChange={handleInputChange}
                        /> USD
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          id="denomination" 
                          name="denomination" 
                          value="rmb" 
                          checked={offerData.denomination === "rmb"} 
                          onChange={handleInputChange}
                        /> RMB
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          id="denomination" 
                          name="denomination" 
                          value="other" 
                          checked={offerData.denomination === "other"} 
                          onChange={handleInputChange}
                        /> Other
                      </label>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="space" className="form-label">Space</label>
                      <input
                        type="number"
                        className="form-control"
                        id="space"
                        name="space"
                        value={offerData.space}
                        onChange={handleInputChange}
                        placeholder="Enter available space (e.g. 5)"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={offerData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price (e.g. 200)"
                      />
                    </div>
                  </div>

                  {["departure", "destination", "departureDate"].map(
                    (field) => (
                      <div className="mb-3" key={field}>
                        <label htmlFor={field} className="form-label">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={field === "departureDate" ? "date" : "text"}
                          className="form-control"
                          id={field}
                          name={field}
                          value={offerData[field]}
                          onChange={handleInputChange}
                          placeholder={
                            field === "departure" ? "Enter departure location (e.g., Shenzhen)" :
                            field === "destination" ? "Enter destination (e.g., Harare)" :
                            field === "departureDate" ? "Select departure date" :
                            ""
                          }
                        />
                      </div>
                    )
                  )}
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Save Offer"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showContactModal && (
        <>
        <Modal show={showContactModal} onHide={handleClose} centered backdrop="static">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>Edit Contact Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>WeChat ID</Form.Label>
                <Form.Control
                  type="text"
                  name="weChatId"
                  value={userData.weChatId}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Modal>
        </>
      )}

      {showDeleteModal && (
        <>
        <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">Delete Account</h5>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleCancel}
                  >
                    No
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          style={{ zIndex: 1055 }}
        >
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
