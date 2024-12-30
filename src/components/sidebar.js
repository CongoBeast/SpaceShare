import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import { Link, useLocation, useNavigate } from "react-router-dom";


const SidebarNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]); // Check login status on location change



  const handleLogout = () => {
    // Remove token from local storage and update state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
    toggleSidebar(); // Close the sidebar after logout
  };

  return (
    <>
      {/* Sidebar for medium and larger screens */}
      <div
        className={`d-none d-md-flex flex-column bg-primary text-white sidebar ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="p-3 text-center">
          <h4>SpaceShare</h4>
        </div>
        <div className="nav flex-column nav-pills">
         <Link to="/" className="nav-link text-white">
            <button className="btn btn-primary text-white mb-2">
                <i className="bi bi-house me-2"></i> Home
            </button>
          </Link>

          <Link to="/about" className="nav-link text-white">
            <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-gear me-2"></i> About
            </button>
          </Link>


          {isLoggedIn && (
            <>
            <Link to="/profile" className="nav-link text-white">
            <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-person me-2"></i> Profile
            </button>
            </Link>

            <Link to="/auth" className="nav-link text-white">
            <button className="btn btn-primary text-white mb-2" onClick={handleLogout}>
            <i className="bi bi-gear me-2"></i> Logout
            </button>
          </Link>
            </>
          )}
         
        </div>
      </div>

      {/* Navbar for small screens */}
      <nav className="navbar navbar-expand-md navbar-dark bg-primary d-md-none">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <span className="navbar-brand">My App</span>
        </div>
      </nav>

      {/* Collapsible Sidebar for small screens */}
      <div
        className={`d-md-none bg-primary text-white sidebar-collapse ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="p-3 text-center">
          <h4>My App</h4>
        </div>
        <div className="nav flex-column nav-pills">
          <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-house me-2"></i> Home
          </button>
          <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-person me-2"></i> Profile
          </button>
          <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-gear me-2"></i> Settings
          </button>
          <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-info-circle me-2"></i> About
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarNavbar;

