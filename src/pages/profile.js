// import React, { useState, useEffect } from "react";
// import { Card, Container, Row, Col, Button, Modal, Form, Table, Alert} from 'react-bootstrap';
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../App.css";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import axios from 'axios'


// const ProfilePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [offerBuyCount , setOfferBuyCount] = useState(0)
//   const [offerSellCount , setOfferSellCount] = useState(0)
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showShippingAddressModal, setShippingAddressModal] = useState(false);
//   const [shippingAddress , setShippingAddress] = useState('')
//   const [offerData, setOfferData] = useState({
//     type: "buy",
//     space: "",
//     goodsType: "",
//     units: "",
//     denomination: "",
//     departure: "",
//     destination: "",
//     departureDate: "",
//     price: "",
//     username: localStorage.user
//   });

//   const [userData , setUserData] = useState()

//   const [formData, setFormData] = useState({
//     email: userData?.email || '',
//     phoneNumber: userData?.phoneNumber || '',
//     weChatId: userData?.weChatId || ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleClose = () =>{
//     setShowContactModal(false)
//   }

//   const navigate = useNavigate();

//   const fetchUserData = async () => {
//     try {
//       setLoading(false)
//       const username = localStorage.user

//       const response = await axios.post('https://spaceshare-backend.onrender.com/get-user', { username });
//       const userData = response.data[0];
  
//       setUserData(userData);
//       setLoading(false)
//     } catch (error) {
//       console.error('Error fetching user information:', error);
//       throw error; // so it can be caught in fetchAll
//     } finally {
//     }
//   };

//    const fetchBuyOfferCount = async (username, type, setOfferBuyCount) => {
//       try {
//         const response = await axios.get("https://spaceshare-backend.onrender.com/packages/by-user", {
//           params: { username, type },
//         });
//         setOfferBuyCount(response.data.length);
//       } catch (error) {
//         console.error("Error fetching packages by user:", error);
//       }
//     };

//     const fetchSellOfferCount = async (username, type, setOfferSellCount) => {
//       try {
//         const response = await axios.get("https://spaceshare-backend.onrender.com/packages/by-user", {
//           params: { username, type },
//         });
//         setOfferSellCount(response.data.length);
//       } catch (error) {
//         console.error("Error fetching packages by user:", error);
//       }
//     };

//     useEffect(() => {
//       fetchBuyOfferCount( localStorage.user , "buy", setOfferBuyCount);
//       fetchSellOfferCount( localStorage.user , "sell", setOfferSellCount);
//       fetchUserData();
//       }, []);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setOfferData({ ...offerData, [name]: value });
//   };

//   const handleNavClick = (path) => {
//     navigate(path);
//   };

//   const handleSubmit = () => {
//     setIsSubmitting(true);

//     // Get user info from localStorage
//     const username = localStorage.getItem("user");
//     const email = localStorage.getItem("email");

//     // Calculate expiration date (2 days after departure date)
//     const departureDate = new Date(offerData.departureDate);
//     const expirationDate = new Date(departureDate);
//     expirationDate.setDate(departureDate.getDate() + 2);

//     // Add username, email, and expiration date to the offer data
//     const offerWithUserData = {
//       ...offerData,
//       username,
//       email,
//       expirationDate: expirationDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
//     };

//     // Submit data to the server
//     fetch("https://spaceshare-backend.onrender.com/submit-package", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(offerWithUserData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setToastMessage("Offer submitted successfully!");
//         setShowModal(false); // Close modal on success
//       })
//       .catch((error) => {
//         setToastMessage("Failed to submit the offer.");
//         console.error("Error:", error);
//       })
//       .finally(() => {
//         setIsSubmitting(false);
//         setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
//       });
//   };

//     const onSubmit = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       await handleSubmit(formData);
//       handleClose();
//     } catch (err) {
//       setError(err.message || 'Failed to update contact information');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setShowDeleteModal(false)
//   };

//   const handleDelete = async() => {

//     const payload = {
//       filter: {
//         _id: userData._id  // For MongoDB Data API
//       },
//       update: {
//           accountStatus: false
//       }
//     };

