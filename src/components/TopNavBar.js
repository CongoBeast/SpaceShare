// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import { Button } from "react-bootstrap";
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import { Link, useLocation , useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";


// import { RxDashboard, RxPinLeft } from "react-icons/rx";
// import { GiTruck } from "react-icons/gi";
// import { IoPieChartSharp } from "react-icons/io5";
// import { FaInfoCircle } from "react-icons/fa";
// import { FaFileInvoiceDollar } from "react-icons/fa";
// import { IoIosPeople } from "react-icons/io";
// import { GiCoalWagon } from "react-icons/gi";
// import { BiSupport } from "react-icons/bi";
// import { SiMicrosoftexcel } from "react-icons/si";
// import { RiAlarmWarningFill } from "react-icons/ri";
// import { FaHome , FaTruck} from "react-icons/fa";
// import { BsFillFileBarGraphFill } from "react-icons/bs";
// import { IoIosInformationCircle } from "react-icons/io";
// import { FaNewspaper } from "react-icons/fa6";
// import { BiLogInCircle } from "react-icons/bi";



// function TopNavBar() {

//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if token exists in local storage
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, [location]); // Check login status on location change

//   const isLinkActive = (path) => location.pathname === path;

//   const handleLogout = () => {
//     // Remove token from local storage and update state
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     navigate('/'); // Redirect to home after logout
//   };

//   return (
//     // <Navbar collapseOnSelect expand="md" className="bg-body-tertiary d-lg-none mb-3 mx p-1">
//     <Navbar 
//       collapseOnSelect 
//       expand="md" 
//       style={{ backgroundColor: '#3a0ca3' }} 
//       className="mb-3 mx p-1 navbar-dark d-lg-none"
//       onToggle={() => setIsOpen(!isOpen)}
//       expanded={isOpen}
//     >
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="text-white">
//           <img 
//             src="https://github.com/CongoBeast/SpaceShare/blob/main/public/meli-logo.png?raw=true" 
//             alt="Imat Tech Logo"
//             style={{ maxHeight: "50px", maxWidth: "50px" }}
//             className="d-flex align-items-center"
//           />
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="responsive-navbar-nav" className="border-0" />
//         <Navbar.Collapse id="responsive-navbar-nav">
//           <Nav className="ml-auto" style={{ textAlign: "right" }}>
//             <Nav.Link 
//               as={Link}
//               to="/"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaHome />
//               <span style={{ marginLeft: "1rem" }}>Home</span>
//             </Nav.Link>

//             {!isLoggedIn && (
//               <Nav.Link
//                 as={Link}
//                 to="/auth"
//                 className={`text-left d-flex align-items-center text-white ${isLinkActive("/auth") ? "active" : ""}`}
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => setIsOpen(false)}
//               >
//                 <BiLogInCircle />
//                 <span style={{ marginLeft: "1rem" }}>Client Login</span>
//               </Nav.Link>
//             )}

//             <Nav.Link 
//               as={Link}
//               to="/profile"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/profile") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaNewspaper />
//               <span style={{ marginLeft: "1rem" }}>Profile</span>
//             </Nav.Link>

//             <Nav.Link 
//               as={Link}
//               to="/shippers"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/shippers") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaTruck />
//               <span style={{ marginLeft: "1rem" }}>Pro Shippers</span>
//             </Nav.Link>

//             <Nav.Link
//               as={Link}
//               to="/about"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/about") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <IoIosInformationCircle />
//               <span style={{ marginLeft: "1rem" }}>About Us</span>
//             </Nav.Link>

//             {isLoggedIn && (
//               <>
//                 <Nav.Link
//                   as={Link}
//                   to="/notifications"
//                   className={`text-left d-flex align-items-center text-white ${isLinkActive("/notifications") ? "active" : ""}`}
//                   style={{ marginBottom: "1rem" }}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <IoIosInformationCircle />
//                   <span style={{ marginLeft: "1rem" }}>Notifications</span>
//                 </Nav.Link>
//                 <Nav.Link
//                   onClick={() => {
//                     handleLogout();
//                     setIsOpen(false);
//                   }}
//                   className="text-left d-flex align-items-center text-white"
//                   style={{ marginBottom: "1rem" }}
//                 >
//                   <span style={{ marginLeft: "1rem" }}>Logout</span>
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default TopNavBar;
import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaTruck, 
  FaNewspaper 
} from "react-icons/fa";
import { 
  IoIosInformationCircle, 
  IoIosNotifications 
} from "react-icons/io";
import { 
  BiLogInCircle 
} from "react-icons/bi";
import { 
  RiLogoutCircleRLine 
} from "react-icons/ri";
import { 
  CgProfile 
} from "react-icons/cg";
import { 
  MdManageAccounts 
} from "react-icons/md";
import { 
  IoChatbubbleEllipses 
} from "react-icons/io5";
import axios from 'axios';

function TopNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isShipperLoggedIn, setIsShipperLoggedIn] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchChatList = async () => {
    const username = localStorage.user;
    try {
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-chats', { username });
      setChatList(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('companyId');
    
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    
    if (companyId) {
      setIsShipperLoggedIn(true);
    } else {
      setIsShipperLoggedIn(false);
    }
    
    fetchChatList();
  }, [location]);

  const isLinkActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Remove token from local storage and update state
    const username = localStorage.getItem('username');
  
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('companyName');
    localStorage.removeItem('companyId');
    setIsLoggedIn(false);
  
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
  
    navigate('/');
    setIsOpen(false);
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
  
    navigate('/auth-shipper');
    setIsOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const filteredChats = chatList.filter(chat =>
    filter === 'all' ? true : filter === 'unread' ? !chat.read : chat.read
  );

  const unreadCount = chatList.filter(chat => !chat.read).length;
  const homeRedirectPath = localStorage.getItem('companyName') ? '/shipper-dashboard' : '/';

  const customStyles = {
    navbar: {
      background: 'linear-gradient(135deg, #8B45BB 0%, #B565D8 100%)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(139, 69, 187, 0.15)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    navbarBrand: {
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1.2rem'
    },
    logo: {
      maxHeight: '50px',
      maxWidth: '50px',
      marginRight: '0.5rem',
      borderRadius: '8px'
    },
    navLink: {
      color: 'rgba(255, 255, 255, 0.9) !important',
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      margin: '0.25rem 0',
      borderRadius: '0.75rem',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      textDecoration: 'none'
    },
    navLinkActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white !important',
      transform: 'translateX(5px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },
    navLinkHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateX(3px)'
    },
    iconWrapper: {
      marginRight: '0.75rem',
      fontSize: '1.1rem'
    },
    badge: {
      backgroundColor: '#ff4757',
      color: 'white',
      borderRadius: '50%',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      marginLeft: '0.5rem',
      minWidth: '20px',
      textAlign: 'center'
    },
    toggler: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.5rem',
      padding: '0.25rem 0.5rem'
    },
    collapse: {
      paddingTop: '1rem'
    }
  };

  return (
    <Navbar 
      collapseOnSelect 
      expand="lg" 
      className="mb-3 mx p-2 navbar-dark d-lg-none"
      style={customStyles.navbar}
      onToggle={() => setIsOpen(!isOpen)}
      expanded={isOpen}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          style={customStyles.navbarBrand}
          onClick={() => setIsOpen(false)}
        >
          <img 
            src="https://github.com/CongoBeast/SpaceShare/blob/main/public/meli-logo.png?raw=true" 
            alt="Imat Tech Logo"
            style={customStyles.logo}
          />
          Meli Flow
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="responsive-navbar-nav" 
          style={customStyles.toggler}
        />
        
        <Navbar.Collapse id="responsive-navbar-nav" style={customStyles.collapse}>
          <Nav className="ms-auto">
            {/* Home Link */}
            <Nav.Link 
              as={Link}
              to={homeRedirectPath}
              style={{
                ...customStyles.navLink,
                ...(isLinkActive(homeRedirectPath) ? customStyles.navLinkActive : {})
              }}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => {
                if (!isLinkActive(homeRedirectPath)) {
                  Object.assign(e.target.style, customStyles.navLinkHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isLinkActive(homeRedirectPath)) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={customStyles.iconWrapper}>
                <FaHome />
              </span>
              Home
            </Nav.Link>

            {/* Client Login (when not logged in) */}
            {!isLoggedIn && !localStorage.getItem("companyId") && (
              <Nav.Link
                as={Link}
                to="/auth"
                style={{
                  ...customStyles.navLink,
                  ...(isLinkActive("/auth") ? customStyles.navLinkActive : {})
                }}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => {
                  if (!isLinkActive("/auth")) {
                    Object.assign(e.target.style, customStyles.navLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLinkActive("/auth")) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={customStyles.iconWrapper}>
                  <BiLogInCircle />
                </span>
                Client Login
              </Nav.Link>
            )}

            {/* About Us (when not logged in) */}
            {!isLoggedIn && !localStorage.getItem("companyId") && (
              <Nav.Link
                as={Link}
                to="/about"
                style={{
                  ...customStyles.navLink,
                  ...(isLinkActive("/about") ? customStyles.navLinkActive : {})
                }}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => {
                  if (!isLinkActive("/about")) {
                    Object.assign(e.target.style, customStyles.navLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLinkActive("/about")) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={customStyles.iconWrapper}>
                  <IoIosInformationCircle />
                </span>
                About Us
              </Nav.Link>
            )}

            {/* Pro Shippers */}
            <Nav.Link 
              as={Link}
              to="/shippers"
              style={{
                ...customStyles.navLink,
                ...(isLinkActive("/shippers") ? customStyles.navLinkActive : {})
              }}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => {
                if (!isLinkActive("/shippers")) {
                  Object.assign(e.target.style, customStyles.navLinkHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isLinkActive("/shippers")) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={customStyles.iconWrapper}>
                <FaTruck />
              </span>
              Pro Shippers
            </Nav.Link>

            {/* Client User Section */}
            {isLoggedIn && !localStorage.getItem("companyId") && (
              <>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  style={{
                    ...customStyles.navLink,
                    ...(isLinkActive("/profile") ? customStyles.navLinkActive : {})
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isLinkActive("/profile")) {
                      Object.assign(e.target.style, customStyles.navLinkHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLinkActive("/profile")) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={customStyles.iconWrapper}>
                    <CgProfile />
                  </span>
                  Profile
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/chat"
                  style={{
                    ...customStyles.navLink,
                    ...(isLinkActive("/chat") ? customStyles.navLinkActive : {})
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isLinkActive("/chat")) {
                      Object.assign(e.target.style, customStyles.navLinkHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLinkActive("/chat")) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={customStyles.iconWrapper}>
                    <IoChatbubbleEllipses />
                  </span>
                  Chat
                  {unreadCount > 0 && (
                    <span style={customStyles.badge}>
                      {unreadCount}
                    </span>
                  )}
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/notifications"
                  style={{
                    ...customStyles.navLink,
                    ...(isLinkActive("/notifications") ? customStyles.navLinkActive : {})
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isLinkActive("/notifications")) {
                      Object.assign(e.target.style, customStyles.navLinkHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLinkActive("/notifications")) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={customStyles.iconWrapper}>
                    <IoIosNotifications />
                  </span>
                  Notifications
                </Nav.Link>

                <Nav.Link
                  onClick={handleLogout}
                  style={{
                    ...customStyles.navLink,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, customStyles.navLinkHover);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={customStyles.iconWrapper}>
                    <RiLogoutCircleRLine />
                  </span>
                  Logout
                </Nav.Link>
              </>
            )}

            {/* Shipper Login (when no user is logged in) */}
            {!localStorage.getItem("companyId") && !isLoggedIn && (
              <Nav.Link
                as={Link}
                to="/auth-shipper"
                style={{
                  ...customStyles.navLink,
                  ...(isLinkActive("/auth-shipper") ? customStyles.navLinkActive : {})
                }}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => {
                  if (!isLinkActive("/auth-shipper")) {
                    Object.assign(e.target.style, customStyles.navLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLinkActive("/auth-shipper")) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={customStyles.iconWrapper}>
                  <BiLogInCircle />
                </span>
                Shipper Login
              </Nav.Link>
            )}

            {/* Shipper User Section */}
            {localStorage.getItem("companyId") && (
              <>
                <Nav.Link
                  as={Link}
                  to="/manage-shipments"
                  style={{
                    ...customStyles.navLink,
                    ...(isLinkActive("/manage-shipments") ? customStyles.navLinkActive : {})
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isLinkActive("/manage-shipments")) {
                      Object.assign(e.target.style, customStyles.navLinkHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLinkActive("/manage-shipments")) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={customStyles.iconWrapper}>
                    <MdManageAccounts />
                  </span>
                  Manage Shipments
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/chat"
                  style={{
                    ...customStyles.navLink,
                    ...(isLinkActive("/chat") ? customStyles.navLinkActive : {})
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isLinkActive("/chat")) {
                      Object.assign(e.target.style, customStyles.navLinkHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLinkActive("/chat")) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={customStyles.iconWrapper}>
                    <IoChatbubbleEllipses />
                  </span>
                  Chat
                  {unreadCount > 0 && (
                    <span style={customStyles.badge}>
                      {unreadCount}
                    </span>
                  )}
                </Nav.Link>

                <Nav.Link
                  onClick={handleShipperLogout}
                  style={{
                    ...customStyles.navLink,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, customStyles.navLinkHover);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={customStyles.iconWrapper}>
                    <RiLogoutCircleRLine />
                  </span>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;