// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../App.css";
// import OfferCard from "./offercard";

// // const MarketOffers = () => {
// //   const [search, setSearch] = useState("");
// //   const [filter, setFilter] = useState("");

// //   const offers = [
// //     {
// //       username: "JohnDoe",
// //       space: "20kg",
// //       goodsType: "Clothes",
// //       denomination: "Bags",
// //       departure: "New York",
// //       destination: "London",
// //       date: "2024-12-30",
// //       price: 100,
// //     },
// //     {
// //       username: "JaneSmith",
// //       space: "10kg",
// //       goodsType: "Documents",
// //       denomination: "Envelopes",
// //       departure: "Paris",
// //       destination: "Berlin",
// //       date: "2024-12-29",
// //       price: 50,
// //     },
// //     {
// //       username: "TravelGuru",
// //       space: "15kg",
// //       goodsType: "Phones",
// //       denomination: "Boxes",
// //       departure: "Tokyo",
// //       destination: "Seoul",
// //       date: "2024-12-28",
// //       price: 80,
// //     },
// //     {
// //       username: "ExplorerJoe",
// //       space: "30kg",
// //       goodsType: "Shoes",
// //       denomination: "Cartons",
// //       departure: "Berlin",
// //       destination: "New York",
// //       date: "2024-12-28",
// //       price: 120,
// //     },
// //   ];

// //   // Filtered and grouped offers
// //   const filteredOffers = offers.filter(
// //     (offer) =>
// //       offer.departure.toLowerCase().includes(search.toLowerCase()) ||
// //       offer.destination.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const groupedOffers = filteredOffers.reduce((acc, offer) => {
// //     (acc[offer.date] = acc[offer.date] || []).push(offer);
// //     return acc;
// //   }, {});

// //   return (
// //     <div className="container mt-4">
// //       <h2 className="mb-4">Current Market Offers</h2>
// //       {/* Search and Filter */}
// //       <div className="mb-4 d-flex">
// //         <input
// //           type="text"
// //           className="form-control me-2"
// //           placeholder="Search by location (e.g., New York, Berlin)"
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //         />
// //         <select
// //           className="form-select"
// //           value={filter}
// //           onChange={(e) => setFilter(e.target.value)}
// //         >
// //           <option value="">All</option>
// //           <option value="departure">Filter by Departure</option>
// //           <option value="destination">Filter by Destination</option>
// //         </select>
// //       </div>

// //       {/* Grouped Offers by Date */}
// //       {Object.keys(groupedOffers).map((date) => (
// //         <div key={date}>
// //           <h4 className="text-primary mt-3">{`Offers for ${date}`}</h4>
// //           <div className="row">
// //             {groupedOffers[date].map((offer, index) => (
// //               <div className="col-md-4 mb-3" key={index}>
// //                 <OfferCard offer={offer} />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// const MarketOffers = () => {
//     const [search, setSearch] = useState("");
  
//     const offers = [
//       {
//         username: "JohnDoe",
//         space: "20kg",
//         goodsType: "Clothes",
//         denomination: "Bags",
//         departure: "New York",
//         destination: "London",
//         datePosted: "2024-12-01",
//         dateDeparture: "2024-12-30",
//         dateExpiration: "2024-12-31",
//         price: 100,
//       },
//       {
//         username: "JaneSmith",
//         space: "10kg",
//         goodsType: "Documents",
//         denomination: "Envelopes",
//         departure: "Paris",
//         destination: "Berlin",
//         datePosted: "2024-12-05",
//         dateDeparture: "2024-12-29",
//         dateExpiration: "2024-12-31",
//         price: 50,
//       },
//       {
//         username: "TravelGuru",
//         space: "15kg",
//         goodsType: "Phones",
//         denomination: "Boxes",
//         departure: "Tokyo",
//         destination: "Seoul",
//         datePosted: "2024-11-15",
//         dateDeparture: "2024-11-28",
//         dateExpiration: "2024-11-30",
//         price: 80,
//       },
//       {
//         username: "ExplorerJoe",
//         space: "30kg",
//         goodsType: "Shoes",
//         denomination: "Cartons",
//         departure: "Berlin",
//         destination: "New York",
//         datePosted: "2024-11-10",
//         dateDeparture: "2024-11-27",
//         dateExpiration: "2024-11-30",
//         price: 120,
//       },
//       {
//         username: "FutureOffer",
//         space: "25kg",
//         goodsType: "Books",
//         denomination: "Boxes",
//         departure: "Rome",
//         destination: "Madrid",
//         datePosted: "2025-01-01",
//         dateDeparture: "2025-01-15",
//         dateExpiration: "2025-01-20",
//         price: 70,
//       },
//     ];
  
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1;
//     const currentYear = currentDate.getFullYear();
//     const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
//     const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  
//     // Group offers by months
//     const groupedOffers = {
//       thisMonth: [],
//       lastMonth: [],
//       later: [],
//     };
  
//     offers.forEach((offer) => {
//       const datePosted = new Date(offer.datePosted);
//       const offerMonth = datePosted.getMonth() + 1;
//       const offerYear = datePosted.getFullYear();
  
//       if (offerMonth === currentMonth && offerYear === currentYear) {
//         groupedOffers.thisMonth.push(offer);
//       } else if (offerMonth === lastMonth && offerYear === lastMonthYear) {
//         groupedOffers.lastMonth.push(offer);
//       } else {
//         groupedOffers.later.push(offer);
//       }
//     });
  
//     // Filter offers by search input
//     const filterOffers = (offers) =>
//       offers.filter(
//         (offer) =>
//           offer.departure.toLowerCase().includes(search.toLowerCase()) ||
//           offer.destination.toLowerCase().includes(search.toLowerCase())
//       );
  
//     return (
//       <div className="container mt-4">
//         <h2 className="mb-4">Current Market Offers</h2>
  
//         <div className="mb-4">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by departure or destination"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
  
//         {["thisMonth", "lastMonth", "later"].map((group) => (
//           <div key={group} className="mb-5">
//             <h4 className="text-capitalize">
//               {group === "thisMonth"
//                 ? "This Month"
//                 : group === "lastMonth"
//                 ? "Last Month"
//                 : "Later"}
//             </h4>
//             <div className="row">
//               {filterOffers(groupedOffers[group]).map((offer, index) => (
//                 <div className="col-md-4" key={index}>
//                   <div
//                     className="card shadow-sm mb-4"
//                     style={{
//                       borderRadius: "8px",
//                       backgroundColor: "#f8f9fa",
//                     }}
//                   >
//                     <div className="card-body">
//                       <h5 className="card-title">{offer.username}</h5>
//                       <p className="card-text">
//                         <strong>Space:</strong> {offer.space} <br />
//                         <strong>Goods Type:</strong> {offer.goodsType} ({offer.denomination}) <br />
//                         <strong>Departure:</strong> {offer.departure} <br />
//                         <strong>Destination:</strong> {offer.destination} <br />
//                         <strong>Date Posted:</strong> {offer.datePosted} <br />
//                         <strong>Departure Date:</strong> {offer.dateDeparture} <br />
//                         <strong>Expiration Date:</strong> {offer.dateExpiration} <br />
//                         <strong>Price:</strong> ${offer.price}
//                       </p>
//                       <div className="d-flex align-items-center">
//                         <i className="bi bi-clock me-2 text-warning"></i>
//                         <span>
//                           Expires on {new Date(offer.dateExpiration).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };
  
//   export default MarketOffers;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";

const MarketOffers = () => {
  const [view, setView] = useState("buyers"); // "buyers" or "sellers"
  const [search, setSearch] = useState("");

  const buyers = [
    {
      username: "BuyerOne",
      spaceNeeded: "10kg",
      goodsType: "Books",
      departure: "Rome",
      destination: "Madrid",
      datePosted: "2024-12-10",
      dateDeparture: "2024-12-15",
      dateExpiration: "2024-12-20",
    },
    {
      username: "BuyerTwo",
      spaceNeeded: "5kg",
      goodsType: "Electronics",
      departure: "Berlin",
      destination: "Paris",
      datePosted: "2024-12-05",
      dateDeparture: "2024-12-12",
      dateExpiration: "2024-12-18",
    },
  ];

  const sellers = [
    {
      username: "JohnDoe",
      spaceAvailable: "20kg",
      goodsType: "Clothes",
      departure: "New York",
      destination: "London",
      datePosted: "2024-12-01",
      dateDeparture: "2024-12-30",
      dateExpiration: "2024-12-31",
      price: 100,
    },
    {
      username: "JaneSmith",
      spaceAvailable: "10kg",
      goodsType: "Documents",
      departure: "Paris",
      destination: "Berlin",
      datePosted: "2024-12-05",
      dateDeparture: "2024-12-29",
      dateExpiration: "2024-12-31",
      price: 50,
    },
  ];

  // Filter data by search input
  const filterOffers = (offers) =>
    offers.filter(
      (offer) =>
        offer.departure.toLowerCase().includes(search.toLowerCase()) ||
        offer.destination.toLowerCase().includes(search.toLowerCase())
    );

const contactClick = () => {
    console.log("clicked")
}

  const renderOfferCard = (offer, type) => (
    <div className="col-md-4" key={offer.username + offer.datePosted}>
      <div
        className="card shadow-sm mb-4"
        style={{
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="card-body">
          <h5 className="card-title">{offer.username}</h5>
          <p className="card-text">
            {type === "buyers" ? (
              <>
                <strong>Space Needed:</strong> {offer.spaceNeeded} <br />
              </>
            ) : (
              <>
                <strong>Space Available:</strong> {offer.spaceAvailable} <br />
                <strong>Price:</strong> ${offer.price} <br />
              </>
            )}
            <strong>Goods Type:</strong> {offer.goodsType} <br />
            <strong>Departure:</strong> {offer.departure} <br />
            <strong>Destination:</strong> {offer.destination} <br />
            <strong>Date Posted:</strong> {offer.datePosted} <br />
            <strong>Departure Date:</strong> {offer.dateDeparture} <br />
            <strong>Expiration Date:</strong> {offer.dateExpiration} <br />
          </p>
          <div className="d-flex align-items-center">
            <i className="bi bi-clock me-2 text-warning"></i>
            <span>
              Expires on {new Date(offer.dateExpiration).toLocaleDateString()}
            </span>
          </div>
          <button className="btn btn-primary text-white mb-2" onClick={contactClick}>
            Send Contact Request
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Current Market Offers</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by departure or destination"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs for Buyers and Sellers */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${view === "buyers" ? "active" : ""}`}
            onClick={() => setView("buyers")}
          >
            I want to buy luggage space
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${view === "sellers" ? "active" : ""}`}
            onClick={() => setView("sellers")}
          >
            I want to buy luggage space
          </button>
        </li>
      </ul>

      <div className="row mt-4">
        {view === "buyers" &&
          filterOffers(buyers).map((offer) => renderOfferCard(offer, "buyers"))}
        {view === "sellers" &&
          filterOffers(sellers).map((offer) =>
            renderOfferCard(offer, "sellers")
          )}
      </div>
    </div>
  );
};

export default MarketOffers;