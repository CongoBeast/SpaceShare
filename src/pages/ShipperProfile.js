import React, { useState , useEffect} from 'react';
import { Container, Tab, Tabs, Table, Form, Button, Card , Image, Breadcrumb, Badge, Col, Row} from 'react-bootstrap';
import { useNavigate, useParams , Link} from "react-router-dom";
import axios from "axios"


const ShipperProfile = () => {
  const [key, setKey] = useState('introduction');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loading , setLoading] = useState(false);

  const [companyNameState , setCompanyName] = useState('');

  const { companyName } = useParams();
  const [shipper, setShipper] = useState([]);
  const [leadTimes, setLeadTimes] = useState([]);
  

  const [rates, setRates] = useState({
      general: { sea: { RMB: 12, USD: 1.5 }, air: { RMB: 20, USD: 2.5 }, express: { RMB: 30, USD: 4 } },
      phones: { sea: { RMB: 15, USD: 2 }, air: { RMB: 25, USD: 3 }, express: { RMB: 40, USD: 5 } },
      laptops: { sea: { RMB: 20, USD: 3 }, air: { RMB: 35, USD: 4.5 }, express: { RMB: 50, USD: 6 } },
      electronics: { sea: { RMB: 18, USD: 2.2 }, air: { RMB: 28, USD: 3.2 }, express: { RMB: 45, USD: 5.2 } },
    });


  const [shipperRates , setShipperRates] = useState({
    rates: {}
  })

  const navigate = useNavigate();
  

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.trim()) {
      setReviews([...reviews, newReview]);
      setNewReview('');
    }
  };

//   const fetchShipper = async () => {

//     try {
//       setLoading(true); // Start loading
//       const response = await axios.post('http://localhost:3001/get-shipper', {companyName});
//       setShipper(response.data);
//       console.log(response.data)
//     } catch (error) {
//       console.error('Error fetching shipper information:', error);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

    const fetchShipper = async () => {
        try {
        setLoading(true);
    
        // 1. Fetch the main shipper document
        const response = await axios.post('http://localhost:3001/get-shipper', {
            companyName,
        });
    
        const shipperData = response.data;
        setShipper(shipperData);

        // 2. Extract and store companyId
        const companyId = shipperData[0].completeUserData.userID;
    
        // 3. Fetch shipping rates
        const ratesResponse = await axios.post('http://localhost:3001/get-rates', { companyId});
        setShipperRates(ratesResponse.data);
    
        // 4. Fetch lead times
        const leadTimesResponse = await axios.post('http://localhost:3001/get-leadTimes', { companyId});

        console.log(ratesResponse)
    
        const leadTimesData = leadTimesResponse.data;
        if (leadTimesData) {
            setLeadTimes(leadTimesData);
    
        }

        
        } catch (error) {
        console.error("Error loading shipper profile:", error);
        } finally {
        setLoading(false);
        }
    };

    const token = localStorage.getItem('token');
  
  

  useEffect(() => {

    fetchShipper();
  }, [companyName]);

//   console.log(companyName)

    console.log(leadTimes)

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
      <p><strong>Location:</strong> {shipper[0].completeUserData.hqLocation}</p>
      <p><strong>Contact:</strong> {shipper[0].completeUserData.email} | {shipper[0].completeUserData.phoneNumber}</p>

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
                    OceanLink Logistics is a global shipping company offering comprehensive ocean, air, and express freight solutions with a strong focus on timely deliveries and customer satisfaction.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Tab>

        <Tab eventKey="rates" title="Rates">
          <h5 className="mt-3">Sea Freight Rates</h5>
                {/* Shipping Rates Card */}
                {shipperRates.length > 0 && (
                <>
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
                          <td>{rates.general.sea.RMB} / {rates.general.sea.USD}</td>
                          <td>{rates.general.air.RMB} / {rates.general.air.USD}</td>
                          <td>{rates.general.express.RMB} / {rates.general.express.USD}</td>
                        </tr>
                        <tr>
                          <td>Phones (/pc)</td>
                          <td>{rates.phones.sea.RMB} / {rates.phones.sea.USD}</td>
                          <td>{rates.phones.air.RMB} / {rates.phones.air.USD}</td>
                          <td>{rates.phones.express.RMB} / {rates.phones.express.USD}</td>
                        </tr>
                        <tr>
                          <td>Laptops (/kg)</td>
                          <td>{rates.laptops.sea.RMB} / {rates.laptops.sea.USD}</td>
                          <td>{rates.laptops.air.RMB} / {rates.laptops.air.USD}</td>
                          <td>{rates.laptops.express.RMB} / {rates.laptops.express.USD}</td>
                        </tr>
                        <tr>
                          <td>Other Electronics (/kg)</td>
                          <td>{rates.electronics.sea.RMB} / {rates.electronics.sea.USD}</td>
                          <td>{rates.electronics.air.RMB} / {rates.electronics.air.USD}</td>
                          <td>{rates.electronics.express.RMB} / {rates.electronics.express.USD}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
                </>
              )}
        </Tab>

        <Tab eventKey="leadTimes" title="Lead Times">
            {leadTimes.length > 0 && (
                <>
                <Card className="shadow-sm mt-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <strong>Lead Times</strong>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                        <Col><strong>Sea:</strong> {leadTimes[0].leadTimes.sea}</Col>
                        <Col><strong>Air:</strong> {leadTimes[0].leadTimes.air}</Col>
                        <Col><strong>Air Express:</strong> {leadTimes[0].leadTimes.express}</Col>
                        </Row>
                    </Card.Body>
                </Card>
                </>
                )}
        </Tab>

        <Tab eventKey="reviews" title="Reviews">
          
        {token && (
          <Form onSubmit={handleReviewSubmit} className="mb-3 mt-3">
            <Form.Group controlId="reviewTextarea">
              <Form.Label>Leave a Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">Submit</Button>
          </Form>
        )}


          <div>
            <h5>All Reviews</h5>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Card.Text>{review}</Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Tab>
      </Tabs>

       </>
    )}
    </Container>
  );
};

export default ShipperProfile;
