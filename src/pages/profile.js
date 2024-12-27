import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [offerData, setOfferData] = useState({
    space: "",
    goodsType: "",
    denomination: "",
    departure: "",
    destination: "",
    departureDate: "",
    price: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("New Offer Data:", offerData);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="text-center">
        <img
          src="https://via.placeholder.com/150"
          alt="User Avatar"
          className="rounded-circle mb-3"
        />
        <h2>John Doe</h2>
        <p className="text-muted">john.doe@example.com</p>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Offers Made</h5>
              <p className="card-text">5</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Offers Requested</h5>
              <p className="card-text">3</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Requests on Your Offers</h5>
              <p className="card-text">7</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Make New Offer
        </button>
      </div>

      {/* Modal */}
      {showModal && (
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
                  <div className="mb-3">
                    <label htmlFor="space" className="form-label">
                      Amount of Space
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="space"
                      name="space"
                      value={offerData.space}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="goodsType" className="form-label">
                      Type of Goods
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="goodsType"
                      name="goodsType"
                      value={offerData.goodsType}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="denomination" className="form-label">
                      Denomination
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="denomination"
                      name="denomination"
                      value={offerData.denomination}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="departure" className="form-label">
                      Departure
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="departure"
                      name="departure"
                      value={offerData.departure}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="destination" className="form-label">
                      Destination
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="destination"
                      name="destination"
                      value={offerData.destination}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="departureDate" className="form-label">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="departureDate"
                      name="departureDate"
                      value={offerData.departureDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={offerData.price}
                      onChange={handleInputChange}
                    />
                  </div>
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
                >
                  Save Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
