import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import OfferCard from './offercard'

const MarketOffers = () => {
    const offers = [
      {
        username: "JohnDoe",
        space: "20kg",
        goodsType: "Clothes",
        denomination: "Bags",
        departure: "New York",
        destination: "London",
        date: "2024-12-30",
        price: 100,
      },
      {
        username: "JaneSmith",
        space: "10kg",
        goodsType: "Documents",
        denomination: "Envelopes",
        departure: "Paris",
        destination: "Berlin",
        date: "2024-12-29",
        price: 50,
      },
      {
        username: "TravelGuru",
        space: "15kg",
        goodsType: "Phones",
        denomination: "Boxes",
        departure: "Tokyo",
        destination: "Seoul",
        date: "2024-12-28",
        price: 80,
      },
    ];
  
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Current Market Offers</h2>
        <div className="row">
          {offers.map((offer, index) => (
            <div className="col-md-4" key={index}>
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default MarketOffers
  