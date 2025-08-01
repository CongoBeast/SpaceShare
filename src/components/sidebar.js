// import React, { useState, useEffect } from "react";
// import { Navbar, Nav, Button, Badge } from "react-bootstrap";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaHome , FaTruck } from "react-icons/fa";
// import { BsFillFileBarGraphFill } from "react-icons/bs";
// import { IoIosInformationCircle, IoIosNotifications } from "react-icons/io";
// import { MdManageAccounts } from "react-icons/md";
// import { BiLogInCircle } from "react-icons/bi";
// import { RiLogoutCircleRLine } from "react-icons/ri";
// import { CgProfile } from "react-icons/cg"; 
// import { FaNewspaper } from "react-icons/fa6";
// import './sidebar.css';
// import axios from 'axios';
// import { IoChatbubbleEllipses } from "react-icons/io5";

// function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isShipperLoggedIn, setIsShipperLoggedIn] = useState(false);
//   const [chatList , setChatList] = useState([]);
//   const [filter, setFilter] = useState('all');

//   const fetchChatList = async () => {
//         const username = localStorage.user;
//         try {
//           const response = await axios.post('https://spaceshare-backend.onrender.com/get-chats', { username });
//           setChatList(response.data); // Update state with fetched packages
//         } catch (error) {
//           console.error('Error fetching packages:', error);
//         }
//       };

//   useEffect(() => {
//     // Check if token exists in local storage
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//     fetchChatList();
//   }, [location]); // Check login status on location change

//   const isLinkActive = (path) => location.pathname === path;

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleLogout = () => {
//     // Remove token from local storage and update state
//     const username = localStorage.getItem('username');
  
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     localStorage.removeItem('user');
//     localStorage.removeItem('email');
//     localStorage.removeItem('companyName');
//     localStorage.removeItem('companyId');
//     setIsLoggedIn(false);
  
//     // Prepare notification data
//     const notificationData = {
//       description: `${username} has logged out.`,
//       date: new Date().toISOString(),
//       read: false,
//       username: username,
//     };
  
//     // Send notification to backend
//     axios
//       .post('https://spaceshare-backend.onrender.com/set-notification', notificationData)
//       .then(() => {
//         console.log('Logout notification sent successfully');
//       })
//       .catch((error) => {
//         console.error('Error sending logout notification:', error);
//       });
  
//     navigate('/'); // Redirect to home after logout
//     toggleSidebar(); // Close the sidebar after logout
//   };

//   const handleNavClick = (path) => {
//     navigate(path);
//     toggleSidebar(); // Close the sidebar when a navigation item is clicked
//   };

//   const handleShipperLogout = () => {
//       // Remove token from local storage and update state
//       const username = localStorage.getItem('companyId');
    
//       localStorage.removeItem('token');
//       localStorage.removeItem('username');
//       localStorage.removeItem('companyId');
//       localStorage.removeItem('companyName');
//       localStorage.removeItem('email');
//       setIsShipperLoggedIn(false);
    
//       // Prepare notification data
//       const notificationData = {
//         description: `${username} has logged out.`,
//         date: new Date().toISOString(),
//         read: false,
//         username: username,
//       };
    
//       // Send notification to backend
//       axios
//         .post('https://spaceshare-backend.onrender.com/set-notification', notificationData)
//         .then(() => {
//           console.log('Logout notification sent successfully');
//         })
//         .catch((error) => {
//           console.error('Error sending logout notification:', error);
//         });
    
//       navigate('/auth-shipper'); // Redirect to home after logout
//       // toggleSidebar(); // Close the sidebar after logout
//     };

//   const filteredChats = chatList.filter(chat =>
//     filter === 'all' ? true : filter === 'unread' ? !chat.read : chat.read
//   );

//   const unreadCount = chatList.filter(chat => !chat.read).length;

//   const homeRedirectPath = localStorage.getItem('companyName') ? '/shipper-dashboard' : '/';

//   return (
//     <Navbar
//       expand="lg"
//       variant="dark"
//       className="flex-column d-none d-lg-block sidebar"
//     >
//       <Navbar.Brand as={Link} to="/">
//         <img src="https://github.com/CongoBeast/SpaceShare/blob/main/public/meli-logo.png?raw=true" 
//         alt="Imat Tech Logo"
//           style={{  width: "140px" , height: "80px" }}
//           className="d-flex align-items-center"
//         />
//       </Navbar.Brand>

//       <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleSidebar} />

//       <Navbar.Collapse id="basic-navbar-nav" className={!isOpen && "d-none d-lg-block"}>
//         <Nav className="flex-column gap-3" style={{ padding: "2rem", textAlign: "right" }}>
//           <Button
//             variant={isLinkActive("/home") ? "primary" : "outline-light"}
//             className="text-left d-flex align-items-center"
//             style={{ marginBottom: "1rem" }}
//             onClick={() => handleNavClick(homeRedirectPath)}
//           >
//             <FaHome />
//             <span style={{ marginLeft: "1rem" }}>Home</span>
//           </Button>

          

//           {!isLoggedIn && (
//             <>
//               <Button
//             variant={isLinkActive("/auth") ? "primary" : "outline-light"}
//             className="text-left d-flex align-items-center"
//             style={{ marginBottom: "1rem" }}
//             onClick={() => handleNavClick('/auth')}
//           >
//             <BiLogInCircle />
//             <span style={{ marginLeft: "1rem" }}>Client Login</span>
//           </Button>
//             </>
//           )}

          
//           {!isLoggedIn && !localStorage.getItem("companyId") && (
//             <>
//               <Button
//                 variant={isLinkActive("/about") ? "primary" : "outline-light"}
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => handleNavClick('/about')}
//               >
//                 <IoIosInformationCircle />
//                 <span style={{ marginLeft: "1rem" }}>About Us</span>
//               </Button>
//             </>
//           )}

