import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from "react-bootstrap";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useLocation , useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";


import { RxDashboard, RxPinLeft } from "react-icons/rx";
import { GiTruck } from "react-icons/gi";
import { IoPieChartSharp } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { GiCoalWagon } from "react-icons/gi";
import { BiSupport } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import { RiAlarmWarningFill } from "react-icons/ri";
import { FaHome , FaTruck} from "react-icons/fa";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import { FaNewspaper } from "react-icons/fa6";
import { BiLogInCircle } from "react-icons/bi";



function TopNavBar() {

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

  const handleLogout = () => {
    // Remove token from local storage and update state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
  };

  return (
    // <Navbar collapseOnSelect expand="md" className="bg-body-tertiary d-lg-none mb-3 mx p-1">
    <Navbar 
      collapseOnSelect 
      expand="md" 
      style={{ backgroundColor: '#3a0ca3' }} 
      className="mb-3 mx p-1 navbar-dark d-lg-none"
      onToggle={() => setIsOpen(!isOpen)}
      expanded={isOpen}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white">
          <img 
            src="https://github.com/CongoBeast/SpaceShare/blob/main/public/Meli-removebg-preview.png?raw=true" 
            alt="Imat Tech Logo"
            style={{ maxHeight: "50px", maxWidth: "50px" }}
            className="d-flex align-items-center"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="border-0" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto" style={{ textAlign: "right" }}>
            <Nav.Link 
              as={Link}
              to="/"
              className={`text-left d-flex align-items-center text-white ${isLinkActive("/") ? "active" : ""}`}
              style={{ marginBottom: "1rem" }}
              onClick={() => setIsOpen(false)}
            >
              <FaHome />
              <span style={{ marginLeft: "1rem" }}>Home</span>
            </Nav.Link>

            {!isLoggedIn && (
              <Nav.Link
                as={Link}
                to="/auth"
                className={`text-left d-flex align-items-center text-white ${isLinkActive("/auth") ? "active" : ""}`}
                style={{ marginBottom: "1rem" }}
                onClick={() => setIsOpen(false)}
              >
                <BiLogInCircle />
                <span style={{ marginLeft: "1rem" }}>Client Login</span>
              </Nav.Link>
            )}

            <Nav.Link 
              as={Link}
              to="/profile"
              className={`text-left d-flex align-items-center text-white ${isLinkActive("/profile") ? "active" : ""}`}
              style={{ marginBottom: "1rem" }}
              onClick={() => setIsOpen(false)}
            >
              <FaNewspaper />
              <span style={{ marginLeft: "1rem" }}>Profile</span>
            </Nav.Link>

            <Nav.Link 
              as={Link}
              to="/shippers"
              className={`text-left d-flex align-items-center text-white ${isLinkActive("/shippers") ? "active" : ""}`}
              style={{ marginBottom: "1rem" }}
              onClick={() => setIsOpen(false)}
            >
              <FaTruck />
              <span style={{ marginLeft: "1rem" }}>Pro Shippers</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/about"
              className={`text-left d-flex align-items-center text-white ${isLinkActive("/about") ? "active" : ""}`}
              style={{ marginBottom: "1rem" }}
              onClick={() => setIsOpen(false)}
            >
              <IoIosInformationCircle />
              <span style={{ marginLeft: "1rem" }}>About Us</span>
            </Nav.Link>

            {isLoggedIn && (
              <>
                <Nav.Link
                  as={Link}
                  to="/notifications"
                  className={`text-left d-flex align-items-center text-white ${isLinkActive("/notifications") ? "active" : ""}`}
                  style={{ marginBottom: "1rem" }}
                  onClick={() => setIsOpen(false)}
                >
                  <IoIosInformationCircle />
                  <span style={{ marginLeft: "1rem" }}>Notifications</span>
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-left d-flex align-items-center text-white"
                  style={{ marginBottom: "1rem" }}
                >
                  <span style={{ marginLeft: "1rem" }}>Logout</span>
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