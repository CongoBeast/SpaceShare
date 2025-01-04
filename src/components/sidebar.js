// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../App.css";
// import { Link, useLocation, useNavigate } from "react-router-dom";


// const SidebarNavbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   useEffect(() => {
//     // Check if token exists in local storage
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, [location]); // Check login status on location change



//   const handleLogout = () => {
//     // Remove token from local storage and update state
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     navigate('/'); // Redirect to home after logout
//     toggleSidebar(); // Close the sidebar after logout
//   };

//   return (
//     <>
//       {/* Sidebar for medium and larger screens */}
//       <div
//         className={`d-none d-md-flex flex-column bg-primary text-white sidebar ${
//           isOpen ? "open" : ""
//         }`}
//       >
//         <div className="p-3 text-center">
//           <h4>SpaceShare</h4>
//         </div>
//         <div className="nav flex-column nav-pills">
//          <Link to="/" className="nav-link text-white">
//             <button className="btn btn-primary text-white mb-2">
//                 <i className="bi bi-house me-2"></i> Home
//             </button>
//           </Link>

//           <Link to="/about" className="nav-link text-white">
//             <button className="btn btn-primary text-white mb-2">
//             <i className="bi bi-gear me-2"></i> About
//             </button>
//           </Link>


//           {isLoggedIn && (
//             <>
//             <Link to="/profile" className="nav-link text-white">
//             <button className="btn btn-primary text-white mb-2">
//             <i className="bi bi-person me-2"></i> Profile
//             </button>
//             </Link>

//             <Link to="/auth" className="nav-link text-white">
//             <button className="btn btn-primary text-white mb-2" onClick={handleLogout}>
//             <i className="bi bi-gear me-2"></i> Logout
//             </button>
//           </Link>
//             </>
//           )}
         
//         </div>
//       </div>

//       {/* Navbar for small screens */}
//       <nav className="navbar navbar-expand-md navbar-dark bg-primary d-md-none">
//         <div className="container-fluid">
//           <button
//             className="navbar-toggler"
//             type="button"
//             onClick={toggleSidebar}
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <span className="navbar-brand">My App</span>
//         </div>
//       </nav>

//       {/* Collapsible Sidebar for small screens */}
//       <div
//         className={`d-md-none bg-primary text-white sidebar-collapse ${
//           isOpen ? "open" : ""
//         }`}
//       >
//         <div className="p-3 text-center">
//           <h4>My App</h4>
//         </div>
//         <div className="nav flex-column nav-pills">
//           <button className="btn btn-primary text-white mb-2">
//             <i className="bi bi-house me-2"></i> Home
//           </button>
//           <button className="btn btn-primary text-white mb-2">
//             <i className="bi bi-person me-2"></i> Profile
//           </button>
//           <button className="btn btn-primary text-white mb-2">
//             <i className="bi bi-gear me-2"></i> Settings
//           </button>
//           <button className="btn btn-primary text-white mb-2">
//             <i className="bi bi-info-circle me-2"></i> About
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SidebarNavbar;

import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import { FaNewspaper } from "react-icons/fa6";
import './sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]); // Check login status on location change

  const isLinkActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Remove token from local storage and update state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
    toggleSidebar(); // Close the sidebar after logout
  };

  const handleNavClick = (path) => {
    navigate(path);
    toggleSidebar(); // Close the sidebar when a navigation item is clicked
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="flex-column d-none d-lg-block sidebar"
    >
      <Navbar.Brand as={Link} to="/">
        <img src="https://github.com/CongoBeast/Tech-News/blob/master/public/cordelia-side-nav.png?raw=true" 
        alt="Imat Tech Logo"
          style={{  width: "160px" , height: "80px" }}
          className="d-flex align-items-center"
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleSidebar} />

      <Navbar.Collapse id="basic-navbar-nav" className={!isOpen && "d-none d-lg-block"}>
        <Nav className="flex-column gap-3" style={{ padding: "2rem", textAlign: "right" }}>
          <Button
            variant={isLinkActive("/home") ? "primary" : "outline-light"}
            className="text-left d-flex align-items-center"
            style={{ marginBottom: "1rem" }}
            onClick={() => handleNavClick('/')}
          >
            <FaHome />
            <span style={{ marginLeft: "1rem" }}>Home</span>
          </Button>

          <Button
            variant={isLinkActive("/funding") ? "primary" : "outline-light"}
            className="text-left d-flex align-items-center"
            style={{ marginBottom: "1rem" }}
            onClick={() => handleNavClick('/profile')}
          >
            <FaNewspaper />
            <span style={{ marginLeft: "1rem" }}>Profile</span>
          </Button>


          <Button
            variant={isLinkActive("/about") ? "primary" : "outline-light"}
            className="text-left d-flex align-items-center"
            style={{ marginBottom: "1rem" }}
            onClick={() => handleNavClick('/about')}
          >
            <IoIosInformationCircle />
            <span style={{ marginLeft: "1rem" }}>About Us</span>
          </Button>

          {isLoggedIn && (
            <>
              <Button
                variant={isLinkActive("/admin") ? "primary" : "outline-light"}
                className="text-left d-flex align-items-center"
                style={{ marginBottom: "1rem" }}
                onClick={() => handleNavClick('/notifications')}
              >
                <IoIosInformationCircle />
                <span style={{ marginLeft: "1rem" }}>Notifications</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline-light"
                className="text-left d-flex align-items-center"
                style={{ marginBottom: "1rem" }}
              >
                <span style={{ marginLeft: "1rem" }}>Logout</span>
              </Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Sidebar;