//               <Button
//                 variant={isLinkActive("/shippers") ? "primary" : "outline-light"}
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => handleNavClick('/shippers')}
//               >
//                 <FaTruck />
//                 <span style={{ marginLeft: "1rem" }}>Pro Shippers</span>
//               </Button>

//           {isLoggedIn && !localStorage.getItem("companyId") && (
//             <>
//               <Button
//                 variant={isLinkActive("/funding") ? "primary" : "outline-light"}
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => handleNavClick('/profile')}
//               >
//                 <CgProfile />
//                 <span style={{ marginLeft: "1rem" }}>Profile</span>
//               </Button>

//               <Button
//                 variant={isLinkActive("/chat") ? "primary" : "outline-light"}
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => handleNavClick('/chat')}
//               >
//                 <IoChatbubbleEllipses />
//                 <span style={{ marginLeft: "1rem" }}>Chat      </span>
//                                 <Badge bg="danger" className="mt-1">
//                                   {unreadCount}
//                                 </Badge>
//               </Button>

//               <Button
//                 variant={isLinkActive("/notifications") ? "primary" : "outline-light"}
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => handleNavClick('/notifications')}
//               >
//                 <IoIosNotifications />
//                 <span style={{ marginLeft: "1rem" }}>Notifications</span>
//               </Button>

//               <Button
//                 onClick={handleLogout}
//                 variant="outline-light"
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//               >
//                 <RiLogoutCircleRLine />
//                 <span style={{ marginLeft: "1rem" }}>Logout</span>
//               </Button>
//             </>
//           )}


//           {!localStorage.getItem("companyId") && !isLoggedIn && (
//               <>
//               <Button
//                 variant={isLinkActive("/auth") ? "primary" : "outline-light"}
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => handleNavClick('/auth-shipper')}
//               >
//                 <BiLogInCircle />
//                 <span style={{ marginLeft: "1rem" }}>Shipper Login</span>
//               </Button>
//               </>
//             )}


//             {localStorage.getItem("companyId") && (
//               <>

//               <Button
//                 onClick={() => handleNavClick('/manage-shipments')}
//                 variant="outline-light"
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//               >
//                 <MdManageAccounts />
//                 <span style={{ marginLeft: "1rem" }}>Manage Shipments</span>
//               </Button>
              

