// // import default AuthPage;
// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, ToggleButtonGroup, ToggleButton, Spinner, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AuthShipperPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     userID: "",
//     companyName: '',
//     password: '',
//     email: '',
//     confirmPassword: '',
//     phoneNumber: { countryCode: '', number: '' },
//     weChatId: '',
//     registrationDate: '',
//     lastLoggedIn: '',
//     hqCity: '',
//     hqCountry: '',
//     transportModes: [],
//     avatar: '',
//     introduction: '',
//     shippingAddress: '',
//     deliveryCities: []
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [avatarFile, setAvatarFile] = useState(null);
//   const navigate = useNavigate();

//   const defaultRates = {
//     general: { sea: { RMB: 12, USD: 1.5 }, air: { RMB: 20, USD: 2.5 }, express: { RMB: 30, USD: 4 } },
//     phones: { sea: { RMB: 15, USD: 2 }, air: { RMB: 25, USD: 3 }, express: { RMB: 40, USD: 5 } },
//     laptops: { sea: { RMB: 20, USD: 3 }, air: { RMB: 35, USD: 4.5 }, express: { RMB: 50, USD: 6 } },
//     electronics: { sea: { RMB: 18, USD: 2.2 }, air: { RMB: 28, USD: 3.2 }, express: { RMB: 45, USD: 5.2 } },
//   };

//   const handleToggle = (value) => {
//     setIsLogin(value === 1);
//     setFormData({
//       ...formData,
//       email: '',
//       confirmPassword: '',
//       phoneNumber: { countryCode: '', number: '' },
//       weChatId: '',
//       hqCity: '',
//       hqCountry: '',
//       transportModes: [],
//     });
//     setError('');
//     setMessage('');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'countryCode' || name === 'number') {
//       setFormData({
//         ...formData,
//         phoneNumber: { ...formData.phoneNumber, [name]: value },
//       });
//     } else if (name === 'transportModes') {
//       const options = Array.from(e.target.selectedOptions, (option) => option.value);
//       setFormData({ ...formData, transportModes: options });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const validateForm = () => {
//     if (!isLogin) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email)) {
//         setError('Invalid email address');
//         return false;
//       }
//       if (formData.password !== formData.confirmPassword) {
//         setError('Passwords do not match');
//         return false;
//       }
//     }
//     return true;
//   };

//   const generateUserID = (companyName) => {
//     const base = companyName.trim().toLowerCase().replace(/\s+/g, '-');
//     const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 12);
//     return `${base}-${timestamp}`;
//   };
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
  
//     setLoading(true);
//     const endpoint = isLogin ? 'login-shipper' : 'register-shipper';
  
//     try {
//       let avatarUrl = '';
  
//       // Upload avatar image to Cloudinary if file exists
//       if (!isLogin && avatarFile) {
//         const formDataImage = new FormData();
//         formDataImage.append('image', avatarFile);
  
//         const uploadRes = await axios.post('https://spaceshare-backend.onrender.com/upload', formDataImage, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
  
//         avatarUrl = uploadRes.data.url;
//       }
  
//       const userID = generateUserID(formData.companyName);
//       const hqLocation = `${formData.hqCity}, ${formData.hqCountry}`;
  
//       const requestData = {
//         ...formData,
//         companyName: formData.companyName,
//         userID,
//         hqLocation,
//         avatar: avatarUrl,
//         phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
//         registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
//         lastLoggedIn: new Date().toISOString(),
//       };
  
//       console.log(requestData);
  
//       const notificationString = isLogin
//         ? 'Your login was successful'
//         : 'The account registration was successful';
  
//       const response = await axios.post(`https://spaceshare-backend.onrender.com/${endpoint}`, requestData);
//       setLoading(false);
  
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('companyId', userID);
//         localStorage.setItem('companyName', formData.companyName);
  
//         // ✅ Initialize rates for the new shipper
//         const ratePayload = {
//           userID: userID,
//           companyName: formData.companyName,
//           rates: defaultRates,
//           createdAt: new Date().toISOString(),
//         };
  
