import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const MarketOffers = () => {
  const [view, setView] = useState("buyers"); // "buyers" or "sellers"
  const [search, setSearch] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating login status
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [buyPackages, setBuyPackages] = useState([]); // State to store packages
  const [sellPackages, setSellPackages] = useState([]); // State to store packages

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedOfferUser, setSelectedOfferUser] = useState("");

  const [requestData , setRequestData] = useState({
    message: "",
    reqquestee: localStorage.user,
    offerId: "",
    userId: "",
    status:"Pending"
  })

  const [chatData , setChatData] = useState({
    recieverName:"" ,
    userName: "" ,
    offerDetails: {},
    userId: "",
    recieverID: "",
    lastMessage: "",
    lastTimestamp: "",
    timeCreated: "",
    avatar: 'https://images.unsplash.com/photo-1693071689934-80da90442826?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtaWxpbmclMjBibGFjayUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D',
    read: false
  })

  const [messageData , setMessageData] = useState({
    chatId:"",
    recieverName:"" ,
    userName: "" ,
    userId: "",
    recieverID: "",
    message: "",
    timeCreated: "",
    read: false
  })

  const suggestedMessages = [
  "I am interested in your offer, reach me on my WeChat ID....",
  "How can I pay for the shipping fee?",
  "Is this offer still available? I am interested."
  ];

  const navigate = useNavigate();

// Function to handle sending message
const handleSendMessage = () => {
  setIsSending(true);
  // Simulate an API call with a timeout
  setTimeout(() => {
    alert("Message sent successfully!");
    setIsSending(false);
    setShowModal(false);
    setMessage(""); // Clear message after sending
  }, 2000);
};

const handleSubmit = () => {
  setIsSending(true);

  // Get user info from localStorage
  const userName = localStorage.getItem("user");
  const userId = localStorage.getItem("user");

  console.log(chatData)

  // Step 1: Check if the chat already exists
  fetch("http://localhost:3001/check-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName,
      recieverName: chatData.recieverName,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.exists) {
        // Chat already exists — just navigate
        setToastMessage("Chat already exists. Redirecting...");
        navigate("/chat");
        return Promise.reject("Chat already exists"); // Prevent further execution
      }

      // Step 2: If chat doesn't exist, create new chat
      return fetch("http://localhost:3001/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to create chat");
      return response.json();
    })
    .then((data) => {
      const chatId = data.insertedId;

      // Build the message
      const newMessage = {
        chatId: chatId,
        recieverName: chatData.recieverID,
        userName,
        userId,
        recieverID: chatData.recieverName,
        message: chatData.lastMessage,
        timeCreated: new Date().toISOString(),
        read: false,
      };

      // Send message
      return fetch("http://localhost:3001/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
    })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    })
    .then(() => {
      setToastMessage("Chat and message sent successfully!");
      setShowModal(false);
      navigate("/chat");
    })
    .catch((error) => {
      if (error !== "Chat already exists") {
        console.error("Error:", error);
        setToastMessage("Failed to create chat or send message.");
      }
    })
    .finally(() => {
      setIsSending(false);
      setTimeout(() => setToastMessage(null), 3000);
    });
};


const handleInputChange = (e) => {
  const { name, value } = e.target;
  setChatData(prev => ({
    ...prev,
    [name]: value,
  }));
};

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


  // Filter data by search input
  const filterOffers = (offers) =>
    offers.filter(
      (offer) =>
        offer.departure.toLowerCase().includes(search.toLowerCase()) ||
        offer.destination.toLowerCase().includes(search.toLowerCase())
    );

  // console.log(buyPackages)

  const contactClick = (offer) => {
    if (!isLoggedIn) {
      setModalMessage("Only logged-in users can request contact.");
      console.log("not logged in")
    } else {
      setModalMessage("Thank you for your interest! We will notify the seller.");

    }

    setSelectedOffer(offer._id);
    setSelectedOfferUser(offer.username);

    setChatData({
      ...chatData,
      // lastMessage: message,
      userId: localStorage.getItem("user"),
      userName: localStorage.getItem("user"),
      offerId: offer._id,
      recieverName: offer.username,
      offerDetails: offer,
      lastTimestamp: new Date().toISOString(),
      timeCreated: new Date().toISOString(),
      read: false,
    });


    setShowModal(true);

    // console.log(selectedOffer)
  };

  const renderOfferCard = (offer, type) => (
    <div className="col-md-3 col-sm-6" key={offer._id + offer.datePosted}>
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
                <strong>Space Needed:</strong> {offer.space} {offer.units} <br />
              </>
            ) : (
              <>
                <strong>Space Available:</strong> {offer.space} {offer.units} <br />
                <strong>Price:</strong> {offer.price} {offer.denomination}/{offer.units} <br />
              </>
            )}
            <strong>Goods Type:</strong> {offer.goodsType} <br />
            <strong>Departure:</strong> {offer.departure} <br />
            <strong>Destination:</strong> {offer.destination} <br />
            <strong>Posted:</strong> {formatReviewDate(offer.datePosted)} <br />
            {/* <strong>Price:</strong> {offer.price} {offer.denomination} <br /> */}
            <strong>Departure Date:</strong> {offer.departureDate} <br />
          </p>
          {/* Contact button */}
          <button
            className="btn btn-success d-block mx-auto mb-2"
            onClick={() => contactClick(offer)}
            disabled={offer.username === localStorage.getItem('user')}
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

    useEffect(() => {
    fetchBuyPackages();
    fetchSellPackages();
    setIsLoggedIn(!!localStorage.getItem("token"));
    // console.log(localStorage.getItem("token"))
  }, []);
  

  const formatReviewDate= (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `Today ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  } else if (diffInHours < 48) {
    return `Yesterday ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  } else {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Current Market Offers</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by departure or destination"
          value={search}
          id="home-search"
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
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
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

                  {isLoggedIn && (
                    <textarea
                      className="form-control mb-3"
                      placeholder="Type your message here..."
                      rows="3"
                      value={chatData.lastMessage}
                      name="lastMessage"
                      onChange={handleInputChange}
                    ></textarea>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>

                  {isLoggedIn && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={isSending || chatData.lastMessage.trim() === ""}
                    >
                      {isSending ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


    </div>

    
  );
};

export default MarketOffers;