import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Package, ShoppingCart, MessageCircle, Calendar, MapPin, User, X, Send, Loader } from 'lucide-react';

const MarketOffers = () => {
  const [view, setView] = useState("buyers"); // "buyers" or "sellers"
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating login status
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [buyPackages, setBuyPackages] = useState([]); // State to store packages
  const [sellPackages, setSellPackages] = useState([]); // State to store packages

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState(null);

  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedOfferUser, setSelectedOfferUser] = useState("");

  const [requestData, setRequestData] = useState({
    message: "",
    reqquestee: localStorage.getItem('user') || '',
    offerId: "",
    userId: "",
    status: "Pending"
  });

  const [chatData, setChatData] = useState({
    recieverName: "",
    userName: "",
    offerDetails: {},
    userId: "",
    recieverID: "",
    lastMessage: "",
    lastTimestamp: "",
    timeCreated: "",
    avatar: 'https://images.unsplash.com/photo-1693071689934-80da90442826?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtaWxpbmclMjBibGFjayUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D',
    read: false
  });

  const [messageData, setMessageData] = useState({
    chatId: "",
    recieverName: "",
    userName: "",
    userId: "",
    recieverID: "",
    message: "",
    timeCreated: "",
    read: false
  });

  const suggestedMessages = [
    "I am interested in your offer, reach me on my WeChat ID....",
    "How can I pay for the shipping fee?",
    "Is this offer still available? I am interested."
  ];

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

//   const usePushNotifications = () => {
//   const registerServiceWorker = async () => {
//     if ('serviceWorker' in navigator && 'PushManager' in window) {
//       try {
//         const registration = await navigator.serviceWorker.register('/sw.js');
//         return registration;
//       } catch (error) {
//         console.error('Service Worker registration failed:', error);
//       }
//     }
//   };

//   const requestNotificationPermission = async () => {
//     if ('Notification' in window) {
//       const permission = await Notification.requestPermission();
//       return permission === 'granted';
//     }
//     return false;
//   };

//   const subscribeToNotifications = async () => {
//     try {
//       const registration = await registerServiceWorker();
//       const hasPermission = await requestNotificationPermission();
      
//       if (!hasPermission || !registration) {
//         return null;
//       }

//       const subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: 'BK7dxcNdI2llF77NsAfx6I8Bve-Xkq0na15Vhi59dtipUwDVskIZsNly2xrsjMNZ7XgyeNN66xOQ9HUqdeaVPM0' // Generate VAPID keys
//       });

//       // Send subscription to your backend
//       await fetch('https://spaceshare-backend.onrender.com/subscribe', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           subscription,
//           userId: localStorage.getItem('user')
//         }),
//       });

//       return subscription;
//     } catch (error) {
//       console.error('Push subscription failed:', error);
//     }
//   };

