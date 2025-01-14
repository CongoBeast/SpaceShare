// import React, { useState } from "react";
// import { Tabs, Tab, ListGroup, Badge } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// const NotificationsPage = () => {
//   const [key, setKey] = useState("unread");

//   // Sample notifications data
//   const notifications = {
//     unread: [
//       { id: 1, message: "Your offer was submitted successfully.", time: "2 hours ago" },
//       { id: 2, message: "Your offer was clicked by a user.", time: "5 hours ago" },
//       { id: 3, message: "Your offer has expired.", time: "1 day ago" },
//     ],
//     read: [
//       { id: 4, message: "You logged in to your account.", time: "2 days ago" },
//       { id: 5, message: "Your password was changed successfully.", time: "3 days ago" },
//     ],
//   };

//   const renderNotification = (notification) => (
//     <ListGroup.Item key={notification.id} className="d-flex justify-content-between align-items-start">
//       <div>
//         <div className="fw-bold">{notification.message}</div>
//         <small className="text-muted">{notification.time}</small>
//       </div>
//       <Badge bg="primary" pill>
//         <i className="bi bi-bell"></i>
//       </Badge>
//     </ListGroup.Item>
//   );

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">Notifications</h2>
//       <Tabs
//         id="notifications-tabs"
//         activeKey={key}
//         onSelect={(k) => setKey(k)}
//         className="mb-3"
//       >
//         <Tab
//           eventKey="unread"
//           title={
//             <span>
//               <i className="bi bi-envelope-fill me-2"></i>Unread
//               <Badge bg="danger" className="ms-2">
//                 {notifications.unread.length}
//               </Badge>
//             </span>
//           }
//         >
//           <ListGroup>
//             {notifications.unread.length > 0 ? (
//               notifications.unread.map(renderNotification)
//             ) : (
//               <p className="text-center mt-3">No unread notifications.</p>
//             )}
//           </ListGroup>
//         </Tab>
//         <Tab
//           eventKey="read"
//           title={
//             <span>
//               <i className="bi bi-envelope-open-fill me-2"></i>Read
//             </span>
//           }
//         >
//           <ListGroup>
//             {notifications.read.length > 0 ? (
//               notifications.read.map(renderNotification)
//             ) : (
//               <p className="text-center mt-3">No read notifications.</p>
//             )}
//           </ListGroup>
//         </Tab>
//       </Tabs>
//     </div>
//   );
// };

// export default NotificationsPage;

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
      .post("http://localhost:3001/get-notifications", { username })
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

  const renderNotification = (notification) => (
    <ListGroup.Item key={notification._id} className="d-flex justify-content-between align-items-start">
      <div>
        <div className="fw-bold">{notification.description}</div>
        <small className="text-muted">{notification.date}</small>
      </div>
      <Badge bg="primary" pill>
        <i className="bi bi-bell"></i>
      </Badge>
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
        <Tab
          eventKey="unread"
          title={
            <span>
              <i className="bi bi-envelope-fill me-2"></i>Unread
              <Badge bg="danger" className="ms-2">
                {notifications.unread.length}
              </Badge>
            </span>
          }
        >
          <ListGroup>
            {notifications.unread.length > 0 ? (
              notifications.unread.map(renderNotification)
            ) : (
              <p className="text-center mt-3">No unread notifications.</p>
            )}
          </ListGroup>
        </Tab>
        <Tab
          eventKey="read"
          title={
            <span>
              <i className="bi bi-envelope-open-fill me-2"></i>Read
            </span>
          }
        >
          <ListGroup>
            {notifications.read.length > 0 ? (
              notifications.read.map(renderNotification)
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
