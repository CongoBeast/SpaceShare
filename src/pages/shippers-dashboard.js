import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Modal, Form, Table,Image, Badge} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"
import isEqual from 'lodash.isequal';
import CitySelector from "../components/citySelector.js";

const ShipperDashboard = () => {

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currencyRate, setCurrencyRate] = useState(0);
  const [loading , setLoading] = useState(true)
  const [shipper , setShipper] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "James Banda",
    phoneNumber: "+86 132 4567 8901",
    email: "james.banda@example.com",
    city: "Guangzhou",
    country: "China",
    avatar: "https://i.pravatar.cc/100?img=3",
    companyName: "",
  });

  const [rates, setRates] = useState({
    general: { sea: { RMB: 12, USD: 1.5 }, air: { RMB: 20, USD: 2.5 }, express: { RMB: 30, USD: 4 } },
    phones: { sea: { RMB: 15, USD: 2 }, air: { RMB: 25, USD: 3 }, express: { RMB: 40, USD: 5 } },
    laptops: { sea: { RMB: 20, USD: 3 }, air: { RMB: 35, USD: 4.5 }, express: { RMB: 50, USD: 6 } },
    electronics: { sea: { RMB: 18, USD: 2.2 }, air: { RMB: 28, USD: 3.2 }, express: { RMB: 45, USD: 5.2 } },
  });

  const [shipperRates , setShipperRates] = useState({
    rates: {}
  })

  const [showLeadTimesModal, setShowLeadTimesModal] = useState(false);
  const [leadTimes, setLeadTimes] = useState([]);

  const [leadTimeInputs, setLeadTimeInputs] = useState({
    sea: { value: "3", unit: "months" },
    air: { value: "2", unit: "weeks" },
    express: { value: "1", unit: "week" },
  });


  const [deliveryCities, setDeliveryCities] = useState([]);
  const [showCitiesModal, setShowCitiesModal] = useState(false);

  const [showIntroductionModal, setShowIntroductionModal] = useState(false);

  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [newAvatar , setNewAvatar] = useState("")


  const [introductionText, setIntroductionText] = useState(
    shipper[0]?.completeUserData?.introduction || ""
  );

  const fetchShipper = async () => {
    try {
      const companyName = localStorage.companyName

      setLoading(true);
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-shipper', { companyName });
      const shipperData = response.data;

      setShipper(shipperData);

      setDeliveryCities(shipperData[0].deliveryCities);

      setUserInfo({
      companyName: shipperData[0].completeUserData.companyName || '',
      phoneNumber: shipperData[0].completeUserData.phoneNumber || '',
      email: shipperData[0].completeUserData.email || '',
      city: shipperData[0].completeUserData.hqCity || '',
      country: shipperData[0].completeUserData.hqCountry || '',
    });

      return shipperData; // 🔁 return the data here
    } catch (error) {
      console.error('Error fetching shipper information:', error);
      throw error; // so it can be caught in fetchAll
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLeadTimes = async (e) => {

    e.preventDefault();

    setIsSaving(true);
  
    console.log("This is the lead time input" , leadTimeInputs)

    console.log(e)
  
    // const isUpdate = !!leadTimes[0]._id; // if you have the ID, you're updating

    const isUpdate = leadTimes.length > 0 && !!leadTimes[0]?._id;

  
    const payload = {
      // _id: leadTimes[0]._id, // set this if updating
      ...(isUpdate && { _id: leadTimes[0]._id }),
      companyName: localStorage.companyName || '',
      companyId: localStorage.companyId || '',
      lastEdit: new Date().toISOString(),
      leadTimes: leadTimeInputs,
    };
  
    // const endpoint = leadTimes[0]._id ? '/update-leadTimes' : '/set-leadTimes';
    const endpoint = isUpdate ? '/update-leadTimes' : '/set-leadTimes';

  
    try {
      const res = await axios.post(`https://spaceshare-backend.onrender.com${endpoint}`, payload);
      console.log('Lead times saved:', res.data);
      setLeadTimes(leadTimeInputs);
      setShowLeadTimesModal(false);
    } catch (err) {
      console.error('Error saving lead times:', err);
      alert("Failed to save lead times. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  
  const handleSaveRates = async () => {
    setIsSaving(true);

    var isUpdate = false 
    
    if(shipperRates.length > 0){
      // isUpdate = !!shipperRates[0]._id; // if you have the ID, you're updating
      isUpdate = true; // if you have the ID, you're updating

    }
    else{
      isUpdate = false
    }
  
    const payload = {
      ...(isUpdate && { _id: shipperRates[0]._id }),
      companyName: localStorage.companyName || '',
      companyId: localStorage.companyId || '',
      lastEdit: new Date().toISOString(),
      currencyRate: parseFloat(currencyRate),
      rates,
    };
  
    const endpoint = isUpdate ? '/update-rate' : '/set-rate';
  
    try {
      const res = await axios.post(`https://spaceshare-backend.onrender.com${endpoint}`, payload);
      console.log(`${isUpdate ? 'Updated' : 'Saved'}:`, res.data);
      setShowRatesModal(false);
    } catch (err) {
      console.error(`Error ${isUpdate ? 'updating' : 'saving'} rates:`, err);
      alert(`Failed to ${isUpdate ? 'update' : 'save'} rates. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const saveSelectedCities = async (savedCities) => {

    console.log(savedCities)

    const isUpdate = !!shipper[0].deliveryCities;

    const payload = {
      filter: {
        _id: shipper[0]._id  // For MongoDB Data API
      },
      update: {
          deliveryCities: savedCities
      }
    };

    try {
      const res = await axios.post(`https://spaceshare-backend.onrender.com/update-shipper`, payload);
      setIsSaving(true);
      console.log("Updated the shipper with cities", res.data);
      setShowCitiesModal(false);
    } catch (err) {
      console.error("Error updating shipper: ", err);
      alert("Failed to update");
    } finally {

      setShipper(prev => {
      const updated = [...prev];
      updated[0].deliveryCities = savedCities;
      return updated;
    });
      setIsSaving(false);
    }
    
  }

  const fetchRates = async (companyId) => {
    try {
      const response = await axios.post('https://spaceshare-backend.onrender.com/get-rates', { companyId });
      const data = response.data;

      if (data) setShipperRates(data);
      else console.warn("No rates found.");
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

    const fetchLeadTimes = async (companyId) => {
      try {
        const response = await axios.post('https://spaceshare-backend.onrender.com/get-leadTimes', { companyId });
        const data = response.data;

        if (data && !isEqual(leadTimes, data)) {
          setLeadTimes(data);

        
        setLeadTimeInputs(data);
        }
      } catch (error) {
        console.error("Error fetching lead times:", error);
      }
    };

  const fetchAll = async () => {
      try {
        const shipperData = await fetchShipper(); // make fetchShipper return shipperData
        const companyId = shipperData[0]?.completeUserData?.userID;

        localStorage.setItem('companyId' , companyId)

        
  
        if (companyId) {
          await fetchRates(companyId);
          await fetchLeadTimes(companyId);
        } else {
          console.warn("No companyId found in shipper data.");
        }
      } catch (error) {
        console.error("Failed to fetch shipper or related data:", error);
      }

    };

  useEffect(() => {
    fetchAll();
  }, []);



    const handleShipperProfile = () => {
    // console.log("navigate button clicked")
    navigate(`/shipper-profile/${localStorage.companyName}`)
  }

  const handleSaveIntroduction = async () => {
  setIsSaving(true);
  
  try {

    const payload = {
      filter: {
        _id: shipper[0]._id  // For MongoDB Data API
      },
      update: {
          introduction: introductionText
      }
    };

    const res = await axios.post('https://spaceshare-backend.onrender.com/update-shipper', payload);
    console.log("Introduction updated:", res.data);
    
    // Update local state
    setShipper(prev => {
      const updated = [...prev];
      updated[0].introduction = introductionText;
      return updated;
    });
    
    setShowCitiesModal(false);
  } catch (err) {
    console.error("Error updating introduction:", err);
    alert("Failed to update introduction. Please try again.");
  } finally {
    setIsSaving(false);
    setShowIntroductionModal(false)
  }
};

  const handleSaveUserInfo = async () => {
    setIsSaving(true);
    
    try {
      const payload = {
        filter: {
          _id: shipper[0]._id
        },
        update: {
          "completeUserData.companyName": userInfo.companyName,
          "completeUserData.phoneNumber": userInfo.phoneNumber,
          "completeUserData.email": userInfo.email,
          "completeUserData.hqCity": userInfo.city,
          "completeUserData.hqCountry": userInfo.country,
        }
      };

      console.log(payload)

      const res = await axios.post('https://spaceshare-backend.onrender.com/update-shipper', payload);
      console.log("User info updated:", res.data);
      
      // Update local state to match your nested structure
      setShipper(prev => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          completeUserData: {
            ...updated[0].completeUserData,
            companyName: userInfo.companyName,
            phoneNumber: userInfo.phoneNumber,
            email: userInfo.email,
            hqCity: userInfo.hqCity,
            hqCountry: userInfo.hqCountry
          },
          introduction: userInfo.introduction
        };
        return updated;
      });
      
      setShowInfoModal(false);
    } catch (err) {
      console.error("Error updating user info:", err);
      alert("Failed to update user info. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };


  // Handler for image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for submitting the new profile picture
  const handleProfilePicSubmit = async () => {
    if (!selectedFile) return;

    let avatarUrl = '';
    
    try {
      // Here you would typically upload the image to your server
      // For example:
      // const formData = new FormData();
      // formData.append('profilePicture', selectedFile);
      // await axios.put('/api/update-profile-picture', formData);

       const formDataImage = new FormData();
       formDataImage.append('image', selectedFile);
        
       const uploadRes = await axios.post('https://spaceshare-backend.onrender.com/upload', formDataImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
              },
       });
        
      avatarUrl = uploadRes.data.url;
      
      // After successful upload:
      // 1. Update your state or refetch user data
      // 2. Close the modal and reset preview
      setShowProfilePicModal(false);
      setPreviewImage(null);
      setSelectedFile(null);
      
      // Show success message
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Failed to update profile picture');
    }
  };

  return (
    <Container className="mt-4">
      {/* Greeting */}
      
      {!loading && shipper && shipper[0] && shipper[0].completeUserData && (
            <>
                <Row className="align-items-center mb-4">
                  <Col md="auto">
                      <Image
                      src={shipper[0].completeUserData.avatar}
                      roundedCircle
                      width={200}
                      height={200}
                      alt="avatar"
                      />
                  </Col>
                  <Col>
                      <h4 className="mb-0">
                        Welcome, {shipper[0].completeUserData.companyName}!
                      </h4>
                      <div className="text-muted">
                        Manage your shipping profile and rates
                      </div>

                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowProfilePicModal(true)}
                        className="mt-2"
                      >
                        Change Profile Picture
                      </Button>
                  </Col>
                </Row>

                
                <Card className="mb-4 shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                      <strong>Basic Information</strong>
                      <Button size="sm" onClick={() => setShowInfoModal(true)}>Edit Info</Button>
                  </Card.Header>
                      <Card.Body>
                          <Row>
                          <Col><strong>Name:</strong> {shipper[0].completeUserData.companyName}</Col>
                          <Col><strong>Phone:</strong> {shipper[0].completeUserData.phoneNumber}</Col>
                          </Row>
                          <Row className="mt-2">
                          <Col><strong>Email:</strong> {shipper[0].completeUserData.email}</Col>
                          <Col><strong>HQ:</strong> {shipper[0].completeUserData.hqCity}, {shipper[0].completeUserData.hqCountry}</Col>
                          </Row>
                          {/* <Row className="mt-2">
                          <Col><strong>Introduction:</strong> {shipper[0].introduction}</Col>
                          </Row> */}
                      </Card.Body>
                </Card>
            </>
            )}
 
      {/* {shipper[0].completeUserData.introduction ? ( */}
      {!loading && shipper[0].introduction ? (
            <>    
                <Card className="mb-4 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <strong>Basic Introduction</strong>
                    <Button size="sm" onClick={() => setShowIntroductionModal(true)}>Edit Intro</Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mt-2">
                    <Col>{shipper[0].introduction}</Col>
                    </Row>
                </Card.Body>
                </Card>
            </>
            ) : (
      <Alert variant="warning" className="d-flex justify-content-between align-items-center">
        <span>No company introduction set yet.</span>
        <Button size="sm" variant="primary" onClick={() => setShowIntroductionModal(true)}>
          Set Introduction
        </Button>
      </Alert>
    )}

    {!loading && deliveryCities.length > 0 ? (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <strong>African Cities We Deliver To</strong>
            <Button size="sm" onClick={() => setShowCitiesModal(true)}>
              Edit Cities
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {shipper[0].deliveryCities.map(city => (
                <Badge key={city} bg="primary" className="p-2">
                  {city}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning" className="d-flex justify-content-between align-items-center">
          <span>No delivery cities set yet.</span>
          <Button size="sm" variant="primary" onClick={() => setShowCitiesModal(true)}>
            Set Delivery Cities
          </Button>
        </Alert>
      )}

      {/* Shipping Rates Card */}
      {!loading  && shipperRates.length > 0 ? (
      <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <strong>Shipping Rates</strong>
          <Button size="sm" onClick={() => setShowRatesModal(true)}>Edit Rates</Button>
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
                <td>{shipperRates[0].rates.general.sea.RMB} / {shipperRates[0].rates.general.sea.USD}</td>
                <td>{shipperRates[0].rates.general.air.RMB} / {shipperRates[0].rates.general.air.USD}</td>
                <td>{shipperRates[0].rates.general.express.RMB} / {shipperRates[0].rates.general.express.USD}</td>
              </tr>
              <tr>
                <td>Phones (/pc)</td>
                <td>{shipperRates[0].rates.phones.sea.RMB} / {shipperRates[0].rates.phones.sea.USD}</td>
                <td>{shipperRates[0].rates.phones.air.RMB} / {shipperRates[0].rates.phones.air.USD}</td>
                <td>{shipperRates[0].rates.phones.express.RMB} / {shipperRates[0].rates.phones.express.USD}</td>
              </tr>
              <tr>
                <td>Laptops (/kg)</td>
                <td>{shipperRates[0].rates.laptops.sea.RMB} / {shipperRates[0].rates.laptops.sea.USD}</td>
                <td>{shipperRates[0].rates.laptops.air.RMB} / {shipperRates[0].rates.laptops.air.USD}</td>
                <td>{shipperRates[0].rates.laptops.express.RMB} / {shipperRates[0].rates.laptops.express.USD}</td>
              </tr>
              <tr>
                <td>Other Electronics (/kg)</td>
                <td>{shipperRates[0].rates.electronics.sea.RMB} / {shipperRates[0].rates.electronics.sea.USD}</td>
                <td>{shipperRates[0].rates.electronics.air.RMB} / {shipperRates[0].rates.electronics.air.USD}</td>
                <td>{shipperRates[0].rates.electronics.express.RMB} / {shipperRates[0].rates.electronics.express.USD}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      </>
     ) : (
      <Alert variant="warning" className="d-flex justify-content-between align-items-center">
        <span>No shipping rates set for your company yet.</span>
        <Button size="sm" variant="primary" onClick={() => setShowRatesModal(true)}>
          Set Rates
        </Button>
      </Alert>
    )}
    
     {!loading && leadTimes.length > 0 ? (
      <>
      <Card className="shadow-sm mt-4 mb-5">
        <Card.Header className="d-flex justify-content-between align-items-center">
            <strong>Lead Times</strong>
            <Button size="sm" onClick={() => setShowLeadTimesModal(true)}>Edit Lead Times</Button>
        </Card.Header>
        <Card.Body>
            <Row>
            <Col><strong>Sea:</strong> {leadTimes[0].leadTimes.sea.value} {leadTimes[0].leadTimes.sea.unit}</Col>
            <Col><strong>Air:</strong> {leadTimes[0].leadTimes.air.value} {leadTimes[0].leadTimes.air.unit}</Col>
            <Col><strong>Air Express:</strong> {leadTimes[0].leadTimes.express.value} {leadTimes[0].leadTimes.express.unit}</Col>
            </Row>
        </Card.Body>
    </Card>
    </>
    ): (
    <Alert variant="warning" className="d-flex justify-content-between align-items-center  mt-4">
      <span>No lead times set for your company yet.</span>
      <Button size="sm" variant="primary" onClick={() => setShowLeadTimesModal(true)}>
      {/* <Button size="sm" variant="primary" onClick={() => console.log(leadTimeInputs)}> */}
        Lead Times
      </Button>
    </Alert>
    )} 

    {/* {!loading && (
    <Button size="lg" variant='primary' onClick={handleShipperProfile}>
      View Company Profile
    </Button>
    )} */}

      {/* Edit Info Modal */}
      {!loading && (
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Basic Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={userInfo.companyName}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={userInfo.phoneNumber}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                value={userInfo.city}
                onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={userInfo.country}
                onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Company Introduction</Form.Label>
              <Form.Control
                as="textarea"  // This changes it to a textarea
                rows={3}      // You can adjust the number of rows as needed
                value={shipper[0].completeUserData.introduction || ''}  // Make sure to use the correct property name
                onChange={(e) => setUserInfo({ ...userInfo, introduction: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfoModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveUserInfo}
            >Save
          </Button>
        </Modal.Footer>
      </Modal>
      )}

      {/* Edit Rates Modal (simplified) */}
      <Modal show={showRatesModal} onHide={() => setShowRatesModal(false)} centered size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Edit Shipping Rates</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <Form.Group className="mb-3">
            <Form.Label>Currency Rate (RMB to USD)</Form.Label>
            <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter currency rate"
                value={currencyRate}
                onChange={(e) => setCurrencyRate(e.target.value)}
            />
            </Form.Group>

            <Form>
            {["general", "phones", "laptops", "electronics"].map((itemKey) => (
                <div key={itemKey} className="mb-4">
                <h5 className="text-capitalize">{itemKey.replace(/([a-z])([A-Z])/g, '$1 $2')}</h5>
                {["sea", "air", "express"].map((mode) => (
                    <div key={mode} className="d-flex mb-2 align-items-center">
                    <strong className="me-3 text-capitalize" style={{ width: "120px" }}>{mode}:</strong>
                    <Form.Control
                        type="number"
                        placeholder="RMB"
                        value={rates[itemKey][mode].RMB}
                        onChange={(e) =>
                        setRates((prev) => ({
                            ...prev,
                            [itemKey]: {
                            ...prev[itemKey],
                            [mode]: {
                                ...prev[itemKey][mode],
                                RMB: e.target.value,
                            },
                            },
                        }))
                        }
                        className="me-2"
                    />
                    <Form.Control
                        type="number"
                        placeholder="USD"
                        value={rates[itemKey][mode].USD}
                        onChange={(e) =>
                        setRates((prev) => ({
                            ...prev,
                            [itemKey]: {
                            ...prev[itemKey],
                            [mode]: {
                                ...prev[itemKey][mode],
                                USD: e.target.value,
                            },
                            },
                        }))
                        }
                    />
                    </div>
                ))}
                </div>
            ))}
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRatesModal(false)}>Cancel</Button>

            <Button variant="primary" onClick={handleSaveRates} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
            </Button>

        </Modal.Footer>
      </Modal>

      {/* <Modal show={showLeadTimesModal} onHide={() => setShowLeadTimesModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Lead Times</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <Form>
            {["sea", "air", "express"].map((mode) => (
              <Form.Group key={mode} className="mb-3">
                <Form.Label className="text-capitalize">{mode} Shipping</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    min="1"
                    // value={leadTimeInputs[mode][value]}
                    value={3}
                    onChange={(e) =>
                      setLeadTimeInputs((prev) => ({
                        ...prev,
                        [mode]: {
                          ...prev[mode],
                          value: e.target.value,
                        },
                      }))
                    }
                    className="me-2"
                    style={{ maxWidth: "100px" }}
                  />
                  <Form.Select
                    // value={leadTimeInputs[mode][unit]}
                    value={3}
                    onChange={(e) =>
                      setLeadTimeInputs((prev) => ({
                        ...prev,
                        [mode]: {
                          ...prev[mode],
                          unit: e.target.value,
                        },
                      }))
                    }
                    style={{ maxWidth: "150px" }}
                  >
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </Form.Select>
                </div>
              </Form.Group>
            ))}
          </Form> 

        </Modal.Body> 
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeadTimesModal(false)}>
            Cancel
          </Button>
          <Button variant="primary"
          //  onClick={handleSaveLeadTimes}
          onClick={(e) => handleSaveLeadTimes(e)}  
          disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>  */}
      <Modal show={showLeadTimesModal} onHide={() => setShowLeadTimesModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Lead Times</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["sea", "air", "express"].map((mode) => (
              <Form.Group key={mode} className="mb-3">
                <Form.Label className="text-capitalize">{mode} Shipping</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    min="1"
                    value={leadTimeInputs[mode]?.value || ''}
                     // Use actual state
                    onChange={(e) =>
                      setLeadTimeInputs((prev) => ({
                        ...prev,
                        [mode]: {
                          ...prev[mode],
                          value: e.target.value,
                        },
                      }))
                    }
                    className="me-2"
                    style={{ maxWidth: "100px" }}
                  />
                  <Form.Select
                    value={leadTimeInputs[mode]?.unit || 'days'}  // Use actual state
                    onChange={(e) =>
                      setLeadTimeInputs((prev) => ({
                        ...prev,
                        [mode]: {
                          ...prev[mode],
                          unit: e.target.value,
                        },
                      }))
                    }
                    style={{ maxWidth: "150px" }}
                  >
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </Form.Select>
                </div>
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeadTimesModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleSaveLeadTimes}  // No need for arrow function
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showIntroductionModal} onHide={() => setShowIntroductionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Company Introduction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="companyIntroduction">
            <Form.Label>Company Introduction</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={introductionText}
              onChange={(e) => setIntroductionText(e.target.value)}
              placeholder="Tell us about your company, services, and specialties..."
            />
            <Form.Text className="text-muted">
              This will be displayed on your public profile (500 characters max)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowIntroductionModal(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveIntroduction}
            disabled={isSaving || !introductionText.trim()}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              "Save Introduction"
            )}
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Profile Picture Modal */}
      <Modal show={showProfilePicModal} onHide={() => setShowProfilePicModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            {/* Current Profile Picture Preview */}
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Preview" 
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <img 
                src={shipper[0]?.completeUserData?.avatar || '/default-profile.png'} 
                alt="Current Profile" 
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            )}
            
            {/* File Upload Input */}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload new profile picture</Form.Label>
              <Form.Control 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Recommended size: 300x300 pixels
              </Form.Text>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setPreviewImage(null);
            setShowProfilePicModal(false);
          }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleProfilePicSubmit}
            disabled={!previewImage}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

       {/* City Selection Modal */}
      <Modal show={showCitiesModal} onHide={() => setShowCitiesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select African Delivery Cities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CitySelector 
            selectedCities={deliveryCities} 
            setSelectedCities={setDeliveryCities} 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCitiesModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              // You might want to save to your backend here
              saveSelectedCities(deliveryCities)
              setShowCitiesModal(false);
            }}

            disabled={isSaving}
          >
            Save Cities
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default ShipperDashboard;
