
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import {IoChatbubbleEllipses, IoClose, IoStar, IoStarOutline, IoSearch, IoPaperPlane } from 'react-icons/io5';

const ShipperProfile = () => {

    const [key, setKey] = useState('introduction');
  const [reviews, setReviews] = useState([]);
  const [loading , setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  const [toastMessage, setToastMessage] = useState(null);
  
  

  const [announcements, setAnnouncements] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [companyReviewId, setCompanyReviewId] = useState("")

  const [companyNameState , setCompanyName] = useState('');

  const { companyName } = useParams();
  const [shipper, setShipper] = useState([]);
  const [leadTimes, setLeadTimes] = useState([]);
  

  const [rates, setRates] = useState({
      general: { sea: { RMB: 15, USD: 1.5 }, air: { RMB: 20, USD: 2.5 }, express: { RMB: 30, USD: 4 } },
      phones: { sea: { RMB: 15, USD: 2 }, air: { RMB: 25, USD: 3 }, express: { RMB: 40, USD: 5 } },
      laptops: { sea: { RMB: 20, USD: 3 }, air: { RMB: 35, USD: 4.5 }, express: { RMB: 50, USD: 6 } },
      electronics: { sea: { RMB: 18, USD: 2.2 }, air: { RMB: 28, USD: 3.2 }, express: { RMB: 45, USD: 5.2 } },
    });


  const [shipperRates , setShipperRates] = useState([]);
  const [companyReviews, setCompanyReviews] = useState([])

  const navigate = useNavigate();

  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(5); // Default to 5
  const [newReview, setNewReview] = useState('');

  const [deliveryCities, setDeliveryCities] = useState([]);

  

  // const handleReviewSubmit = (e) => {
  //   e.preventDefault();
  //   if (newReview.trim()) {
  //     setReviews([...reviews, newReview]);
  //     setNewReview('');
  //   }
  // };

    const handleChat = () => {
    setIsSending(true);

    console.log(shipper)

    const chatData = {
      recieverName: shipper[0].completeUserData.companyName,
      userName: localStorage.getItem('user'),
      userId: localStorage.getItem('user'),
      recieverID: shipper[0].completeUserData.userId,
      lastMessage: "Hello, I am interested in your shipping services",
      lastTimestamp: new Date().toISOString(),
      timeCreated: new Date().toISOString(),
      avatar: shipper[0].completeUserData.avatar,
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
          recieverName: shipper[0].completeUserData.companyName,
          userName: localStorage.getItem('user'),
          userId: localStorage.getItem('user'),
          recieverID: shipper[0].completeUserData.userId,
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

const handleReviewSubmit = async (e) => {
  e.preventDefault();

  const user = localStorage.getItem("user");
  // const author = user ? JSON.parse(user) : "Anonymous"; // Adjust if user is just a string
  const author = user // Adjust if user is just a string


  const reviewData = {
    title: reviewTitle,
    rating: reviewRating,
    content: newReview,
    author: author,
    companyID: shipper[0].completeUserData.userID,
    postedAt: new Date().toISOString(),
  };

  try {
    const response = await axios.post("https://spaceshare-backend.onrender.com/set-reviews", reviewData);
    console.log("Review submitted:", response.data);

    // Optional: clear form
    setReviewTitle("");
    setReviewRating(5);
    setNewReview("");

    // Optional: toast success
  } catch (error) {
    console.error("Failed to submit review:", error);
    // Optional: toast failure
  }
};

  const fetchReviews = async (companyId) => {
    try {

      const response = await axios.post('https://spaceshare-backend.onrender.com/get-reviews', { companyId });
      const data = response.data;

      if (data) setCompanyReviews(data);
      else console.warn("No reviews found.");
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

    const fetchShipper = async () => {
        try {
        setLoading(true);
    
        // 1. Fetch the main shipper document
        const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipper', {
            companyName,
        });
    
        const shipperData = response.data;
        setShipper(shipperData);

        if(shipperData[0].deliveryCities.length > 0){
          setDeliveryCities(shipperData[0].deliveryCities)
        }
        else{
          setDeliveryCities([])
        }

        // 2. Extract and store companyId
        const companyId = shipperData[0].completeUserData.userID;

        setCompanyReviewId(companyReviewId)
    
        // 3. Fetch shipping rates
        const ratesResponse = await axios.post('https://spaceshare-backend.onrender.com/get-rates', { companyId});
        setShipperRates(ratesResponse.data);

        console.log(ratesResponse.data[0])

    
        // 4. Fetch lead times
        const leadTimesResponse = await axios.post('https://spaceshare-backend.onrender.com/get-leadTimes', { companyId});
        setLeadTimes(leadTimesResponse.data);

        const companyReviewResponse = await axios.post('https://spaceshare-backend.onrender.com/get-reviews', { companyId });

        setCompanyReviews(companyReviewResponse.data)

        const announcementsResponse = await axios.post('https://spaceshare-backend.onrender.com/get-announcements', { companyId });
        setAnnouncements(announcementsResponse.data);
        
        } catch (error) {
        console.error("Error loading shipper profile:", error);
        } finally {
        setLoading(false);
        }
    };

    const token = localStorage.getItem('token');
  
  

  useEffect(() => {

    fetchShipper();

    fetchReviews(localStorage.companyId);

    setIsLoggedIn(!!localStorage.getItem("token"));


  }, [companyReviewId]);

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


  const customStyles = `
    .shipper-container {
      background: linear-gradient(135deg, #F3F3E0 0%, #CBDCEB 100%);
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    .shipper-content {
      max-width: 1200px;
      margin: 0 auto;
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
      margin: 3px;
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

    .breadcrumb-container {
      background: white;
      border-radius: 1rem;
      padding: 1rem;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.08);
      margin-bottom: 2rem;
    }

    .breadcrumb-badge {
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      font-weight: 500;
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

    .info-text {
      color: #133E87;
      margin-bottom: 0.5rem;
    }

    .tabs-container {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.08);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .nav-tabs {
      border-bottom: 2px solid #F3F3E0;
      padding: 0 1.5rem;
      flex: 0 0 auto;
    }

    .nav-tabs {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      flex-wrap: wrap;
      border-bottom: 2px solid #F3F3E0;
      padding: 0 1.5rem;
    }

    .nav-link {
      color: #608BC1;
      font-weight: 500;
      border: none;
      padding: 1rem 1.5rem;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      color: #133E87;
      background-color: rgba(96, 139, 193, 0.1);
    }

    .nav-link.active {
      color: #133E87;
      font-weight: 600;
      border-bottom: 3px solid #133E87;
      background: transparent;
    }

    .tab-content {
      padding: 2rem;
    }

    .profile-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
      padding: 2rem;
      text-align: center;
      border: none;
    }

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #CBDCEB;
      margin: 0 auto 1.5rem;
    }

    .profile-intro {
      color: #608BC1;
      line-height: 1.6;
    }

    .rates-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
      border: none;
      margin-bottom: 2rem;
    }

    .card-header {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 1.5rem 1.5rem 0 0 !important;
      border: none;
    }

    .rates-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .rates-table th {
      background-color: #F3F3E0;
      color: #133E87;
      padding: 1rem;
      text-align: left;
    }

    .rates-table td {
      padding: 1rem;
      border-bottom: 1px solid #F3F3E0;
      color: #608BC1;
    }

    .rates-table tr:last-child td {
      border-bottom: none;
    }

    .empty-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
      padding: 2rem;
      text-align: center;
      color: #608BC1;
      border: none;
    }

    .announcement-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: none;
    }

    .announcement-title {
      color: #133E87;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .announcement-date {
      color: #608BC1;
      font-size: 0.9rem;
    }

    .announcement-content {
      color: #608BC1;
      margin-top: 1rem;
    }

    .review-btn {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.3);
      transition: all 0.3s ease;
      margin-bottom: 1.5rem;
    }

    .review-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.4);
    }

    .review-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: none;
    }

    .review-author-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #CBDCEB;
      margin-right: 1rem;
    }

    .review-title {
      color: #133E87;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .review-content {
      color: #608BC1;
      margin: 0.5rem 0;
    }

    .review-author {
      color: #133E87;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .review-date {
      color: #608BC1;
      font-size: 0.8rem;
    }

    .star-filled {
      color: #FFC107;
    }

    .star-empty {
      color: #E4E5E9;
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
      border: none;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 2px solid #F3F3E0;
    }

    .modal-title {
      color: #133E87;
      font-weight: 600;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: #608BC1;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background-color: rgba(96, 139, 193, 0.1);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-label {
      color: #133E87;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .form-control {
      border: 2px solid #CBDCEB;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      border-color: #608BC1;
      box-shadow: 0 0 0 0.25rem rgba(96, 139, 193, 0.25);
    }

    .form-range {
      width: 100%;
      height: 1.5rem;
      padding: 0;
      background-color: transparent;
    }

    .form-range::-webkit-slider-thumb {
      background: #133E87;
    }

    .form-range::-moz-range-thumb {
      background: #133E87;
    }

    .form-range::-ms-thumb {
      background: #133E87;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 2px solid #F3F3E0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .cancel-btn {
      background: #F3F3E0;
      color: #133E87;
      border: 2px solid #CBDCEB;
      border-radius: 0.75rem;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: #CBDCEB;
    }

    .submit-btn {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.3);
      transition: all 0.3s ease;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.4);
    }

    .delivery-badge {
      background: rgba(96, 139, 193, 0.1);
      color: #133E87;
      border-radius: 0.75rem;
      padding: 0.5rem 1rem;
      margin: 0.25rem;
      display: inline-block;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .shipper-container {
        padding: 1rem 0.5rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .tab-content {
        padding: 1rem;
      }

      .profile-card, .rates-card, .announcement-card, .review-card {
        padding: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="shipper-container">
        <div className="shipper-content">
          {shipper.length > 0 && (
            <>
              <div className="breadcrumb-container">
                <div className="d-flex align-items-center">
                  <Link to="/shippers" className="breadcrumb-badge" style={{ background: '#133E87', color: 'white' }}>
                    All shippers
                  </Link>
                  <span className="mx-2" style={{ color: '#608BC1' }}>/</span>
                  <span className="breadcrumb-badge" style={{ background: '#CBDCEB', color: '#133E87' }}>
                    {companyName}
                  </span>
                </div>
              </div>

              <h1 className="page-title">{companyName}</h1>
              <p className="info-text"><strong>Location:</strong> {shipper[0].completeUserData.hqCity}, {shipper[0].completeUserData.hqCountry}</p>
              <p className="info-text"><strong>Contact:</strong> {shipper[0].completeUserData.email} | {shipper[0].completeUserData.phoneNumber}</p>

              <p className="info-text"><strong>Cities we deliver to: </strong></p>
                      

              <div>
                  {isLoggedIn && (
                    <button
                        className="action-btn chat-btn"
                        onClick={() => handleChat()}
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
              </div>

              <div className="tabs-container">
                <div className="nav-tabs">
                  <button
                    className={`nav-link ${key === 'introduction' ? 'active' : ''}`}
                    onClick={() => setKey('introduction')}
                  >
                    Introduction
                  </button>
                  <button
                    className={`nav-link ${key === 'rates' ? 'active' : ''}`}
                    onClick={() => setKey('rates')}
                  >
                    Rates
                  </button>
                  <button
                    className={`nav-link ${key === 'leadTimes' ? 'active' : ''}`}
                    onClick={() => setKey('leadTimes')}
                  >
                    Lead Times
                  </button>
                  <button
                    className={`nav-link ${key === 'announcements' ? 'active' : ''}`}
                    onClick={() => setKey('announcements')}
                  >
                    Announcements
                  </button>
                  <button
                    className={`nav-link ${key === 'reviews' ? 'active' : ''}`}
                    onClick={() => setKey('reviews')}
                  >
                    Reviews
                  </button>
                </div>

                <div className="tab-content">
                  {key === 'introduction' && (
                    <div className="profile-card">
                      <img
                        src={shipper[0].completeUserData.avatar}
                        alt="Company Logo"
                        className="profile-image"
                      />
                      <p className="profile-intro">
                        {shipper[0].introduction}
                      </p>
                    </div>
                  )}

                  {key === 'rates' && (
                    <>
                      <h5 className="info-text">Sea Freight Rates</h5>
                      {shipperRates.length > 0 ? (
                        <div className="rates-card">
                          <div className="card-header">
                            <strong>Shipping Rates</strong>
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <table className="rates-table">
                              <thead>
                                <tr>
                                  <th>Item</th>
                                  <th>Sea (RMB/$USD)</th>
                                  <th>Air (RMB/USD)</th>
                                  <th>Air Express (RMB/USD)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>General Goods (/kg)</td>
                                  <td>
                                    {shipperRates[0]?.rates?.general?.sea?.RMB || 'N/A'} / {shipperRates[0]?.rates?.general?.sea?.USD || 'N/A'}
                                  </td>
                                  <td>
                                    {shipperRates[0]?.rates?.general?.air?.RMB || 'N/A'} / {shipperRates[0]?.rates?.general?.air?.USD || 'N/A'}
                                  </td>
                                  <td>
                                    {shipperRates[0]?.rates?.general?.express?.RMB || 'N/A'} / {shipperRates[0]?.rates?.general?.express?.USD || 'N/A'}
                                  </td>
                                </tr>
                                {/* Other rate rows remain the same */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="empty-card">
                          This shipper hasn't set their rates yet.
                        </div>
                      )}
                    </>
                  )}

                  {key === 'leadTimes' && (
                    <>
                      {leadTimes.length > 0 ? (
                        <div className="rates-card">
                          <div className="card-header">
                            <strong>Lead Times</strong>
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                              <div>
                                <strong>Sea:</strong> 
                                {leadTimes[0].leadTimes.sea.value} {leadTimes[0].leadTimes.sea.unit}
                              </div>
                              <div>
                                <strong>Air:</strong> 
                                {typeof leadTimes[0].leadTimes.air === 'object' 
                                  ? `${leadTimes[0].leadTimes.air.value} ${leadTimes[0].leadTimes.air.unit}`
                                  : leadTimes[0].leadTimes.air}
                              </div>
                              <div>
                                <strong>Air Express:</strong> 
                                {typeof leadTimes[0].leadTimes.express === 'object' 
                                  ? `${leadTimes[0].leadTimes.express.value} ${leadTimes[0].leadTimes.express.unit || ''}`
                                  : leadTimes[0].leadTimes.express}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="empty-card">
                          No lead times set yet. Waiting for the shipper to set.
                        </div>
                      )}
                    </>
                  )}

                  {key === 'announcements' && (
                    <>
                      {announcements.length > 0 ? (
                        announcements.map((announcement, index) => (
                          <div key={index} className="announcement-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3 className="announcement-title">{announcement.title}</h3>
                              <small className="announcement-date">
                                {new Date(announcement.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </small>
                            </div>
                            <p className="announcement-content">{announcement.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="empty-card">
                          This shipper has not published any announcements
                        </div>
                      )}
                    </>
                  )}

                  {key === 'reviews' && (
                    <>
                      {token && (
                        <button 
                          className="review-btn"
                          onClick={handleShow} 
                          disabled={!!localStorage.getItem('companyName')}
                        >
                          Leave a Review
                        </button>
                      )}

                      <h5 className="info-text">All Reviews</h5>
                      {companyReviews.length === 0 ? (
                        <div className="empty-card">No reviews yet.</div>
                      ) : (
                        companyReviews.map((review, index) => (
                          <div key={index} className="review-card">
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <div 
                                className="review-author-img"
                                style={{
                                  backgroundImage: `url(${review.authorImage || 'data:image/png;base64,...'})`,
                                  backgroundSize: 'cover'
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h4 className="review-title">{review.title}</h4>
                                  <div>
                                    {[...Array(5)].map((_, i) => (
                                      i < review.rating ? 
                                        <IoStar key={i} className="star-filled" /> : 
                                        <IoStarOutline key={i} className="star-empty" />
                                    ))}
                                  </div>
                                </div>
                                <p className="review-content">{review.content}</p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span className="review-author">{review.author}</span>
                                  <span style={{ margin: '0 0.5rem' }}>•</span>
                                  <span className="review-date">
                                    {formatReviewDate(review.postedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>

              {showModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2 className="modal-title">Write a Review</h2>
                      <button className="close-btn" onClick={handleClose}>
                        <IoClose size={24} />
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleReviewSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label className="form-label">Review Title</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter a title for your review"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            required
                          />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label className="form-label">Rating</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span>{reviewRating}</span>
                            <input
                              type="range"
                              className="form-range"
                              min="1"
                              max="5"
                              value={reviewRating}
                              onChange={(e) => setReviewRating(parseInt(e.target.value))}
                            />
                            <div>
                              {[...Array(5)].map((_, i) => (
                                i < reviewRating ? 
                                  <IoStar key={i} className="star-filled" /> : 
                                  <IoStarOutline key={i} className="star-empty" />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label className="form-label">Your Review</label>
                          <textarea
                            className="form-control"
                            rows={4}
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            required
                          />
                        </div>

                        <div className="modal-footer">
                          <button type="button" className="cancel-btn" onClick={handleClose}>
                            Cancel
                          </button>
                          <button type="submit" className="submit-btn">
                            Submit Review
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};


export default ShipperProfile;



