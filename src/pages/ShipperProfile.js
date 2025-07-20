import React, { useState , useEffect} from 'react';
import { Container, Tab, Tabs, Table, Form, Button, Card , Image, Breadcrumb, Badge, Col, Row, Modal} from 'react-bootstrap';
import { useNavigate, useParams , Link} from "react-router-dom";
import axios from "axios"


const ShipperProfile = () => {
  const [key, setKey] = useState('introduction');
  const [reviews, setReviews] = useState([]);
  const [loading , setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [announcements, setAnnouncements] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [companyReviewId, setCompanyReviewId] = useState("")

  const [companyNameState , setCompanyName] = useState('');

  const { companyName } = useParams();
  const [shipper, setShipper] = useState([]);
  const [leadTimes, setLeadTimes] = useState([]);
  

  const [rates, setRates] = useState({
      general: { sea: { RMB: 15, USD: 1.5 }, air: { RMB: 20, USD: 2.5 }, express: { RMB: 30, USD: 4 } },
      phones: { sea: { RMB: 15, USD: 2 }, air: { RMB: 25, USD: 3 }, express: { RMB: 40, USD: 5 } },
      laptops: { sea: { RMB: 20, USD: 3 }, air: { RMB: 35, USD: 4.5 }, express: { RMB: 50, USD: 6 } },
      electronics: { sea: { RMB: 18, USD: 2.2 }, air: { RMB: 28, USD: 3.2 }, express: { RMB: 45, USD: 5.2 } },
    });


  const [shipperRates , setShipperRates] = useState([]);
  const [companyReviews, setCompanyReviews] = useState([])

  const navigate = useNavigate();

  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(5); // Default to 5
  const [newReview, setNewReview] = useState('');

  const [deliveryCities, setDeliveryCities] = useState([]);

  

  // const handleReviewSubmit = (e) => {
  //   e.preventDefault();
  //   if (newReview.trim()) {
  //     setReviews([...reviews, newReview]);
  //     setNewReview('');
  //   }
  // };

const handleReviewSubmit = async (e) => {
  e.preventDefault();

  const user = localStorage.getItem("user");
  // const author = user ? JSON.parse(user) : "Anonymous"; // Adjust if user is just a string
  const author = user // Adjust if user is just a string


  const reviewData = {
    title: reviewTitle,
    rating: reviewRating,
    content: newReview,
    author: author,
    companyID: shipper[0].completeUserData.userID,
    postedAt: new Date().toISOString(),
  };

  try {
    const response = await axios.post("https://spaceshare-backend.onrender.com/set-reviews", reviewData);
    console.log("Review submitted:", response.data);

    // Optional: clear form
    setReviewTitle("");
    setReviewRating(5);
    setNewReview("");

    // Optional: toast success
  } catch (error) {
    console.error("Failed to submit review:", error);
    // Optional: toast failure
  }
};

  const fetchReviews = async (companyId) => {
    try {

      const response = await axios.post('https://spaceshare-backend.onrender.com/get-reviews', { companyId });
      const data = response.data;

      if (data) setCompanyReviews(data);
      else console.warn("No reviews found.");
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

    const fetchShipper = async () => {
        try {
        setLoading(true);
    
        // 1. Fetch the main shipper document
        const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipper', {
            companyName,
        });
    
        const shipperData = response.data;
        setShipper(shipperData);

        setDeliveryCities(shipperData[0].deliveryCities)

        // 2. Extract and store companyId
        const companyId = shipperData[0].completeUserData.userID;

        setCompanyReviewId(companyReviewId)
    
        // 3. Fetch shipping rates
        const ratesResponse = await axios.post('https://spaceshare-backend.onrender.com/get-rates', { companyId});
        setShipperRates(ratesResponse.data);

        console.log(ratesResponse.data[0])

    
        // 4. Fetch lead times
        const leadTimesResponse = await axios.post('https://spaceshare-backend.onrender.com/get-leadTimes', { companyId});
        setLeadTimes(leadTimesResponse.data);

        const companyReviewResponse = await axios.post('https://spaceshare-backend.onrender.com/get-reviews', { companyId });

        setCompanyReviews(companyReviewResponse.data)

        const announcementsResponse = await axios.post('https://spaceshare-backend.onrender.com/get-announcements', { companyId });
        setAnnouncements(announcementsResponse.data);
        
        } catch (error) {
        console.error("Error loading shipper profile:", error);
        } finally {
        setLoading(false);
        }
    };

    const token = localStorage.getItem('token');
  
  

  useEffect(() => {

    fetchShipper();

    fetchReviews(localStorage.companyId)


  }, [companyReviewId]);

  const formatReviewDate= (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 24) {
        return `Today ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      } else if (diffInHours < 48) {
        return `Yesterday ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      } else {
        return date.toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }

  return (
    <Container className="my-4">

             

    {shipper.length > 0 && (
         <>


       <Breadcrumb className='p-3 rounded'>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/shippers' }}>
                    <Badge bg="primary">All shippers</Badge>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                    <Badge bg="dark">{companyName}</Badge>
                    </Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="mb-3">{companyName}</h2>
      <p><strong>Location:</strong> {shipper[0].completeUserData.hqCity}, {shipper[0].completeUserData.hqCountry}</p>
      <p><strong>Contact:</strong> {shipper[0].completeUserData.email} | {shipper[0].completeUserData.phoneNumber}</p>

      <p><strong>Cities we deliver to: </strong></p>
                  {/* <div className="d-flex flex-wrap gap-2">
                    {shipper[0].deliveryCities.map(city => (
                      <Badge key={city} bg="primary" className="p-2">
                        {city}
                      </Badge>
                    ))}
                  </div> */}

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="introduction" title="Introduction">
            <Card className="p-3 d-flex align-items-center text-center">
                <Image
                   src={shipper[0].completeUserData.avatar} 
                   alt="OceanLink Logo"
                    roundedCircle
                    width={120}
                    height={120}
                    className="mb-3"
                />
                <Card.Body>
                    <Card.Text>
                    {shipper[0].introduction}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Tab>

        <Tab eventKey="rates" title="Rates">
          <h5 className="mt-3">Sea Freight Rates</h5>
                {/* Shipping Rates Card */}
            {shipperRates.length > 0 ? (
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <strong>Shipping Rates</strong>
              </Card.Header>
              <Card.Body>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Sea (RMB/$USD)</th>
                      <th>Air (RMB/USD)</th>
                      <th>Air Express (RMB/USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>General Goods (/kg)</td>
                      <td>
                        {shipperRates[0]?.rates?.general?.sea?.RMB || 'N/A'} / {shipperRates[0]?.rates?.general?.sea?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.general?.air?.RMB || 'N/A'} / {shipperRates[0]?.rates?.general?.air?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.general?.express?.RMB || 'N/A'} / {shipperRates[0]?.rates?.general?.express?.USD || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td>Phones (/pc)</td>
                      <td>
                        {shipperRates[0]?.rates?.phones?.sea?.RMB || 'N/A'} / {shipperRates[0]?.rates?.phones?.sea?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.phones?.air?.RMB || 'N/A'} / {shipperRates[0]?.rates?.phones?.air?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.phones?.express?.RMB || 'N/A'} / {shipperRates[0]?.rates?.phones?.express?.USD || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td>Laptops (/kg)</td>
                      <td>
                        {shipperRates[0]?.rates?.laptops?.sea?.RMB || 'N/A'} / {shipperRates[0]?.rates?.laptops?.sea?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.laptops?.air?.RMB || 'N/A'} / {shipperRates[0]?.rates?.laptops?.air?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.laptops?.express?.RMB || 'N/A'} / {shipperRates[0]?.rates?.laptops?.express?.USD || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td>Other Electronics (/kg)</td>
                      <td>
                        {shipperRates[0]?.rates?.electronics?.sea?.RMB || 'N/A'} / {shipperRates[0]?.rates?.electronics?.sea?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.electronics?.air?.RMB || 'N/A'} / {shipperRates[0]?.rates?.electronics?.air?.USD || 'N/A'}
                      </td>
                      <td>
                        {shipperRates[0]?.rates?.electronics?.express?.RMB || 'N/A'} / {shipperRates[0]?.rates?.electronics?.express?.USD || 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Body>
                <div className="text-muted text-center">
                  This shipper hasn't set their rates yet.
                </div>
              </Card.Body>
            </Card>
          )}
        </Tab>

        <Tab eventKey="leadTimes" title="Lead Times">
              {leadTimes.length > 0 ? (
                <>
                  <Card className="shadow-sm mt-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <strong>Lead Times</strong>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <strong>Sea:</strong> 
                          {leadTimes[0].leadTimes.sea.value} {leadTimes[0].leadTimes.sea.unit}
                        </Col>
                        <Col>
                          <strong>Air:</strong> 
                          {typeof leadTimes[0].leadTimes.air === 'object' 
                            ? `${leadTimes[0].leadTimes.air.value} ${leadTimes[0].leadTimes.air.unit}`
                            : leadTimes[0].leadTimes.air}
                        </Col>
                        <Col>
                          <strong>Air Express:</strong> 
                          {typeof leadTimes[0].leadTimes.express === 'object' 
                            ? `${leadTimes[0].leadTimes.express.value} ${leadTimes[0].leadTimes.express.unit || ''}`
                            : leadTimes[0].leadTimes.express}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <Card className="shadow-sm mt-4">
                  <Card.Body>
                    <div className="text-muted text-center">
                      No lead times set yet. Waiting for the shipper to set.
                    </div>
                  </Card.Body>
                </Card>
              )}
        </Tab>

        <Tab eventKey="announcements" title="Announcements">
          {announcements.length > 0 ? (
            <div className="mt-3">
              {announcements.map((announcement, index) => (
                <Card key={index} className="mb-3 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{announcement.title}</Card.Title>
                      <small className="text-muted">
                        {new Date(announcement.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </small>
                    </div>
                    <Card.Text>{announcement.content}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-sm mt-4">
              <Card.Body>
                <div className="text-muted text-center py-4">
                  This shipper has not published any announcements
                </div>
              </Card.Body>
            </Card>
          )}
        </Tab>

        <Tab eventKey="reviews" title="Reviews">
          
        {token && (
          <Button 
            variant="primary" 
            onClick={handleShow} 
            className="mb-3"
            disabled={!!localStorage.getItem('companyName')}
          >
            Leave a Review
          </Button>
        )}


          <div>
            <h5>All Reviews</h5>
            {companyReviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              
              companyReviews.map((review, index) => (
              <Card key={index} className="mb-2">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    {/* Small circular author image */}
                    <div 
                      className="rounded-circle bg-secondary me-2" 
                      style={{
                        width: '40px', 
                        height: '40px',
                        backgroundImage: `url(${review.authorImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC'})`,
                        backgroundSize: 'cover'
                      }}
                    />
                    
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="mb-0 fw-bold fs-5">{review.title}</Card.Title>
                        <div className="d-flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#e4e5e9' }}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Card.Text className="fs-6">{review.content}</Card.Text>

                    </div>
                  </div>
                      
                      <div className="d-flex align-items-center">
                        <small className="text-muted me-2">{review.author}</small>
                        <small className="text-muted">
                          {formatReviewDate(review.postedAt)}
                        </small>
                      </div>
                  
                </Card.Body>
              </Card>
              ))
            )}
          </div>
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReviewSubmit}>
            {/* Review Title */}
            <Form.Group controlId="reviewTitle" className="mb-3">
              <Form.Label>Review Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a title for your review"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Rating */}
            <Form.Group controlId="reviewRating" className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div className="d-flex align-items-center">
                <span className="me-2">{reviewRating} ★</span>
                <Form.Range
                  min="1"
                  max="5"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                />
              </div>
            </Form.Group>

            {/* Review Textarea */}
            <Form.Group controlId="reviewTextarea" className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Review
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

       </>
    )}
    </Container>
  );
};

export default ShipperProfile;
