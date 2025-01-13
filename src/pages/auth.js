// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, ToggleButtonGroup, ToggleButton, Spinner, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     email: '',
//     confirmPassword: '',
//     userType: 'regular',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleToggle = (value) => {
//     setIsLogin(value === 1);
//     setFormData({ ...formData, email: '', confirmPassword: '' });
//     setError('');
//     setMessage('');
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
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


//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     const endpoint = isLogin ? 'login' : 'register';
//     axios.post(`http://localhost:3001/${endpoint}`, formData)
//       .then(response => {
//         setLoading(false);
//         if (response.data.token) {
//           localStorage.setItem('token', response.data.token);
//           localStorage.setItem('user', formData.username);
//           localStorage.setItem('userType', formData.userType);
//           navigate('/');
//         } else {
//           setMessage('Operation successful');
//         }
//       })
//       .catch(error => {
//         setLoading(false);
//         setError(error.response ? error.response.data.message : 'An error occurred');
//       });
//   };


//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-md-center">
//         <Col md={6}>
//           <ToggleButtonGroup type="radio" name="authType" defaultValue={1} className="mb-3" onChange={handleToggle}>
//             <ToggleButton id="tbg-radio-1" value={1} variant="outline-primary">
//               Sign In
//             </ToggleButton>
//             <ToggleButton id="tbg-radio-2" value={2} variant="outline-success">
//               Sign Up
//             </ToggleButton>
//           </ToggleButtonGroup>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {message && <Alert variant="success">{message}</Alert>}
//           <Form onSubmit={(e) => handleSubmit(e)}>
//             {!isLogin && (
//               <Form.Group controlId="formEmail">
//                 <Form.Label>Email address</Form.Label>
//                 <Form.Control type="email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
//               </Form.Group>
//             )}

//             <Form.Group controlId="formUsername">
//               <Form.Label>Username</Form.Label>
//               <Form.Control type="text" placeholder="Enter username" name="username" value={formData.username} onChange={handleChange} />
//             </Form.Group>

//             <Form.Group controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
//             </Form.Group>

//             {!isLogin && (
//               <>
//                 <Form.Group controlId="formConfirmPassword">
//                   <Form.Label>Confirm Password</Form.Label>
//                   <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
//                 </Form.Group>
//                 <Form.Group controlId="formUserType">
//                   <Form.Label>User Type</Form.Label>
//                   <Form.Control as="select" name="userType" value={formData.userType} onChange={handleChange}>
//                     <option value="regular">Regular</option>
//                     <option value="admin">Admin</option>
//                   </Form.Control>
//                 </Form.Group>
//               </>
//             )}

//             <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
//               {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : isLogin ? 'Sign In' : 'Sign Up'}
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default AuthPage;
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ToggleButtonGroup, ToggleButton, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    phoneNumber: { countryCode: '', number: '' },
    weChatId: '',
    gender: 'male',
    registrationDate: '',
    lastLoggedIn: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleToggle = (value) => {
    setIsLogin(value === 1);
    setFormData({
      ...formData,
      email: '',
      confirmPassword: '',
      phoneNumber: { countryCode: '', number: '' },
      weChatId: '',
      gender: 'male',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? 'login' : 'register';
    const requestData = {
      ...formData,
      phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
      registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
      lastLoggedIn: !isLogin ? new Date().toISOString() : new Date().toISOString(),
    };

    console.log(requestData)

    axios
      .post(`http://localhost:3001/${endpoint}`, requestData)
      .then((response) => {
        setLoading(false);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', formData.username);
          navigate('/');
        } else {
          setMessage('Operation successful');
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response ? error.response.data.message : 'An error occurred');
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <ToggleButtonGroup type="radio" name="authType" defaultValue={1} className="mb-3" onChange={handleToggle}>
            <ToggleButton id="tbg-radio-1" value={1} variant="outline-primary">
              Sign In
            </ToggleButton>
            <ToggleButton id="tbg-radio-2" value={2} variant="outline-success">
              Sign Up
            </ToggleButton>
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

            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
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

                <Form.Group controlId="formPhoneNumber">
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

                <Form.Group controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}

            <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;
