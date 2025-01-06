// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../App.css";


// const ProfilePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [offerData, setOfferData] = useState({
//     space: "",
//     goodsType: "",
//     denomination: "",
//     departure: "",
//     destination: "",
//     departureDate: "",
//     price: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setOfferData({ ...offerData, [name]: value });
//   };

//   const handleSubmit = () => {
//     setIsSubmitting(true);

//     // Get user info from localStorage
//     const username = localStorage.getItem("username");
//     const email = localStorage.getItem("email");

//     // Calculate expiration date (2 days after departure date)
//     const departureDate = new Date(offerData.departureDate);
//     const expirationDate = new Date(departureDate);
//     expirationDate.setDate(departureDate.getDate() + 2);

//     // Add username, email, and expiration date to the offer data
//     const offerWithUserData = {
//       ...offerData,
//       username,
//       email,
//       expirationDate: expirationDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
//     };

//     // Submit data to the server
//     fetch("http://localhost:3001/submit-package", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(offerWithUserData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setToastMessage("Offer submitted successfully!");
//         setShowModal(false); // Close modal on success
//       })
//       .catch((error) => {
//         setToastMessage("Failed to submit the offer.");
//         console.error("Error:", error);
//       })
//       .finally(() => {
//         setIsSubmitting(false);
//         setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
//       });
//   };

//   return (
//     <div className="container mt-4">
//       <div className="text-center">
//         <img
//           src="https://via.placeholder.com/150"
//           alt="User Avatar"
//           className="rounded-circle mb-3"
//         />
//         <h2>{localStorage.username}</h2>
//         <p className="text-muted">john.doe@example.com</p>
//       </div>

//       <div className="row mt-4">
//         <div className="col-md-4">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Offers Made</h5>
//               <p className="card-text">5</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Offers Requested</h5>
//               <p className="card-text">3</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Requests on Your Offers</h5>
//               <p className="card-text">7</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="text-center mt-4">
//         <button
//           className="btn btn-primary"
//           onClick={() => setShowModal(true)}
//         >
//           Make New Offer
//         </button>

//         <button
//           className="btn btn-primary"
//           onClick={() => setShowModal(true)}
//         >
//           Change Contact Settings
//         </button>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <>
//           <div className="modal-backdrop fade show"></div>
//           <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">New Offer</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <form>
//                     {["space", "goodsType", "denomination", "departure", "destination", "departureDate", "price"].map(
//                       (field) => (
//                         <div className="mb-3" key={field}>
//                           <label htmlFor={field} className="form-label">
//                             {field.charAt(0).toUpperCase() + field.slice(1)}
//                           </label>
//                           <input
//                             type={field === "departureDate" ? "date" : field === "price" ? "number" : "text"}
//                             className="form-control"
//                             id={field}
//                             name={field}
//                             value={offerData[field]}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                       )
//                     )}
//                   </form>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <span
//                         className="spinner-border spinner-border-sm"
//                         role="status"
//                         aria-hidden="true"
//                       ></span>
//                     ) : (
//                       "Save Offer"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Toast */}
//       {toastMessage && (
//         <div
//           className="toast show position-fixed bottom-0 end-0 m-3"
//           style={{ zIndex: 1055 }}
//         >
//           <div className="toast-body">{toastMessage}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default ProfilePage;


// export default ProfilePage;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import { Link, useLocation, useNavigate } from "react-router-dom";


const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [offerData, setOfferData] = useState({
    space: "",
    goodsType: "",
    denomination: "",
    departure: "",
    destination: "",
    departureDate: "",
    price: "",
  });

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Get user info from localStorage
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    // Calculate expiration date (2 days after departure date)
    const departureDate = new Date(offerData.departureDate);
    const expirationDate = new Date(departureDate);
    expirationDate.setDate(departureDate.getDate() + 2);

    // Add username, email, and expiration date to the offer data
    const offerWithUserData = {
      ...offerData,
      username,
      email,
      expirationDate: expirationDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    };

    // Submit data to the server
    fetch("http://localhost:3001/submit-package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offerWithUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        setToastMessage("Offer submitted successfully!");
        setShowModal(false); // Close modal on success
      })
      .catch((error) => {
        setToastMessage("Failed to submit the offer.");
        console.error("Error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
      });
  };

  return (
    <div className="container mt-4">
      <div className="text-center">
        <img
          src="https://via.placeholder.com/150"
          alt="User Avatar"
          className="rounded-circle mb-3"
        />
        <h2>{localStorage.username}</h2>
        <p className="text-muted">john.doe@example.com</p>
      </div>

      <div className="row mt-4">
        {/* Stat Cards with Gradient Backgrounds */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm gradient-card-1 text-white">
            <div className="card-body">
              <h2 className="card-title mb-0">5</h2>
              <p className="card-text small">Offers Made</p>
              <button className="btn btn-light btn-sm mt-2" onClick={() => handleNavClick('/myoffers')}>
                <i className="bi bi-card-list me-2"></i> View My Offers
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm gradient-card-2 text-white">
            <div className="card-body">
              <h2 className="card-title mb-0">3</h2>
              <p className="card-text small">Offers Requested</p>
              <button className="btn btn-light btn-sm mt-2" onClick={() => handleNavClick('/myrequests')}>
                <i className="bi bi-envelope-open me-2"></i> View My Requests
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm gradient-card-3 text-white">
            <div className="card-body">
              <h2 className="card-title mb-0">7</h2>
              <p className="card-text small">Requests on Your Offers</p>
              <button className="btn btn-light btn-sm mt-2" onClick={() => handleNavClick('/offerrequests')}>
                <i className="bi bi-people-fill me-2"></i> View Offer Requests
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary me-3"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i> Make New Offer
        </button>

        <button
          className="btn btn-secondary me-3"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-gear-fill me-2"></i> Change Contact Settings
        </button>

        <button
          className="btn btn-danger me-3 "
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-trash-fill me-2"></i> Delete Account
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">New Offer</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    {["space", "goodsType", "denomination", "departure", "destination", "departureDate", "price"].map(
                      (field) => (
                        <div className="mb-3" key={field}>
                          <label htmlFor={field} className="form-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type={field === "departureDate" ? "date" : field === "price" ? "number" : "text"}
                            className="form-control"
                            id={field}
                            name={field}
                            value={offerData[field]}
                            onChange={handleInputChange}
                          />
                        </div>
                      )
                    )}
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Save Offer"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          style={{ zIndex: 1055 }}
        >
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
