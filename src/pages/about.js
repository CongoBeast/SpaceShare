import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AboutPage = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-header text-white" style={{ backgroundColor: "#0d6efd" }}>
          <h3 className="mb-0">About Meli-Flow</h3>
        </div>
        <div className="card-body">
          <p className="lead">
            Meli-Flow is a platform that connects travelers with excess luggage space to 
            individuals or businesses needing to transport goods. Our mission is to provide 
            a cost-effective and efficient solution for luggage sharing, promoting sustainability 
            and convenience.
          </p>

          <h5 className="mt-4 text-primary">Contact Information</h5>
          <ul className="list-unstyled">
            <li><strong>Email:</strong> support@meliflow.com</li>
            <li><strong>Phone:</strong> +1 (123) 456-7890</li>
            <li><strong>Address:</strong> 123 Luggage St., Travel City, TX 75001</li>
          </ul>

          <div className="mt-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
            <h6 className="text-danger">Important Disclaimer</h6>
            <p className="mb-2">
              By signing up for and using Meli-Flow, you acknowledge and agree that the company 
              is not responsible or liable for any legal issues, disputes, damages, theft, or 
              problems regarding your packages. All risks, including those involving package 
              delays, loss, or damage, are solely the responsibility of the user.
            </p>
            <p className="mb-0">
              It is the user’s duty to <strong>verify and check packages</strong> they receive 
              before embarking on their journeys. Users must also ensure compliance with all legal 
              and regulatory requirements, including customs and border clearances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
