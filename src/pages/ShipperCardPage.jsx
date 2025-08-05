
// export default ShipperCardPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChatbubbleEllipses, IoSearch, IoClose, IoPaperPlane } from "react-icons/io5";
import axios from "axios";

const ShipperCardPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRates, setSelectedRates] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShippers, setFilteredShippers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippers, setShippers] = useState([]);

  const navigate = useNavigate();

  const fetchShippers = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-all-shippers');
      setShippers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shippers:', error);
      setLoading(false);
    }
  };

  const handleViewRates = (rates) => {
    setSelectedRates(rates);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRates("");
  };

  const handleShipperProfile = (companyName) => {
    navigate(`/shipper-profile/${companyName}`);
  };

  const handleChat = (shipper) => {
    setIsSending(true);

    const chatData = {
      recieverName: shipper.companyName,
      userName: localStorage.getItem('user'),
      userId: localStorage.getItem('user'),
      recieverID: shipper.userId,
      lastMessage: "Hello, I am interested in your shipping services",
      lastTimestamp: new Date().toISOString(),
      timeCreated: new Date().toISOString(),
      avatar: shipper.avatar,
      read: false
    };

    fetch("https://spaceshare-backend.onrender.com/create-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create chat");
        }
        return response.json();
      })
      .then((data) => {
        const chatId = data.insertedId;

        const newMessage = {
          chatId: chatId,
          recieverName: shipper.companyName,
          userName: localStorage.getItem('user'),
          userId: localStorage.getItem('user'),
          recieverID: shipper.userId,
          message: "Hello, I am interested in your shipping services",
          timeCreated: new Date().toISOString(),
          read: false,
        };

        return fetch("https://spaceshare-backend.onrender.com/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
        return response.json();
      })
      .then(() => {
        setToastMessage("Chat and message sent successfully!");
        setShowModal(false);
        navigate("/chat");
      })
      .catch((error) => {
        console.error("Error:", error);
        setToastMessage("Failed to create chat or send message.");
      })
      .finally(() => {
        setIsSending(false);
        setTimeout(() => setToastMessage(null), 3000);
      });
  };

  useEffect(() => {
    fetchShippers();
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    setFilteredShippers(shippers);
  }, [shippers]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredShippers(shippers);
      return;
    }
    
    const filtered = shippers.filter(shipper => {
      const searchLower = term.toLowerCase();
      return (
        shipper.completeUserData.companyName.toLowerCase().includes(searchLower) ||
        shipper.completeUserData.hqLocation.toLowerCase().includes(searchLower) ||
        shipper.completeUserData.transportModes.some(mode => 
          mode.toLowerCase().includes(searchLower)
      ))
    });
    
    setFilteredShippers(filtered);
  };  

  const customStyles = `
    .market-container {
      background: linear-gradient(135deg, #F3F3E0 0%, #CBDCEB 100%);
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    .market-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #133E87;
      margin-bottom: 0.5rem;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #608BC1;
      margin-bottom: 2rem;
    }

    .search-container {
      position: relative;
      max-width: 600px;
      margin: 0 auto 3rem;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid #CBDCEB;
      border-radius: 1rem;
      font-size: 1rem;
      background-color: white;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.08);
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #608BC1;
      box-shadow: 0 0 0 0.25rem rgba(96, 139, 193, 0.25);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #608BC1;
    }

    .filters-container {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid #CBDCEB;
      border-radius: 1rem;
      font-size: 1rem;
      background-color: white;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.08);
      transition: all 0.3s ease;
      min-width: 180px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #608BC1;
      box-shadow: 0 0 0 0.25rem rgba(96, 139, 193, 0.25);
    }

    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .offer-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
      overflow: hidden;
      transition: all 0.3s ease;
      border-left: 4px solid #133E87;
    }

    .offer-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(19, 62, 135, 0.25);
    }

    .card-header {
      padding: 1.5rem 1.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .profile-image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #CBDCEB;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .username {
      font-size: 1.1rem;
      font-weight: 600;
      color: #133E87;
      margin: 0;
    }

    .location {
      font-size: 0.85rem;
      color: #608BC1;
    }

    .card-content {
      padding: 0 1.5rem 1rem;
    }

    .detail-item {
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .detail-label {
      font-weight: 600;
      color: #133E87;
    }

    .detail-value {
      color: #608BC1;
    }

    .rating {
      color: #FFC107;
      font-weight: 600;
    }

    .card-footer {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .chat-btn {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.3);
    }

    .chat-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.4);
    }

    .chat-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .profile-btn {
      background: white;
      color: #133E87;
      border: 2px solid #CBDCEB;
    }

    .profile-btn:hover {
      background-color: #F3F3E0;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 20px 40px rgba(19, 62, 135, 0.3);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 1.5rem 1.5rem 1rem;
      border-bottom: 2px solid #F3F3E0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #133E87;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: #608BC1;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background-color: rgba(96, 139, 193, 0.1);
    }

    .modal-body {
      padding: 1.5rem;
      color: #133E87;
    }

    .modal-footer {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      justify-content: flex-end;
    }

    .close-modal-btn {
      padding: 0.75rem 1.5rem;
      background: #F3F3E0;
      color: #133E87;
      border: 2px solid #CBDCEB;
      border-radius: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .close-modal-btn:hover {
      background-color: #CBDCEB;
    }

    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.3);
      z-index: 1100;
    }

    .loading-container {
      text-align: center;
      padding: 2rem;
    }

    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 0.25rem solid rgba(96, 139, 193, 0.3);
      border-radius: 50%;
      border-top-color: #133E87;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .loading-text {
      color: #608BC1;
      font-size: 1.1rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #608BC1;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .market-container {
        padding: 1rem 0.5rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .filters-container {
        flex-direction: column;
        align-items: center;
      }

      .filter-select {
        width: 100%;
        max-width: 300px;
      }

      .offers-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .card-footer {
        justify-content: center;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="market-container">
        <div className="market-content">
          <div className="page-header">
            <h1 className="page-title">Pro Shippers</h1>
            <p className="page-subtitle">Find professional shipping partners for your needs</p>
          </div>

          <div className="search-container">
            <IoSearch className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or city..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="filters-container">
            <select className="filter-select">
              <option>All Modes</option>
              <option>Air</option>
              <option>Sea</option>
              <option>Land</option>
            </select>
            <select className="filter-select">
              <option>All Ratings</option>
              <option>4+ stars</option>
              <option>3+ stars</option>
            </select>
            <select className="filter-select">
              <option>Sort By</option>
              <option>Name</option>
              <option>Rating</option>
              <option>Location</option>
            </select>
          </div>

          <div className="offers-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading shippers...</p>
              </div>
            ) : filteredShippers.length > 0 ? (
              filteredShippers.map((shipper) => (
                <div key={shipper.completeUserData.userID} className="offer-card">
                  <div className="card-header">
                    <div className="profile-section">
                      <img
                        src={shipper.completeUserData.avatar}
                        alt="Shipper Avatar"
                        className="profile-image"
                      />
                      <div className="user-info">
                        <h3 className="username">{shipper.completeUserData.companyName}</h3>
                        <span className="location">{shipper.completeUserData.hqLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-content">
                    <p className="detail-item">
                      <span className="detail-label">Modes: </span>
                      <span className="detail-value">
                        {shipper.completeUserData.transportModes.join(", ")}
                      </span>
                    </p>
                    <p className="detail-item">
                      <span className="detail-label">Phone: </span>
                      <span className="detail-value">
                        {shipper.completeUserData.phoneNumber}
                      </span>
                    </p>
                    <p className="detail-item">
                      <span className="detail-label">Email: </span>
                      <span className="detail-value">
                        {shipper.completeUserData.email}
                      </span>
                    </p>
                    <p className="detail-item">
                      <span className="detail-label">Rating: </span>
                      <span className="rating">
                        {shipper.rating} ★★★★
                      </span>
                    </p>
                  </div>

                  <div className="card-footer">
                    {isLoggedIn && (
                      <button
                        className="action-btn chat-btn"
                        onClick={() => handleChat(shipper.completeUserData)}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <>
                            <div className="spinner" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <IoChatbubbleEllipses size={16} />
                            Chat
                          </>
                        )}
                      </button>
                    )}
                    <button
                      className="action-btn profile-btn"
                      onClick={() => handleShipperProfile(shipper.completeUserData.companyName)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No shippers found matching your criteria.</p>
              </div>
            )}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">Shipping Rates</h2>
                  <button
                    className="close-btn"
                    onClick={handleCloseModal}
                  >
                    <IoClose size={24} />
                  </button>
                </div>
                <div className="modal-body">
                  {selectedRates}
                </div>
                <div className="modal-footer">
                  <button
                    className="close-modal-btn"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {toastMessage && (
            <div className="toast">
              {toastMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShipperCardPage;