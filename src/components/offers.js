import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import axios from "axios"

const MarketOffers = () => {
  const [view, setView] = useState("buyers"); // "buyers" or "sellers"
  const [search, setSearch] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating login status
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [buyPackages, setBuyPackages] = useState([]); // State to store packages
  const [sellPackages, setSellPackages] = useState([]); // State to store packages


  // Function to fetch packages from the server
  const fetchSellPackages = async () => {
    const type  = "sell"
    try {
      const response = await axios.get('http://localhost:3001/packages', {
        params: { type }, // Pass the type as a query parameter
      });
      setSellPackages(response.data); // Update state with fetched packages
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchBuyPackages = async () => {
    const type = "buy"
    try {
      const response = await axios.get('http://localhost:3001/packages', {
        params: { type }, // Pass the type as a query parameter
      });
      setBuyPackages(response.data); // Update state with fetched packages
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  // Fetch packages when the component mounts or when the type changes
  useEffect(() => {
    fetchBuyPackages();
    fetchSellPackages();
  }, []);

  // Filter data by search input
  const filterOffers = (offers) =>
    offers.filter(
      (offer) =>
        offer.departure.toLowerCase().includes(search.toLowerCase()) ||
        offer.destination.toLowerCase().includes(search.toLowerCase())
    );

  console.log(buyPackages)

  const contactClick = () => {
    if (!isLoggedIn) {
      setModalMessage("Only logged-in users can request contact.");
    } else {
      setModalMessage("Thank you for your interest! We will notify the seller.");
    }
    setShowModal(true);
  };

  const renderOfferCard = (offer, type) => (
    <div className="col-md-3" key={offer.username + offer.datePosted}>
      <div
        className="card shadow-sm mb-3"
        style={{
          borderRadius: "8px",
          backgroundColor: type === "buyers" ? "#e8f4fc" : "#fde8e8",
          padding: "10px",
        }}
      >
        <div className="card-body text-center">
          {/* Circular image */}
          <div className="mb-3">
            <img
              src={offer.profileImage || "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true"} // Replace with actual profile image URL
              alt={`${offer.username}'s profile`}
              className="rounded-circle"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          </div>
          {/* Offer details */}
          <h6 className="card-title mb-2">{offer.username}</h6>
          <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
            {type === "buyers" ? (
              <>
                <strong>Space Needed:</strong> {offer.space} <br />
              </>
            ) : (
              <>
                <strong>Space Available:</strong> {offer.space} <br />
                <strong>Price:</strong> ${offer.price} <br />
              </>
            )}
            <strong>Goods Type:</strong> {offer.goodsType} <br />
            <strong>Departure:</strong> {offer.departure} <br />
            <strong>Destination:</strong> {offer.destination} <br />
            <strong>Posted:</strong> {offer.datePosted} <br />
            <strong>Price:</strong> {offer.price} {offer.denomination} <br />
            <strong>Departure Date:</strong> {offer.departureDate} <br />
          </p>
          {/* Contact button */}
          <button
            className="btn btn-success d-block mx-auto mb-2"
            onClick={contactClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="bi bi-envelope me-2"></i> Contact
          </button>
          {/* Expiration text */}
          <p className="text-muted fst-italic" style={{ fontSize: "0.8rem" }}>
            Expires on {new Date(offer.expirationDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
  


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Current Market Offers</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by departure or destination"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs for Buyers and Sellers */}

      <ul className="nav nav-tabs justify-content-center" style={{ borderBottom: "2px solid #ddd" }}>
        <li className="nav-item">
          <button
            className={`nav-link ${view === "buyers" ? "active" : ""}`}
            onClick={() => setView("buyers")}
            style={{
              borderRadius: "8px 8px 0 0",
              backgroundColor: view === "buyers" ? "#0d6efd" : "#f8f9fa",
              color: view === "buyers" ? "#fff" : "#000",
              border: view === "buyers" ? "2px solid #0d6efd" : "2px solid #ddd",
              margin: "0 5px",
              padding: "5px 10px",
              transition: "background-color 0.3s, color 0.3s",
              fontWeight: view === "buyers" ? "bold" : "normal",
            }}
          >
            <i className="bi bi-basket2 me-2"></i> Buy Space
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${view === "sellers" ? "active" : ""}`}
            onClick={() => setView("sellers")}
            style={{
              borderRadius: "8px 8px 0 0",
              backgroundColor: view === "sellers" ? "#0d6efd" : "#f8f9fa",
              color: view === "sellers" ? "#fff" : "#000",
              border: view === "sellers" ? "2px solid #0d6efd" : "2px solid #ddd",
              margin: "0 5px",
              padding: "5px 10px",
              transition: "background-color 0.3s, color 0.3s",
              fontWeight: view === "sellers" ? "bold" : "normal",
            }}
          >
            <i className="bi bi-box-arrow-in-down me-2"></i> Sell Space
          </button>
        </li>
      </ul>

      <div className="row mt-4">
        {view === "buyers" &&
          filterOffers(buyPackages).map((offer) => renderOfferCard(offer, "buyers"))}
        {view === "sellers" &&
          filterOffers(sellPackages).map((offer) =>
            renderOfferCard(offer, "sellers")
          )}
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

    
  );
};

export default MarketOffers;