//   return { subscribeToNotifications };
// };

  const handleSubmit = () => {
    setIsSending(true);

    // Get user info from localStorage
    const userName = localStorage.getItem("user");
    const userId = localStorage.getItem("user");

    console.log(chatData);

    // Step 1: Check if the chat already exists
    fetch("https://spaceshare-backend.onrender.com/check-chat", {
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
          // navigate("/chat");
          return Promise.reject("Chat already exists"); // Prevent further execution
        }

        // Step 2: If chat doesn't exist, create new chat
        return fetch("https://spaceshare-backend.onrender.com/create-chat", {
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
        return fetch("https://spaceshare-backend.onrender.com/send-message", {
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
  // const fetchSellPackages = async () => {
  //   const type = "sell";
  //   try {
  //     const response = await fetch('https://spaceshare-backend.onrender.com/packages?' + new URLSearchParams({ type }));
  //     const data = await response.json();
  //     setSellPackages(data); // Update state with fetched packages
  //   } catch (error) {
  //     console.error('Error fetching packages:', error);
  //   }
  // };

  const fetchSellPackages = async () => {
  const type = "sell";
  try {
    setIsLoading(true);
    const response = await fetch('https://spaceshare-backend.onrender.com/packages?' + new URLSearchParams({ type }));
    const data = await response.json();
    setSellPackages(data);
  } catch (error) {
    console.error('Error fetching packages:', error);
  } finally {
    setIsLoading(false);
  }
};

  // const fetchBuyPackages = async () => {
  //   const type = "buy";
  //   try {
  //     const response = await fetch('https://spaceshare-backend.onrender.com/packages?' + new URLSearchParams({ type }));
  //     const data = await response.json();
  //     setBuyPackages(data); // Update state with fetched packages
  //   } catch (error) {
  //     console.error('Error fetching packages:', error);
  //   }
  // };
  const fetchBuyPackages = async () => {
  const type = "buy";
  try {
    setIsLoading(true);
    const response = await fetch('https://spaceshare-backend.onrender.com/packages?' + new URLSearchParams({ type }));
    const data = await response.json();
    setBuyPackages(data);
  } catch (error) {
    console.error('Error fetching packages:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Filter data by search input
  const filterOffers = (offers) =>
    offers.filter(
      (offer) =>
        offer.departure.toLowerCase().includes(search.toLowerCase()) ||
        offer.destination.toLowerCase().includes(search.toLowerCase())
    );

  const contactClick = (offer) => {
    if (!isLoggedIn) {
      setModalMessage("Only logged-in users can request contact.");
      console.log("not logged in");
    } else {
      setModalMessage("Thank you for your interest! We will notify the seller.");
    }

    setSelectedOffer(offer._id);
    setSelectedOfferUser(offer.username);

    setChatData({
      ...chatData,
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
  };

  const renderOfferCard = (offer, type) => (
    <div className="offer-card-container" key={offer._id + offer.datePosted}>
      <div className={`offer-card ${type === "buyers" ? "buyer-card" : "seller-card"}`}>
        <div className="card-header">
          <div className="profile-section">
            <img
              src={offer.profileImage || "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true"}
              alt={`${offer.username}'s profile`}
              className="profile-image"
            />
            <div className="user-info">
              <h3 className="username">{offer.username}</h3>
              <span className="post-date">{formatReviewDate(offer.datePosted)}</span>
            </div>
          </div>
          <div className="offer-type-badge">
            {type === "buyers" ? <ShoppingCart size={16} /> : <Package size={16} />}
          </div>
        </div>

        <div className="card-content">
          <div className="space-info">
            <div className="space-detail">
              <span className="label">
                {type === "buyers" ? "Space Needed:" : "Space Available:"}
              </span>
              <span className="value">{offer.space} {offer.units}</span>
            </div>
            {type === "sellers" && (
              <div className="price-detail">
                <span className="label">Price:</span>
                <span className="value price">{offer.price} {offer.denomination}/{offer.units}</span>
              </div>
            )}
          </div>

          <div className="offer-details">
            <div className="detail-item">
              <Package size={14} />
              <span>Goods type: </span> <strong><span>{offer.goodsType}</span></strong>
            </div>
            <div className="detail-item">
              <MapPin size={14} />
              <span>Travel Plan: </span> <strong><span>{offer.departure} → {offer.destination}</span> </strong>
            </div>
            <div className="detail-item">
              <Calendar size={14} />
              <span>Depature Date: </span> <strong> <span>{offer.departureDate}</span></strong>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button
            className="contact-btn"
            onClick={() => contactClick(offer)}
            disabled={offer.username === localStorage.getItem('user')}
          >
            <MessageCircle size={16} />
            Contact
          </button>
          <div className="expiry-info">
            <span>Expires: {new Date(offer.expirationDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // const { subscribeToNotifications } = usePushNotifications();

  useEffect(() => {
  
    fetchBuyPackages();
    fetchSellPackages();
    setIsLoggedIn(!!localStorage.getItem("token"));

  //   if (localStorage.getItem('token')) {
  //   subscribeToNotifications();
  // }
  // }, [subscribeToNotifications]);
  }, []);


  const formatReviewDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInHours < 48) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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

    .tab-container {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border: 2px solid #CBDCEB;
      border-radius: 1rem;
      background-color: white;
      color: #133E87;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.08);
    }

    .tab-button:hover {
      border-color: #608BC1;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
    }

    .tab-button.active {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      border-color: #133E87;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.3);
    }

    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .offer-card-container {
      display: flex;
      justify-content: center;
    }

    .offer-card {
      width: 100%;
      max-width: 400px;
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
      overflow: hidden;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .offer-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(19, 62, 135, 0.25);
    }

    .buyer-card {
      border-left: 4px solid #608BC1;
    }

    .seller-card {
      border-left: 4px solid #133E87;
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

    .post-date {
      font-size: 0.85rem;
      color: #608BC1;
    }

    .offer-type-badge {
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: rgba(96, 139, 193, 0.1);
      color: #608BC1;
    }

    .card-content {
      padding: 0 1.5rem 1rem;
    }

    .space-info {
      margin-bottom: 1rem;
    }

    .space-detail, .price-detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .label {
      font-size: 0.9rem;
      color: #608BC1;
      font-weight: 500;
    }

    .value {
      font-weight: 600;
      color: #133E87;
    }

    .price {
      color: #28a745;
      font-size: 1.1rem;
    }

    .offer-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #608BC1;
    }

    .card-footer {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contact-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.3);
    }

    .contact-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.4);
    }

    .contact-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .expiry-info {
      font-size: 0.8rem;
      color: #608BC1;
      font-style: italic;
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
    }

    .modal-message {
      margin-bottom: 1rem;
      color: #133E87;
      font-size: 1rem;
    }

    .message-textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid #CBDCEB;
      border-radius: 0.75rem;
      font-size: 1rem;
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .message-textarea:focus {
      outline: none;
      border-color: #608BC1;
      box-shadow: 0 0 0 0.25rem rgba(96, 139, 193, 0.25);
    }

    .modal-footer {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .modal-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .modal-btn-secondary {
      background-color: #F3F3E0;
      color: #133E87;
      border: 2px solid #CBDCEB;
    }

    .modal-btn-secondary:hover {
      background-color: #CBDCEB;
    }

    .modal-btn-primary {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.3);
    }

    .modal-btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.4);
    }

    .modal-btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
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

      .tab-container {
        flex-direction: column;
        align-items: center;
      }

      .tab-button {
        width: 100%;
        max-width: 300px;
        justify-content: center;
      }

      .offers-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .modal-content {
        margin: 1rem;
      }
    }

    .loading-container {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }

  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #CBDCEB;
    border-radius: 50%;
    border-top-color: #133E87;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }

  .loading-text {
    font-size: 1.1rem;
    color: #608BC1;
    font-weight: 500;
    margin: 0;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="market-container">
        <div className="market-content">
          <div className="page-header">
            <h1 className="page-title">Market Offers</h1>
            <p className="page-subtitle">Discover and connect with space sharing opportunities</p>
          </div>

          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by departure or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="tab-container">
            <button
              className={`tab-button ${view === "buyers" ? "active" : ""}`}
              onClick={() => setView("buyers")}
            >
              <ShoppingCart size={20} />
              Buy Space
            </button>
            <button
              className={`tab-button ${view === "sellers" ? "active" : ""}`}
              onClick={() => setView("sellers")}
            >
              <Package size={20} />
              Sell Space
            </button>
          </div>

          {/* <div className="offers-grid">
            {view === "buyers" &&
              filterOffers(buyPackages).map((offer) => renderOfferCard(offer, "buyers"))}
            {view === "sellers" &&
              filterOffers(sellPackages).map((offer) =>
                renderOfferCard(offer, "sellers")
              )}
          </div> */}
          <div className="offers-grid">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading offers...</p>
              </div>
            ) : (
              <>
                {view === "buyers" &&
                  filterOffers(buyPackages).map((offer) => renderOfferCard(offer, "buyers"))}
                {view === "sellers" &&
                  filterOffers(sellPackages).map((offer) =>
                    renderOfferCard(offer, "sellers")
                  )}
              </>
            )}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">Contact Request</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="modal-body">
                  <p className="modal-message">{modalMessage}</p>

                  {isLoggedIn && (
                    <textarea
                      className="message-textarea"
                      placeholder="Type your message here..."
                      value={chatData.lastMessage}
                      name="lastMessage"
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="modal-btn modal-btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>

                  {isLoggedIn && (
                    <button
                      className="modal-btn modal-btn-primary"
                      onClick={handleSubmit}
                      disabled={isSending || chatData.lastMessage.trim() === ""}
                    >
                      {isSending ? (
                        <>
                          <div className="spinner" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  )}
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


export default MarketOffers;