//     try {
//       const res = await axios.post(`https://spaceshare-backend.onrender.com/delete-user`, payload);
//       setIsSaving(true);
//       console.log("Updated the user", res.data);
//     } catch (err) {
//       console.error("Error updating user: ", err);
//       alert("Failed to update");
//     } finally {


//       setIsSaving(false);
//       setShowDeleteModal(false)
//     }

//   };

//   const handleSaveShippingAddress = async () => {
//     setIsSaving(true);
    
//     try {
  
//       const payload = {
//         filter: {
//           _id: userData._id  // For MongoDB Data API
//         },
//         update: {
//             shippingAddress: shippingAddress
//         }
//       };
  
//       const res = await axios.post('https://spaceshare-backend.onrender.com/update-user', payload);
//       console.log("Shipping address updated:", res.data);

//       setUserData(prev => ({
//             ...prev,
//             shippingAddress: shippingAddress
//         }));
      
//       setShippingAddressModal(false);
//     } catch (err) {
//       console.error("Error updating shipping address:", err);
//       alert("Failed to update shipping address. Please try again.");
//     } finally {
//       setIsSaving(false);
//       setShippingAddressModal(false)
//     }
//   };

//   return (
  
//     <div className="container mt-4">
//       <div className="text-center my-3">
//         <div className="d-flex justify-content-center mb-2">
//           <img
//             src={userData?.avatar || "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true"}
//             alt="User Avatar"
//             className="rounded-circle"
//             style={{
//               width: "200px",
//               height: "200px",
//               objectFit: "cover",
//               border: "2px solid #f8f9fa",
//               boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
//             }}
//             onError={(e) => {
//               e.target.src = "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true";
//             }}
//           />
//         </div>
//         <h2 className="h3 font-weight-bold text-dark mb-0" style={{ fontSize: '2rem' }}>
//           Hello, {localStorage.user || "Guest User"}
//         </h2>
//       </div>