//         // try {
//         //   await axios.post('http://localhost:3001/set-rate', ratePayload);
//         //   console.log('Rates initialized successfully');
//         // } catch (rateError) {
//         //   console.error('Failed to initialize rates:', rateError);
//         // }
  
//         navigate('/shipper-dashboard');
  
//         const notificationData = {
//           description: notificationString,
//           date: new Date().toISOString(),
//           read: false,
//           username: formData.companyName,
//         };
  
//         axios.post('https://spaceshare-backend.onrender.com/set-notification', notificationData);
//       } else {
//         setMessage('Operation successful');
//       }
//     } catch (error) {
//       setLoading(false);
//       setError(error.response ? error.response.data.message : 'An error occurred');
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-md-center">
//         <Col md={6}>
//           <ToggleButtonGroup type="radio" name="authType" defaultValue={1} className="mb-3" onChange={handleToggle}>
//             <ToggleButton id="tbg-radio-1" value={1} variant="outline-primary">Sign In</ToggleButton>
//             <ToggleButton id="tbg-radio-2" value={2} variant="outline-success">Sign Up</ToggleButton>
//           </ToggleButtonGroup>

//           {error && <Alert variant="danger">{error}</Alert>}
//           {message && <Alert variant="success">{message}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             {!isLogin && (
//               <Form.Group controlId="formEmail">
//                 <Form.Label>Email address</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             )}

//             <Form.Group controlId="formCompanyName">
//               <Form.Label>Company Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter company name"
//                 name="companyName"
//                 value={formData.companyName}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Form.Group controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             {!isLogin && (
//               <>
//                 <Form.Group controlId="formConfirmPassword">
//                   <Form.Label>Confirm Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     placeholder="Confirm Password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 <Form.Group>
//                   <Form.Label>Phone Number</Form.Label>
//                   <Row>
//                     <Col md={4}>
//                       <Form.Control
//                         type="text"
//                         placeholder="Country Code"
//                         name="countryCode"
//                         value={formData.phoneNumber.countryCode}
//                         onChange={handleChange}
//                       />
//                     </Col>
//                     <Col md={8}>
//                       <Form.Control
//                         type="text"
//                         placeholder="Phone Number"
//                         name="number"
//                         value={formData.phoneNumber.number}
//                         onChange={handleChange}
//                       />
//                     </Col>
//                   </Row>
//                 </Form.Group>

//                 <Form.Group controlId="formWeChatId">
//                   <Form.Label>WeChat ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter WeChat ID"
//                     name="weChatId"
//                     value={formData.weChatId}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 <Form.Group>
//                   <Form.Label>HQ City</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="e.g., Harare"
//                     name="hqCity"
//                     value={formData.hqCity}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 <Form.Group>
//                   <Form.Label>HQ Country</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="e.g., Zimbabwe"
//                     name="hqCountry"
//                     value={formData.hqCountry}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 <Form.Group>
//                   <Form.Label>Transport Modes</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="transportModes"
//                     multiple
//                     value={formData.transportModes}
//                     onChange={handleChange}
//                   >
//                     <option value="Sea">Sea</option>
//                     <option value="Air">Air</option>
//                     <option value="Air Express">Air Express</option>
//                   </Form.Control>
//                   <Form.Text className="text-muted">Hold Ctrl (or Cmd on Mac) to select multiple.</Form.Text>
//                 </Form.Group>


//                 <Form.Group controlId="formAvatar">
//                   <Form.Label>Upload Company Logo</Form.Label>
//                   <Form.Control
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setAvatarFile(e.target.files[0])}
//                   />
//                 </Form.Group>

//               </>
//             )}

