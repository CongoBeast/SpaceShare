import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import { Link, useLocation, useNavigate } from "react-router-dom";


const SidebarNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar for medium and larger screens */}
      <div
        className={`d-none d-md-flex flex-column bg-primary text-white sidebar ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="p-3 text-center">
          <h4>My App</h4>
        </div>
        <div className="nav flex-column nav-pills">
         <Link to="/" className="nav-link text-white">
            <button className="btn btn-primary text-white mb-2">
                <i className="bi bi-house me-2"></i> Home
            </button>
          </Link>
          <Link to="/profile" className="nav-link text-white">
            <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-person me-2"></i> Profile
            </button>
          </Link>
          <Link to="/about" className="nav-link text-white">
            <button className="btn btn-primary text-white mb-2">
            <i className="bi bi-gear me-2"></i> About
            </button>
          </Link>
         
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