//               <Button
//                 variant={isLinkActive("/chat") ? "primary" : "outline-light"}
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => handleNavClick('/chat')}
//               >
//                 <IoChatbubbleEllipses />
//                 <span style={{ marginLeft: "1rem" }}>Chat      </span>
//                                 <Badge bg="danger" className="mt-1">
//                                   {unreadCount}
//                                 </Badge>
//               </Button>

          
//               <Button
//                 onClick={handleShipperLogout}
//                 variant="outline-light"
//                 className="text-left d-flex align-items-center"
//                 style={{ marginBottom: "1rem" }}
//               >
//                 <RiLogoutCircleRLine />
//                 <span style={{ marginLeft: "1rem" }}>Logout</span>
//               </Button>
//               </>
//             )}


//         </Nav>
//       </Navbar.Collapse>
//     </Navbar>
//   );
// }

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome , FaTruck } from "react-icons/fa";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { IoIosInformationCircle, IoIosNotifications } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { BiLogInCircle } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg"; 
import { FaNewspaper } from "react-icons/fa6";
import './sidebar.css';
import axios from 'axios';
import { IoChatbubbleEllipses } from "react-icons/io5";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isShipperLoggedIn, setIsShipperLoggedIn] = useState(false);
  const [chatList , setChatList] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchChatList = async () => {
        const username = localStorage.user;
        try {
          const response = await axios.post('https://spaceshare-backend.onrender.com/get-chats', { username });
          setChatList(response.data); // Update state with fetched packages
        } catch (error) {
          console.error('Error fetching packages:', error);
        }
      };

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    fetchChatList();
  }, [location]); // Check login status on location change

  const isLinkActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // const handleLogout = () => {
  //   // Remove token from local storage and update state
  //   const username = localStorage.getItem('username');
  
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('email');
  //   localStorage.removeItem('companyName');
  //   localStorage.removeItem('companyId');
  //   setIsLoggedIn(false);
  
  //   // Prepare notification data
  //   const notificationData = {
  //     description: `${username} has logged out.`,
  //     date: new Date().toISOString(),
  //     read: false,
  //     username: username,
  //   };
  
  //   // Send notification to backend
  //   axios
  //     .post('https://spaceshare-backend.onrender.com/set-notification', notificationData)
  //     .then(() => {
  //       console.log('Logout notification sent successfully');
  //     })
  //     .catch((error) => {
  //       console.error('Error sending logout notification:', error);
  //     });
  
  //   navigate('/'); // Redirect to home after logout
  //   toggleSidebar(); // Close the sidebar after logout
  // };
  const handleLogout = async () => {
  // Remove token from local storage and update state
  const username = localStorage.getItem('username');

  try {
    // Prepare notification data
    const notificationData = {
      description: `${username} has logged out.`,
      date: new Date().toISOString(),
      read: false,
      username: username,
    };

    // Send notification to backend
    await fetch('https://spaceshare-backend.onrender.com/set-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });

    console.log('Logout notification sent successfully');
  } catch (error) {
    console.error('Error sending logout notification:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('companyName');
    localStorage.removeItem('companyId');
    
    // Update state and navigate
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
    toggleSidebar(); // Close the sidebar after logout
  }
};

  const handleNavClick = (path) => {
    navigate(path);
    toggleSidebar(); // Close the sidebar when a navigation item is clicked
  };

  const handleShipperLogout = () => {
      // Remove token from local storage and update state
      const username = localStorage.getItem('companyId');
    
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('companyId');
      localStorage.removeItem('companyName');
      localStorage.removeItem('email');
      setIsShipperLoggedIn(false);
    
      // Prepare notification data
      const notificationData = {
        description: `${username} has logged out.`,
        date: new Date().toISOString(),
        read: false,
        username: username,
      };
    
      // Send notification to backend
      axios
        .post('https://spaceshare-backend.onrender.com/set-notification', notificationData)
        .then(() => {
          console.log('Logout notification sent successfully');
        })
        .catch((error) => {
          console.error('Error sending logout notification:', error);
        });
    
      navigate('/auth-shipper'); // Redirect to home after logout
      // toggleSidebar(); // Close the sidebar after logout
    };

  const filteredChats = chatList.filter(chat =>
    filter === 'all' ? true : filter === 'unread' ? !chat.read : chat.read
  );

  const unreadCount = chatList.filter(chat => !chat.read).length;

  const homeRedirectPath = localStorage.getItem('companyName') ? '/shipper-dashboard' : '/';

  return (
    <div className="enhanced-sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <Link to="/" className="logo-container">
          <img 
            src="https://github.com/CongoBeast/SpaceShare/blob/main/public/meli-logo.png?raw=true" 
            alt="Imat Tech Logo"
            className="sidebar-logo"
          />
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-item">
            <button
              className={`nav-button ${isLinkActive("/home") ? "active" : ""}`}
              onClick={() => handleNavClick(homeRedirectPath)}
            >
              <div className="nav-icon">
                <FaHome />
              </div>
              <span className="nav-text">Home</span>
            </button>
          </div>

          {!isLoggedIn && (
            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/auth") ? "active" : ""}`}
                onClick={() => handleNavClick('/auth')}
              >
                <div className="nav-icon">
                  <BiLogInCircle />
                </div>
                <span className="nav-text">Client Login</span>
              </button>
            </div>
          )}

          {!isLoggedIn && !localStorage.getItem("companyId") && (
            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/about") ? "active" : ""}`}
                onClick={() => handleNavClick('/about')}
              >
                <div className="nav-icon">
                  <IoIosInformationCircle />
                </div>
                <span className="nav-text">About Us</span>
              </button>
            </div>
          )}

          <div className="nav-item">
            <button
              className={`nav-button ${isLinkActive("/shippers") ? "active" : ""}`}
              onClick={() => handleNavClick('/shippers')}
            >
              <div className="nav-icon">
                <FaTruck />
              </div>
              <span className="nav-text">Pro Shippers</span>
            </button>
          </div>
        </div>

        {/* User Section */}
        {isLoggedIn && !localStorage.getItem("companyId") && (
          <div className="nav-section user-section">
            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/profile") ? "active" : ""}`}
                onClick={() => handleNavClick('/profile')}
              >
                <div className="nav-icon">
                  <CgProfile />
                </div>
                <span className="nav-text">Profile</span>
              </button>
            </div>

            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/chat") ? "active" : ""}`}
                onClick={() => handleNavClick('/chat')}
              >
                <div className="nav-icon">
                  <IoChatbubbleEllipses />
                </div>
                <span className="nav-text">Chat</span>
                {unreadCount > 0 && (
                  <div className="notification-badge">
                    {unreadCount}
                  </div>
                )}
              </button>
            </div>

            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/notifications") ? "active" : ""}`}
                onClick={() => handleNavClick('/notifications')}
              >
                <div className="nav-icon">
                  <IoIosNotifications />
                </div>
                <span className="nav-text">Notifications</span>
              </button>
            </div>

            <div className="nav-item logout-item">
              <button
                className="nav-button logout-button"
                onClick={handleLogout}
              >
                <div className="nav-icon">
                  <RiLogoutCircleRLine />
                </div>
                <span className="nav-text">Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Shipper Login Section */}
        {!localStorage.getItem("companyId") && !isLoggedIn && (
          <div className="nav-section">
            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/auth-shipper") ? "active" : ""}`}
                onClick={() => handleNavClick('/auth-shipper')}
              >
                <div className="nav-icon">
                  <BiLogInCircle />
                </div>
                <span className="nav-text">Shipper Login</span>
              </button>
            </div>
          </div>
        )}

        {/* Shipper Section */}
        {localStorage.getItem("companyId") && (
          <div className="nav-section user-section">
            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/manage-shipments") ? "active" : ""}`}
                onClick={() => handleNavClick('/manage-shipments')}
              >
                <div className="nav-icon">
                  <MdManageAccounts />
                </div>
                <span className="nav-text">Manage Shipments</span>
              </button>
            </div>

            <div className="nav-item">
              <button
                className={`nav-button ${isLinkActive("/chat") ? "active" : ""}`}
                onClick={() => handleNavClick('/chat')}
              >
                <div className="nav-icon">
                  <IoChatbubbleEllipses />
                </div>
                <span className="nav-text">Chat</span>
                {unreadCount > 0 && (
                  <div className="notification-badge">
                    {unreadCount}
                  </div>
                )}
              </button>
            </div>

            <div className="nav-item logout-item">
              <button
                className="nav-button logout-button"
                onClick={handleShipperLogout}
              >
                <div className="nav-icon">
                  <RiLogoutCircleRLine />
                </div>
                <span className="nav-text">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;