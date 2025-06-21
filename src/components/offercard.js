import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";


// Updated OfferCard Component
// const OfferCard = ({ offer }) => {
//   return (
//     <div
//       className="card shadow-sm"
//       style={{
//         backgroundColor: "#f8f9fa",
//         borderRadius: "10px",
//         border: "none",
//         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <div className="card-body">
//         <h5 className="card-title text-dark">{offer.username}'s Offer</h5>
//         <p className="card-text text-muted">
//           <strong>Amount of Space:</strong> {offer.space} <br />
//           <strong>Type of Goods:</strong> {offer.goodsType} <br />
//           <strong>Denomination:</strong> {offer.denomination} <br />
//           <strong>Departure:</strong> {offer.departure} <br />
//           <strong>Destination:</strong> {offer.destination} <br />
//           <strong>Price:</strong> ${offer.price}
//         </p>
//         <button className="btn btn-outline-primary w-100">Contact Now</button>
//       </div>
//     </div>
//   );
// };

// Updated OfferCard Component
const OfferCard = ({ offer }) => {
  const calculateTimeLeft = (expirationDate) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const timeDiff = expiration - now;

    if (timeDiff <= 0) return "Expired";

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);

    return `${days}d ${hours}h left`;
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        border: "none",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="card-body">
        <h5 className="card-title text-dark">{offer.username}'s Offer</h5>
        <p className="card-text text-muted">
          <strong>Amount of Space:</strong> {offer.space} <br />
          <strong>Type of Goods:</strong> {offer.goodsType} <br />
          <strong>Denomination:</strong> {offer.denomination} <br />
          <strong>Departure:</strong> {offer.departure} <br />
          <strong>Destination:</strong> {offer.destination} <br />
          <strong>Price:</strong> ${offer.price}
        </p>
        <p className="text-warning">
          <i className="bi bi-clock"></i> {calculateTimeLeft(offer.expiration)}
        </p>
        <button className="btn btn-outline-primary w-100">Contact Now</button>
      </div>
    </div>
  );
};

export default OfferCard