import React, { useState, useEffect } from "react";
import { Tabs, Tab, ListGroup, Badge } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NotificationsPage = () => {
  const [key, setKey] = useState("unread");
  const [notifications, setNotifications] = useState({ unread: [], read: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from the backend
  useEffect(() => {
    const username = localStorage.user; // Replace with the actual username
    axios
      .post("https://spaceshare-backend.onrender.com/get-notifications", { username })
      .then((response) => {
        const fetchedNotifications = response.data;
        const unread = fetchedNotifications.filter((n) => !n.read);
        const read = fetchedNotifications.filter((n) => n.read);

        setNotifications({ unread, read });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to fetch notifications.");
        setLoading(false);
      });
  }, []);


  const markAsRead = (id) => {
    axios
      .put(`https://spaceshare-backend.onrender.com/edit-request/${id}`, { read: true })
      .then(() => {
        // Update local state after marking as read
        setNotifications((prev) => {
          const updatedUnread = prev.unread.filter((n) => n._id !== id);
          const updatedRead = [...prev.read, prev.unread.find((n) => n._id === id)];
          return { unread: updatedUnread, read: updatedRead };
        });
      })
      .catch((err) => {
        console.error("Failed to mark notification as read:", err);
      });
  };

  // const renderNotification = (notification) => (
  //   <ListGroup.Item key={notification._id} className="d-flex justify-content-between align-items-start">
  //     <div>
  //       <div className="fw-bold">{notification.description}</div>
  //       <small className="text-muted">{notification.date}</small>
  //     </div>
  //     <Badge bg="primary" pill>
  //       <i className="bi bi-bell"></i>
  //     </Badge>
  //   </ListGroup.Item>
  // );

  const renderNotification = (notification, isUnread = false) => (
    <ListGroup.Item key={notification._id} className="d-flex justify-content-between align-items-start">
      <div>
        <div className="fw-bold">{notification.description}</div>
        <small className="text-muted">{notification.date}</small>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Badge bg="primary" pill>
          <i className="bi bi-bell"></i>
        </Badge>
        {isUnread && (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => markAsRead(notification._id)}
          >
            Mark as Read
          </button>
        )}
      </div>
    </ListGroup.Item>
  );

  if (loading) {
    return <p className="text-center mt-3">Loading notifications...</p>;
  }

  if (error) {
    return <p className="text-center text-danger mt-3">{error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Notifications</h2>
      <Tabs
        id="notifications-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
            <Tab eventKey="unread">
              <ListGroup>
                {notifications.unread.length > 0 ? (
                  notifications.unread.map((n) => renderNotification(n, true))
                ) : (
                  <p className="text-center mt-3">No unread notifications.</p>
                )}
              </ListGroup>
            </Tab>

            <Tab eventKey="read" >
              <ListGroup>
                {notifications.read.length > 0 ? (
                  notifications.read.map((n) => renderNotification(n))
                ) : (
                  <p className="text-center mt-3">No read notifications.</p>
                )}
              </ListGroup>
            </Tab>
        </Tabs>
    </div>
  );
};

export default NotificationsPage;