//       <div className="row mt-4 justify-content-center">  {/* Added justify-content-center */}
//         {/* Stat Cards with Gradient Backgrounds */}
//         <div className="col-md-4 mb-3 d-flex justify-content-center">  {/* Added d-flex justify-content-center */}
//           <div className="card shadow-sm gradient-card-1 text-white text-center">  {/* Added text-center */}
//             <div className="card-body">
//               <h2 className="card-title mb-0">{offerBuyCount + offerSellCount}</h2>
//               <p className="card-text small">Offers Made</p>
//               <div className="d-flex justify-content-center">  {/* Center the button */}
//                 <button className="btn btn-light btn-sm mt-2" onClick={() => handleNavClick('/myoffers')}>
//                   <i className="bi bi-card-list me-2"></i> View My Offers
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     {!loading && userData?.shippingAddress ? (
//        <>    
//         <Card className="mb-4 shadow-sm">
//             <Card.Header className="d-flex justify-content-between align-items-center">
//                 <strong>My Shipping address</strong>
//                 <Button size="sm" onClick={() => setShippingAddressModal(true)}>Edit Shipping Address</Button>
//             </Card.Header>
//             <Card.Body>
//                 <Row className="mt-2">
//                   <Col>{userData.shippingAddress}</Col>
//                 </Row>
//             </Card.Body>
//          </Card>
//        </>
//         ) : (
//             <Alert variant="warning" className="d-flex justify-content-between align-items-center">
//               <span>No shipping address set yet.</span>
//               <Button size="sm" variant="primary" onClick={() => setShippingAddressModal(true)}>
//                 Set Shipping Address
//               </Button>
//             </Alert>
//           )}

//       <div className="text-center mt-4">
//         <button
//           className="btn btn-primary me-3"
//           onClick={() => setShowModal(true)}
//         >
//           <i className="bi bi-plus-circle me-2"></i> Make New Offer
//         </button>

//         <button
//           className="btn btn-secondary me-3"
//           onClick={() => setShowContactModal(true)}
//         >
//           <i className="bi bi-gear-fill me-2"></i> Change Contact Settings
//         </button>

//         <button
//           className="btn btn-danger me-3 "
//           onClick={() => setShowDeleteModal(true)}
//         >
//           <i className="bi bi-trash-fill me-2"></i> Delete Account
//         </button>
//       </div>
        

//       {/* Modal */}
//       {showModal && (
//         <>
//           <div className="modal-backdrop fade show"></div>
//           <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">New Offer</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <form>

//                   <div>
//                     <label for="type">Type of Offer</label>
//                     <select id="type" name="type" class="form-control" value={offerData.type} onChange={handleInputChange}>
//                       <option value="sell">Sell</option>
//                       <option value="buy">Buy</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label for="goodsType">Goods type</label>
//                     <select id="goodsType" name="goodsType" class="form-control" value={offerData.goodsType} onChange={handleInputChange}>
//                       <option value="phones">Phones</option>
//                       <option value="laptops">Laptops</option>
//                       <option value="other-electronics">Other Electronics</option>
//                       <option value="clothes">Clothes</option>
//                       <option value="documents">Documents</option>
//                       <option value="food">Food</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label>Number of units</label>
//                     <div class="form-control">
//                       <label>
//                         <input 
//                           type="radio" 
//                           id="units" 
//                           name="units" 
//                           value="kgs" 
//                           checked={offerData.units === "kgs"} 
//                           onChange={handleInputChange}
//                         /> Kgs
//                       </label>
//                       <label>
//                         <input 
//                           type="radio" 
//                           id="units" 
//                           name="units" 
//                           value="pcs" 
//                           checked={offerData.units === "pcs"} 
//                           onChange={handleInputChange}
//                         /> Pieces
//                       </label>
//                     </div>
//                   </div>

//                   <div>
//                     <label>Deal Currency</label>
//                     <div class="form-control">
//                       <label>
//                         <input 
//                           type="radio" 
//                           id="denomination" 
//                           name="denomination" 
//                           value="usd" 
//                           checked={offerData.denomination === "usd"} 
//                           onChange={handleInputChange}
//                         /> USD
//                       </label>
//                       <label>
//                         <input 
//                           type="radio" 
//                           id="denomination" 
//                           name="denomination" 
//                           value="rmb" 
//                           checked={offerData.denomination === "rmb"} 
//                           onChange={handleInputChange}
//                         /> RMB
//                       </label>
//                       <label>
//                         <input 
//                           type="radio" 
//                           id="denomination" 
//                           name="denomination" 
//                           value="other" 
//                           checked={offerData.denomination === "other"} 
//                           onChange={handleInputChange}
//                         /> Other
//                       </label>
//                     </div>
//                   </div>

//                   <div className="row mb-3">
//                     <div className="col-md-6">
//                       <label htmlFor="space" className="form-label">Space</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         id="space"
//                         name="space"
//                         value={offerData.space}
//                         onChange={handleInputChange}
//                         placeholder="Enter available space (e.g. 5)"
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label htmlFor="price" className="form-label">Price</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         id="price"
//                         name="price"
//                         value={offerData.price}
//                         onChange={handleInputChange}
//                         placeholder="Enter price (e.g. 200)"
//                       />
//                     </div>
//                   </div>

//                   {["departure", "destination", "departureDate"].map(
//                     (field) => (
//                       <div className="mb-3" key={field}>
//                         <label htmlFor={field} className="form-label">
//                           {field.charAt(0).toUpperCase() + field.slice(1)}
//                         </label>
//                         <input
//                           type={field === "departureDate" ? "date" : "text"}
//                           className="form-control"
//                           id={field}
//                           name={field}
//                           value={offerData[field]}
//                           onChange={handleInputChange}
//                           placeholder={
//                             field === "departure" ? "Enter departure location (e.g., Shenzhen)" :
//                             field === "destination" ? "Enter destination (e.g., Harare)" :
//                             field === "departureDate" ? "Select departure date" :
//                             ""
//                           }
//                         />
//                       </div>
//                     )
//                   )}
//                   </form>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <span
//                         className="spinner-border spinner-border-sm"
//                         role="status"
//                         aria-hidden="true"
//                       ></span>
//                     ) : (
//                       "Save Offer"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {showContactModal && (
//         <>
//         <Modal show={showContactModal} onHide={handleClose} centered backdrop="static">
//           <Modal.Header closeButton className="bg-light">
//             <Modal.Title>Edit Contact Information</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {error && <Alert variant="danger">{error}</Alert>}
            
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email Address</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={userData.email}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Phone Number</Form.Label>
//                 <Form.Control
//                   type="tel"
//                   name="phoneNumber"
//                   value={userData.phoneNumber}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>WeChat ID</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="weChatId"
//                   value={userData.weChatId}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
//               Cancel
//             </Button>
//             <Button 
//               variant="primary" 
//               onClick={onSubmit}
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//         </>
//       )}

//       {showDeleteModal && (
//         <>
//         <div className="modal-backdrop fade show"></div>
//           <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//             <div className="modal-dialog" role="document">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title text-danger">Delete Account</h5>
//                 </div>
//                 <div className="modal-body">
//                   <p>Are you sure you want to delete your account? This action cannot be undone.</p>
//                 </div>
//                 <div className="modal-footer">
//                   <button 
//                     type="button" 
//                     className="btn btn-primary" 
//                     onClick={handleCancel}
//                   >
//                     No
//                   </button>
//                   <button 
//                     type="button" 
//                     className="btn btn-danger" 
//                     onClick={handleDelete}
//                   >
//                     Yes, Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Edit shipping modal */}
//       <Modal show={showShippingAddressModal} onHide={() => setShippingAddressModal(false)} size="lg">
//               <Modal.Header closeButton>
//                 <Modal.Title>Edit Company Shipping Address</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <Form.Group controlId="companyIntroduction">
//                   <Form.Label>Shipping Address</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={6}
//                     value={shippingAddress}
//                     onChange={(e) => setShippingAddress(e.target.value)}
//                     placeholder="This is where users will send their goods for you to recieve them even chinese is ok..."
//                   />
//                   <Form.Text className="text-muted">
//                     This is where users will send their goods for you to recieve them (500 characters max)
//                   </Form.Text>
//                 </Form.Group>
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button 
//                   variant="secondary" 
//                   onClick={() => setShippingAddressModal(false)}
//                   disabled={isSaving}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   onClick={handleSaveShippingAddress}
//                   disabled={isSaving || !shippingAddress.trim()}
//                 >
//                   {isSaving ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Introduction"
//                   )}
//                 </Button>
//               </Modal.Footer>
//         </Modal>

//       {/* Toast */}
//       {toastMessage && (
//         <div
//           className="toast show position-fixed bottom-0 end-0 m-3"
//           style={{ zIndex: 1055 }}
//         >
//           <div className="toast-body">{toastMessage}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect } from "react";
import { 
  Card, 
  Container, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Form, 
  Alert, 
  Badge,
  Spinner,
  Toast,
  Image,
  ListGroup
} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerBuyCount, setOfferBuyCount] = useState(0);
  const [offerSellCount, setOfferSellCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showShippingAddressModal, setShippingAddressModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  
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

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const username = localStorage.user;
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-user', { username });
      setUserData(response.data[0]);
      setShippingAddress(response.data[0]?.shippingAddress || '');
    } catch (error) {
      console.error('Error fetching user information:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyOfferCount = async (username, type) => {
    try {
      const response = await axios.get("https://spaceshare-backend.onrender.com/packages/by-user", {
        params: { username, type },
      });
      setOfferBuyCount(response.data.length);
    } catch (error) {
      console.error("Error fetching packages by user:", error);
    }
  };

  const fetchSellOfferCount = async (username, type) => {
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
    fetchBuyOfferCount(localStorage.user, "buy");
    fetchSellOfferCount(localStorage.user, "sell");
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const username = localStorage.getItem("user");
    const email = localStorage.getItem("email");
    const departureDate = new Date(offerData.departureDate);
    const expirationDate = new Date(departureDate);
    expirationDate.setDate(departureDate.getDate() + 2);

    const offerWithUserData = {
      ...offerData,
      username,
      email,
      expirationDate: expirationDate.toISOString().split("T")[0],
    };

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
        setShowModal(false);
        fetchBuyOfferCount(localStorage.user, "buy");
        fetchSellOfferCount(localStorage.user, "sell");
      })
      .catch((error) => {
        setToastMessage("Failed to submit the offer.");
        console.error("Error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDelete = async () => {
    const payload = {
      filter: {
        _id: userData._id
      },
      update: {
        accountStatus: false
      }
    };

    try {
      await axios.post(`https://spaceshare-backend.onrender.com/delete-user`, payload);
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error("Error updating user: ", err);
      setToastMessage("Failed to delete account");
    }
  };

  const handleSaveShippingAddress = async () => {
    setIsSaving(true);
    
    try {
      const payload = {
        filter: {
          _id: userData._id
        },
        update: {
          shippingAddress: shippingAddress
        }
      };
  
      await axios.post('https://spaceshare-backend.onrender.com/update-user', payload);
      
      setUserData(prev => ({
        ...prev,
        shippingAddress: shippingAddress
      }));
      
      setShippingAddressModal(false);
      setToastMessage("Shipping address updated successfully!");
    } catch (err) {
      console.error("Error updating shipping address:", err);
      setToastMessage("Failed to update shipping address");
    } finally {
      setIsSaving(false);
    }
  };

  const updateContactInfo = async () => {
    setIsSaving(true);
    try {
      const payload = {
        filter: {
          _id: userData._id
        },
        update: {
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          weChatId: userData.weChatId
        }
      };
  
      await axios.post('https://spaceshare-backend.onrender.com/update-user', payload);
      setShowContactModal(false);
      setToastMessage("Contact information updated successfully!");
    } catch (err) {
      console.error("Error updating contact info:", err);
      setToastMessage("Failed to update contact information");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Toast Notification */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        <Toast 
          onClose={() => setToastMessage(null)} 
          show={!!toastMessage} 
          delay={3000} 
          autohide
          bg={toastMessage?.includes('success') ? 'success' : 'danger'}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>

      {/* Profile Header */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} className="text-center">
          <div className="position-relative d-inline-block">
            <Image
              src={userData?.avatar || "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true"}
              roundedCircle
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                border: "4px solid #fff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
              onError={(e) => {
                e.target.src = "https://github.com/CongoBeast/SpaceShare/blob/main/src/pages/profile-download.jpg?raw=true";
              }}
            />
            <Badge 
              bg="primary" 
              pill 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '0.8rem' }}
            >
              {offerBuyCount + offerSellCount} offers
            </Badge>
          </div>
          <h2 className="mt-3 mb-1 fw-bold">
            Hello, {localStorage.user || "Guest User"}
          </h2>
          <p className="text-muted mb-0">
            Member since {new Date(userData?.createdAt).toLocaleDateString()}
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-center align-items-center mb-2">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-cart-check fs-3 text-primary"></i>
                </div>
              </div>
              <h3 className="mb-1">{offerBuyCount}</h3>
              <p className="text-muted mb-3">Buy Offers</p>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate('/myoffers?type=buy')}
              >
                View Buy Offers
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-center align-items-center mb-2">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-cart-plus fs-3 text-success"></i>
                </div>
              </div>
              <h3 className="mb-1">{offerSellCount}</h3>
              <p className="text-muted mb-3">Sell Offers</p>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => navigate('/myoffers?type=sell')}
              >
                View Sell Offers
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Shipping Address Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              <i className="bi bi-truck me-2"></i>
              Shipping Address
            </h5>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setShippingAddressModal(true)}
            >
              <i className="bi bi-pencil me-1"></i>
              {userData?.shippingAddress ? 'Edit' : 'Add'}
            </Button>
          </div>
          
          {userData?.shippingAddress ? (
            <div className="p-3 bg-light rounded">
              <p className="mb-0">{userData.shippingAddress}</p>
            </div>
          ) : (
            <Alert variant="warning" className="mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              No shipping address set yet
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="d-grid gap-2 d-md-flex justify-content-center mb-4">
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
          className="me-md-2"
        >
          <i className="bi bi-plus-circle me-2"></i>
          New Offer
        </Button>
        <Button 
          variant="outline-secondary" 
          onClick={() => setShowContactModal(true)}
          className="me-md-2"
        >
          <i className="bi bi-gear me-2"></i>
          Contact Settings
        </Button>
        <Button 
          variant="outline-danger" 
          onClick={() => setShowDeleteModal(true)}
        >
          <i className="bi bi-trash me-2"></i>
          Delete Account
        </Button>
      </div>

      {/* New Offer Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="offerType">
                  <Form.Label>Offer Type</Form.Label>
                  <Form.Select 
                    name="type" 
                    value={offerData.type} 
                    onChange={handleInputChange}
                  >
                    <option value="sell">Sell Space</option>
                    <option value="buy">Buy Space</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="goodsType">
                  <Form.Label>Goods Type</Form.Label>
                  <Form.Select 
                    name="goodsType" 
                    value={offerData.goodsType} 
                    onChange={handleInputChange}
                  >
                    <option value="phones">Phones</option>
                    <option value="laptops">Laptops</option>
                    <option value="other-electronics">Other Electronics</option>
                    <option value="clothes">Clothes</option>
                    <option value="documents">Documents</option>
                    <option value="food">Food</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="units">
                  <Form.Label>Units</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Kgs"
                      name="units"
                      value="kgs"
                      checked={offerData.units === "kgs"}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Pieces"
                      name="units"
                      value="pcs"
                      checked={offerData.units === "pcs"}
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="denomination">
                  <Form.Label>Currency</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="USD"
                      name="denomination"
                      value="usd"
                      checked={offerData.denomination === "usd"}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="RMB"
                      name="denomination"
                      value="rmb"
                      checked={offerData.denomination === "rmb"}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Other"
                      name="denomination"
                      value="other"
                      checked={offerData.denomination === "other"}
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="space">
                  <Form.Label>Space ({offerData.units === "kgs" ? "Kgs" : "Pieces"})</Form.Label>
                  <Form.Control
                    type="number"
                    name="space"
                    value={offerData.space}
                    onChange={handleInputChange}
                    placeholder="Enter available space"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="price">
                  <Form.Label>Price ({offerData.denomination.toUpperCase()})</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={offerData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="departure">
                  <Form.Label>Departure</Form.Label>
                  <Form.Control
                    type="text"
                    name="departure"
                    value={offerData.departure}
                    onChange={handleInputChange}
                    placeholder="e.g., Shenzhen"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="destination">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    value={offerData.destination}
                    onChange={handleInputChange}
                    placeholder="e.g., Harare"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="departureDate" className="mb-3">
              <Form.Label>Departure Date</Form.Label>
              <Form.Control
                type="date"
                name="departureDate"
                value={offerData.departureDate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Submitting...
              </>
            ) : 'Submit Offer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contact Settings Modal */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData?.email || ''}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={userData?.phoneNumber || ''}
                onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
              />
            </Form.Group>

            <Form.Group controlId="weChatId" className="mb-3">
              <Form.Label>WeChat ID</Form.Label>
              <Form.Control
                type="text"
                name="weChatId"
                value={userData?.weChatId || ''}
                onChange={(e) => setUserData({...userData, weChatId: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowContactModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={updateContactInfo}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Shipping Address Modal */}
      <Modal show={showShippingAddressModal} onHide={() => setShippingAddressModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Shipping Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="shippingAddress">
            <Form.Control
              as="textarea"
              rows={5}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address where users can send their goods..."
            />
            <Form.Text className="text-muted">
              This address will be visible to other users when they want to send you packages
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShippingAddressModal(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveShippingAddress}
            disabled={isSaving || !shippingAddress.trim()}
          >
            {isSaving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Saving...
              </>
            ) : 'Save Address'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
            <h5 className="mt-3">Are you sure you want to delete your account?</h5>
            <p className="text-muted">This action cannot be undone. All your offers and data will be permanently removed.</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="me-3"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
          >
            <i className="bi bi-trash me-2"></i>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;