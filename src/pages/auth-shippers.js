// import default AuthPage;
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ToggleButtonGroup, ToggleButton, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthShipperPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userID: "",
    companyName: '',
    password: '',
    email: '',
    confirmPassword: '',
    phoneNumber: { countryCode: '', number: '' },
    weChatId: '',
    registrationDate: '',
    lastLoggedIn: '',
    hqCity: '',
    hqCountry: '',
    transportModes: [],
    avatar: '',
    introduction: '',
    deliveryCities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  const defaultRates = {
    general: { sea: { RMB: 12, USD: 1.5 }, air: { RMB: 20, USD: 2.5 }, express: { RMB: 30, USD: 4 } },
    phones: { sea: { RMB: 15, USD: 2 }, air: { RMB: 25, USD: 3 }, express: { RMB: 40, USD: 5 } },
    laptops: { sea: { RMB: 20, USD: 3 }, air: { RMB: 35, USD: 4.5 }, express: { RMB: 50, USD: 6 } },
    electronics: { sea: { RMB: 18, USD: 2.2 }, air: { RMB: 28, USD: 3.2 }, express: { RMB: 45, USD: 5.2 } },
  };

  const handleToggle = (value) => {
    setIsLogin(value === 1);
    setFormData({
      ...formData,
      email: '',
      confirmPassword: '',
      phoneNumber: { countryCode: '', number: '' },
      weChatId: '',
      hqCity: '',
      hqCountry: '',
      transportModes: [],
    });
    setError('');
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'countryCode' || name === 'number') {
      setFormData({
        ...formData,
        phoneNumber: { ...formData.phoneNumber, [name]: value },
      });
    } else if (name === 'transportModes') {
      const options = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({ ...formData, transportModes: options });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!isLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Invalid email address');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const generateUserID = (companyName) => {
    const base = companyName.trim().toLowerCase().replace(/\s+/g, '-');
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 12);
    return `${base}-${timestamp}`;
  };

  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
  
  //   setLoading(true);
  //   const endpoint = isLogin ? 'login-shipper' : 'register-shipper';
  
  //   try {
  //     let avatarUrl = '';
  
  //     // Upload avatar image to Cloudinary if file exists
  //     if (!isLogin && avatarFile) {
  //       const formDataImage = new FormData();
  //       formDataImage.append('image', avatarFile); // "image" matches multer's `upload.single('image')`
        
  //       const uploadRes = await axios.post('http://localhost:3001/upload', formDataImage, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
        
  //       avatarUrl = uploadRes.data.url;
  //     }
  
  //     const userID = generateUserID(formData.companyName);
  //     const hqLocation = `${formData.hqCity}, ${formData.hqCountry}`;
  
  //     const requestData = {
  //       ...formData,
  //       companyName: formData.companyName,
  //       userID,
  //       hqLocation,
  //       avatar: avatarUrl, // ✅ add uploaded image URL
  //       phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
  //       registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
  //       lastLoggedIn: new Date().toISOString(),
  //     };
  
  //     console.log(requestData);
  
  //     const notificationString = isLogin
  //       ? 'Your login was successful'
  //       : 'The account registration was successful';
  
  //     const response = await axios.post(`http://localhost:3001/${endpoint}`, requestData);
  //     setLoading(false);
  
  //     if (response.data.token) {
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('companyId', userID);
  //       localStorage.setItem('companyName', formData.companyName);
  //       navigate('/shipper-dashboard');
  
  //       const notificationData = {
  //         description: notificationString,
  //         date: new Date().toISOString(),
  //         read: false,
  //         username: formData.companyName,
  //       };
  
  //       axios.post('http://localhost:3001/set-notification', notificationData);
  //     } else {
  //       setMessage('Operation successful');
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     setError(error.response ? error.response.data.message : 'An error occurred');
  //   }
  // };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    const endpoint = isLogin ? 'login-shipper' : 'register-shipper';
  
    try {
      let avatarUrl = '';
  
      // Upload avatar image to Cloudinary if file exists
      if (!isLogin && avatarFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', avatarFile);
  
        const uploadRes = await axios.post('https://spaceshare-backend.onrender.com/upload', formDataImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        avatarUrl = uploadRes.data.url;
      }
  
      const userID = generateUserID(formData.companyName);
      const hqLocation = `${formData.hqCity}, ${formData.hqCountry}`;
  
      const requestData = {
        ...formData,
        companyName: formData.companyName,
        userID,
        hqLocation,
        avatar: avatarUrl,
        phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
        registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
        lastLoggedIn: new Date().toISOString(),
      };
  
      console.log(requestData);
  
      const notificationString = isLogin
        ? 'Your login was successful'
        : 'The account registration was successful';
  
      const response = await axios.post(`https://spaceshare-backend.onrender.com/${endpoint}`, requestData);
      setLoading(false);
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('companyId', userID);
        localStorage.setItem('companyName', formData.companyName);
  
        // ✅ Initialize rates for the new shipper
        const ratePayload = {
          userID: userID,
          companyName: formData.companyName,
          rates: defaultRates,
          createdAt: new Date().toISOString(),
        };
  
        // try {
        //   await axios.post('http://localhost:3001/set-rate', ratePayload);
        //   console.log('Rates initialized successfully');
        // } catch (rateError) {
        //   console.error('Failed to initialize rates:', rateError);
        // }
  
        navigate('/shipper-dashboard');
  
        const notificationData = {
          description: notificationString,
          date: new Date().toISOString(),
          read: false,
          username: formData.companyName,
        };
  
        axios.post('https://spaceshare-backend.onrender.com/set-notification', notificationData);
      } else {
        setMessage('Operation successful');
      }
    } catch (error) {
      setLoading(false);
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <ToggleButtonGroup type="radio" name="authType" defaultValue={1} className="mb-3" onChange={handleToggle}>
            <ToggleButton id="tbg-radio-1" value={1} variant="outline-primary">Sign In</ToggleButton>
            <ToggleButton id="tbg-radio-2" value={2} variant="outline-success">Sign Up</ToggleButton>
          </ToggleButtonGroup>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            )}

            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            {!isLogin && (
              <>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Row>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Country Code"
                        name="countryCode"
                        value={formData.phoneNumber.countryCode}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        name="number"
                        value={formData.phoneNumber.number}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="formWeChatId">
                  <Form.Label>WeChat ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter WeChat ID"
                    name="weChatId"
                    value={formData.weChatId}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>HQ City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Harare"
                    name="hqCity"
                    value={formData.hqCity}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>HQ Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Zimbabwe"
                    name="hqCountry"
                    value={formData.hqCountry}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Transport Modes</Form.Label>
                  <Form.Control
                    as="select"
                    name="transportModes"
                    multiple
                    value={formData.transportModes}
                    onChange={handleChange}
                  >
                    <option value="Sea">Sea</option>
                    <option value="Air">Air</option>
                    <option value="Air Express">Air Express</option>
                  </Form.Control>
                  <Form.Text className="text-muted">Hold Ctrl (or Cmd on Mac) to select multiple.</Form.Text>
                </Form.Group>


                <Form.Group controlId="formAvatar">
                  <Form.Label>Upload Company Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                  />
                </Form.Group>

              </>
            )}

            <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthShipperPage;
