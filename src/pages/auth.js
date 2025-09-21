import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Upload, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
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
    avatar: '',
    shippingAddress: '',
    accountStatus: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  

  const [notificationData, setNotification] = useState({
    description: '',
    date: '',
    read: false,
    username: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';

    let avatarUrl = '';

    try {
      // Upload avatar if present and registering
      if (!isLogin && avatarFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', avatarFile);

        // Simulated upload - replace with your actual endpoint
        const uploadRes = await fetch('https://spaceshare-backend.onrender.com/upload', {
          method: 'POST',
          body: formDataImage,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          avatarUrl = uploadData.url;
        }
      }

      const requestData = {
        ...formData,
        avatar: avatarUrl,
        phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
        registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
        lastLoggedIn: new Date().toISOString(),
      };

      const notificationString = isLogin
        ? 'Your login was successful'
        : 'The account registration was successful';

      // Simulated API call - replace with your actual endpoint
      const response = await fetch(`https://spaceshare-backend.onrender.com/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      setLoading(false);

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', formData.username);
        setMessage('Authentication successful! Redirecting...');
        navigate('/');

        const notificationData = {
          description: notificationString,
          date: new Date().toISOString(),
          read: false,
          username: formData.username,
        };

        // Send notification
        fetch('https://spaceshare-backend.onrender.com/set-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });
      } else {
        setMessage('Operation successful');
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  const customStyles = {
    authBackground: {
      background: 'linear-gradient(135deg, #F3F3E0 0%, #CBDCEB 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    },
    authCard: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 20px 40px rgba(19, 62, 135, 0.15)',
      overflow: 'hidden',
      border: 'none',
      maxWidth: '800px',
      width: '100%',
      margin: '0 auto'
    },
    authHeader: {
      background: 'linear-gradient(135deg, #133E87 0%, #608BC1 100%)',
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
      background: '#F3F3E0'
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
      backdropFilter: 'blur(10px)'
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
      color: '#133E87',
      zIndex: 10
    },
    formControl: {
      border: '2px solid #CBDCEB',
      borderRadius: '1rem',
      padding: '1rem 1rem 1rem 3rem',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      boxShadow: '0 4px 15px rgba(19, 62, 135, 0.08)',
      width: '100%'
    },
    formControlFocus: {
      borderColor: '#608BC1',
      boxShadow: '0 0 0 0.25rem rgba(96, 139, 193, 0.25)',
      outline: 'none'
    },
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#133E87',
      cursor: 'pointer',
      zIndex: 10,
      padding: '0.5rem'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #133E87 0%, #608BC1 100%)',
      border: 'none',
      borderRadius: '1rem',
      padding: '1rem 2rem',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.1rem',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(19, 62, 135, 0.3)'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(19, 62, 135, 0.4)'
    },
    avatarUpload: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '3px dashed #608BC1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'rgba(96, 139, 193, 0.1)'
    },
    avatarUploadHover: {
      borderColor: '#133E87',
      backgroundColor: 'rgba(19, 62, 135, 0.1)',
      transform: 'scale(1.05)'
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
    },
    phoneRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '1rem',
      marginBottom: '1.5rem'
    }
  };

  return (
    <div style={customStyles.authBackground}>
      <div style={{ padding: '0 1rem', width: '100%' }}>
        <div style={customStyles.authCard}>
          {/* Header */}
          <div style={customStyles.authHeader}>
            <div style={customStyles.authHeaderOverlay}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Welcome Back
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
                {isLogin ? 'Sign in to your account' : 'Create your new account'}
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

            <form onSubmit={handleSubmit}>
              {/* Avatar Upload (Registration Only) */}
              {!isLogin && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div 
                    style={customStyles.avatarUpload}
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" style={customStyles.avatarPreview} />
                    ) : (
                      <Upload color="#608BC1" size={32} />
                    )}
                  </div>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <small style={{ color: '#608BC1', fontSize: '0.9rem' }}>
                    Click to upload profile picture
                  </small>
                </div>
              )}

              {/* Email (Registration Only) */}
              {!isLogin && (
                <div style={customStyles.inputGroup}>
                  <Mail style={customStyles.inputIcon} size={20} />
                  <input
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

              {/* Username */}
              <div style={customStyles.inputGroup}>
                <User style={customStyles.inputIcon} size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={customStyles.formControl}
                  required
                />
              </div>

              {/* Password */}
              <div style={customStyles.inputGroup}>
                <Lock style={customStyles.inputIcon} size={20} />
                <input
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
                    <input
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
                  <div style={customStyles.phoneRow}>
                    <div style={customStyles.inputGroup}>
                      <Phone style={customStyles.inputIcon} size={20} />
                      <input
                        type="text"
                        placeholder="Code"
                        name="countryCode"
                        value={formData.phoneNumber.countryCode}
                        onChange={handleChange}
                        style={customStyles.formControl}
                      />
                    </div>
                    <div style={customStyles.inputGroup}>
                      <input
                        type="text"
                        placeholder="Phone Number"
                        name="number"
                        value={formData.phoneNumber.number}
                        onChange={handleChange}
                        style={{...customStyles.formControl, paddingLeft: '1rem'}}
                      />
                    </div>
                  </div>

                  {/* WeChat ID */}
                  <div style={customStyles.inputGroup}>
                    <User style={customStyles.inputIcon} size={20} />
                    <input
                      type="text"
                      placeholder="WeChat ID"
                      name="weChatId"
                      value={formData.weChatId}
                      onChange={handleChange}
                      style={customStyles.formControl}
                    />
                  </div>

                  {/* Gender */}
                  <div style={customStyles.inputGroup}>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      style={{...customStyles.formControl, paddingLeft: '1rem'}}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={customStyles.submitButton}
                onMouseEnter={(e) => {
                  if (!loading) {
                    Object.assign(e.target.style, customStyles.submitButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(19, 62, 135, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        borderTopColor: 'white',
                        animation: 'spin 1s linear infinite',
                        marginRight: '0.5rem'
                      }}
                    />
                    Processing...
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </button>

              {/* Additional Links */}
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <p style={{ color: '#608BC1', fontSize: '0.95rem', margin: 0 }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => handleToggle(isLogin ? 2 : 1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#133E87',
                      fontWeight: '600',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {isLogin ? 'Sign up here' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AuthPage;