//             <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
//               {loading ? (
//                 <Spinner as="span" animation="border" size="sm" />
//               ) : isLogin ? 'Sign In' : 'Sign Up'}
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AuthShipperPage;
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Building, Lock, Mail, Phone, Upload, Eye, EyeOff, MapPin, Truck } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthShipperPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
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
    shippingAddress: '',
    deliveryCities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
  
      const userID = generateUserID(formData.companyName.trim());
      const hqLocation = `${formData.hqCity}, ${formData.hqCountry}`;
  
      const requestData = {
        ...formData,
        companyName: formData.companyName.trim(),
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

  const customStyles = {
    authBackground: {
      background: 'linear-gradient(135deg, #F8F4FF 0%, #E8D5FF 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    },
    authCard: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 20px 40px rgba(139, 69, 187, 0.15)',
      overflow: 'hidden',
      border: 'none',
      maxWidth: '800px',
      width: '100%',
      margin: '0 auto'
    },
    authHeader: {
      background: 'linear-gradient(135deg, #8B45BB 0%, #B565D8 100%)',
      color: 'white',
      padding: '3rem 2rem 2rem',
      textAlign: 'center',
      position: 'relative'
    },
    authHeaderOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    authBody: {
      padding: '2.5rem',
      background: '#F8F4FF'
    },
    toggleButton: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'transparent',
      color: 'white',
      borderRadius: '2rem',
      padding: '0.7rem 2rem',
      margin: '0 0.5rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      cursor: 'pointer'
    },
    toggleButtonActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'white',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '1.5rem'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#8B45BB',
      zIndex: 10
    },
    formControl: {
      border: '2px solid #E8D5FF',
      borderRadius: '1rem',
      padding: '1rem 1rem 1rem 3rem',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      boxShadow: '0 4px 15px rgba(139, 69, 187, 0.08)',
      width: '100%'
    },
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#8B45BB',
      cursor: 'pointer',
      zIndex: 10,
      padding: '0.5rem'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #8B45BB 0%, #B565D8 100%)',
      border: 'none',
      borderRadius: '1rem',
      padding: '1rem 2rem',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.1rem',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(139, 69, 187, 0.3)'
    },
    avatarUpload: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '3px dashed #B565D8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'rgba(181, 101, 216, 0.1)'
    },
    avatarPreview: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%'
    },
    alert: {
      borderRadius: '1rem',
      border: 'none',
      padding: '1rem 1.5rem',
      marginBottom: '1.5rem',
      fontWeight: '500'
    },
    alertDanger: {
      backgroundColor: '#fff5f5',
      color: '#dc2626',
      borderLeft: '4px solid #dc2626'
    },
    alertSuccess: {
      backgroundColor: '#f0fff4',
      color: '#16a34a',
      borderLeft: '4px solid #16a34a'
    }
  };

  return (
    <div style={customStyles.authBackground}>
      <Container>
        <div style={customStyles.authCard}>
          {/* Header */}
          <div style={customStyles.authHeader}>
            <div style={customStyles.authHeaderOverlay}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Shipper Portal
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
                {isLogin ? 'Sign in to your shipping account' : 'Register your shipping company'}
              </p>
              
              {/* Toggle Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  style={{
                    ...customStyles.toggleButton,
                    ...(isLogin ? customStyles.toggleButtonActive : {})
                  }}
                  onClick={() => handleToggle(1)}
                >
                  Sign In
                </button>
                <button
                  style={{
                    ...customStyles.toggleButton,
                    ...(!isLogin ? customStyles.toggleButtonActive : {})
                  }}
                  onClick={() => handleToggle(2)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div style={customStyles.authBody}>
            {error && (
              <div style={{...customStyles.alert, ...customStyles.alertDanger}}>
                {error}
              </div>
            )}
            {message && (
              <div style={{...customStyles.alert, ...customStyles.alertSuccess}}>
                {message}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Avatar Upload (Registration Only) */}
              {!isLogin && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div 
                    style={customStyles.avatarUpload}
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Company logo preview" style={customStyles.avatarPreview} />
                    ) : (
                      <Upload color="#B565D8" size={32} />
                    )}
                  </div>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <small style={{ color: '#B565D8', fontSize: '0.9rem' }}>
                    Click to upload company logo
                  </small>
                </div>
              )}

              {/* Email (Registration Only) */}
              {!isLogin && (
                <div style={customStyles.inputGroup}>
                  <Mail style={customStyles.inputIcon} size={20} />
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={customStyles.formControl}
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Company Name */}
              <div style={customStyles.inputGroup}>
                <Building style={customStyles.inputIcon} size={20} />
                <Form.Control
                  type="text"
                  placeholder="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  style={customStyles.formControl}
                  required
                />
              </div>

              {/* Password */}
              <div style={customStyles.inputGroup}>
                <Lock style={customStyles.inputIcon} size={20} />
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{...customStyles.formControl, paddingRight: '3.5rem'}}
                  required
                />
                <button
                  type="button"
                  style={customStyles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Registration-only fields */}
              {!isLogin && (
                <>
                  {/* Confirm Password */}
                  <div style={customStyles.inputGroup}>
                    <Lock style={customStyles.inputIcon} size={20} />
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{...customStyles.formControl, paddingRight: '3.5rem'}}
                      required
                    />
                    <button
                      type="button"
                      style={customStyles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Phone Number */}
                  <Row style={{ marginBottom: '1.5rem' }}>
                    <Col md={4}>
                      <div style={customStyles.inputGroup}>
                        <Phone style={customStyles.inputIcon} size={20} />
                        <Form.Control
                          type="text"
                          placeholder="Code"
                          name="countryCode"
                          value={formData.phoneNumber.countryCode}
                          onChange={handleChange}
                          style={customStyles.formControl}
                        />
                      </div>
                    </Col>
                    <Col md={8}>
                      <div style={customStyles.inputGroup}>
                        <Form.Control
                          type="text"
                          placeholder="Phone Number"
                          name="number"
                          value={formData.phoneNumber.number}
                          onChange={handleChange}
                          style={{...customStyles.formControl, paddingLeft: '1rem'}}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* WeChat ID */}
                  <div style={customStyles.inputGroup}>
                    <Building style={customStyles.inputIcon} size={20} />
                    <Form.Control
                      type="text"
                      placeholder="WeChat ID"
                      name="weChatId"
                      value={formData.weChatId}
                      onChange={handleChange}
                      style={customStyles.formControl}
                    />
                  </div>

                  {/* HQ Location */}
                  <Row style={{ marginBottom: '1.5rem' }}>
                    <Col md={6}>
                      <div style={customStyles.inputGroup}>
                        <MapPin style={customStyles.inputIcon} size={20} />
                        <Form.Control
                          type="text"
                          placeholder="HQ City (e.g., Harare)"
                          name="hqCity"
                          value={formData.hqCity}
                          onChange={handleChange}
                          style={customStyles.formControl}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div style={customStyles.inputGroup}>
                        <MapPin style={customStyles.inputIcon} size={20} />
                        <Form.Control
                          type="text"
                          placeholder="HQ Country (e.g., Zimbabwe)"
                          name="hqCountry"
                          value={formData.hqCountry}
                          onChange={handleChange}
                          style={customStyles.formControl}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* Transport Modes */}
                  <div style={customStyles.inputGroup}>
                    <Truck style={customStyles.inputIcon} size={20} />
                    <Form.Control
                      as="select"
                      name="transportModes"
                      multiple
                      value={formData.transportModes}
                      onChange={handleChange}
                      style={{...customStyles.formControl, height: 'auto', minHeight: '3rem'}}
                    >
                      <option value="Sea">Sea</option>
                      <option value="Air">Air</option>
                      <option value="Air Express">Air Express</option>
                    </Form.Control>
                    <small style={{ color: '#B565D8', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>
                      Hold Ctrl (or Cmd on Mac) to select multiple transport modes
                    </small>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                style={customStyles.submitButton}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(139, 69, 187, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(139, 69, 187, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      style={{ marginRight: '0.5rem' }}
                    />
                    Processing...
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </Button>

              {/* Additional Links */}
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <p style={{ color: '#B565D8', fontSize: '0.95rem', margin: 0 }}>
                  {isLogin ? "Don't have a company account? " : "Already have a company account? "}
                  <button
                    type="button"
                    onClick={() => handleToggle(isLogin ? 2 : 1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8B45BB',
                      fontWeight: '600',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {isLogin ? 'Register here' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AuthShipperPage;