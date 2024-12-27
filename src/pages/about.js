import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AboutPage = () => {
    return (
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title">About LuggageSpace</h3>
            <p className="card-text">
             SpaceShare is a platform that connects travelers with excess luggage space to individuals or businesses needing to transport goods. We aim to provide a cost-effective and efficient solution for luggage sharing, promoting sustainability and convenience.
            </p>
            <h5>Contact Information</h5>
            <p className="card-text">
              <strong>Email:</strong> support@luggagespace.com <br />
              <strong>Phone:</strong> +1 (123) 456-7890 <br />
              <strong>Address:</strong> 123 Luggage St., Travel City, TX 75001
            </p>
            <p className="text-muted mt-3" style={{ fontSize: "0.9rem" }}>
              Disclaimer: SpaceShare is a facilitator platform and does not directly handle or transport goods. Users are responsible for complying with all legal and regulatory requirements when transporting items. This includes clearing of goods at designated country entry and exit points. We are not liable to any damages on goods to any extent.
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default AboutPage