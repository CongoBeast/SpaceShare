import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";

const OfferCard = ({ offer }) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{offer.username}'s Offer</h5>
        <p className="card-text">
          <strong>Amount of Space:</strong> {offer.space} <br />
          <strong>Type of Goods:</strong> {offer.goodsType} <br />
          <strong>Denomination:</strong> {offer.denomination} <br />
          <strong>Departure:</strong> {offer.departure} <br />
          <strong>Destination:</strong> {offer.destination} <br />
          <strong>Date of Departure:</strong> {offer.date} <br />
          <strong>Price:</strong> ${offer.price}
        </p>
        <button className="btn btn-primary">Contact Now</button>
      </div>
    </div>
  );
};

export default OfferCard