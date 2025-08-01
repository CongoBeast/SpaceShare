// // MessageItem.jsx
// import React, { useState } from 'react';
// import { ListGroup, Modal, Button, Image } from 'react-bootstrap';
// import moment from 'moment';

// const MessageItem = ({ msg, isCurrentUser, displayName }) => {
//   const [showImageModal, setShowImageModal] = useState(false);

//   return (
//     <>
//       <ListGroup.Item className={`border-0 ${isCurrentUser ? 'text-end' : 'text-start'}`}>
//         <div className={`d-inline-block p-2 rounded ${isCurrentUser ? 'bg-primary text-white' : 'bg-light'}`}>
//           {msg.type === 'image' && msg.imageLink && (
//             <Image
//               src={msg.imageLink}
//               thumbnail
//               style={{ maxHeight: '200px', cursor: 'pointer' }}
//               onClick={() => setShowImageModal(true)}
//             />
//           )}
//           {msg.message && msg.type !== 'image' && (
//             <div>{msg.message}</div>
//           )}
//         </div>
//         <div className="text-muted small mt-1">
//           {displayName} • {moment(msg.timeCreated || msg.createdAt).format('h:mm A, MMM D')}
//         </div>
//       </ListGroup.Item>

//       <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Image Preview</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           <Image src={msg.imageLink} fluid />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowImageModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default MessageItem;

// MessageItem.jsx
import React, { useState } from 'react';
import { ListGroup, Modal, Button, Image, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';

const MessageItem = ({ msg, isCurrentUser, displayName }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatTime = (timestamp) => {
    const messageTime = moment(timestamp);
    const now = moment();
    
    if (now.diff(messageTime, 'days') === 0) {
      return messageTime.format('h:mm A');
    } else if (now.diff(messageTime, 'days') === 1) {
      return `Yesterday ${messageTime.format('h:mm A')}`;
    } else {
      return messageTime.format('MMM D, h:mm A');
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const renderTooltip = (props) => (
    <Tooltip id="timestamp-tooltip" {...props}>
      {moment(msg.timeCreated || msg.createdAt).format('MMMM Do YYYY, h:mm:ss A')}
    </Tooltip>
  );

  return (
    <>
      <ListGroup.Item 
        className="border-0 bg-transparent px-0 py-2"
        style={{ 
          marginBottom: '8px',
          animation: 'fadeIn 0.3s ease-in'
        }}
      >
        <div className={`d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
          <div 
            className={`position-relative p-3 rounded-3 shadow-sm ${
              isCurrentUser 
                ? 'bg-primary text-white' 
                : 'bg-white border'
            }`}
            style={{ 
              maxWidth: '70%',
              minWidth: '100px',
              wordWrap: 'break-word',
              transition: 'all 0.2s ease',
              ...(isCurrentUser ? {
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              } : {
                backgroundColor: '#f8f9fa',
                borderColor: '#e9ecef'
              })
            }}
          >
            {/* Message Content */}
            {msg.type === 'image' && msg.imageLink && (
              <div className="position-relative">
                {imageLoading && (
                  <div 
                    className="d-flex align-items-center justify-content-center bg-light rounded"
                    style={{ height: '150px', minWidth: '200px' }}
                  >
                    <div className="spinner-border text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                
                {imageError ? (
                  <div 
                    className="d-flex flex-column align-items-center justify-content-center bg-light text-muted rounded p-3"
                    style={{ height: '150px', minWidth: '200px' }}
                  >
                    <i className="bi bi-image-fill fs-2 mb-2"></i>
                    <small>Failed to load image</small>
                  </div>
                ) : (
                  <Image
                    src={msg.imageLink}
                    thumbnail
                    className="border-0 shadow-sm"
                    style={{ 
                      maxHeight: '300px', 
                      maxWidth: '100%',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'transform 0.2s ease',
                      display: imageLoading ? 'none' : 'block'
                    }}
                    onClick={() => setShowImageModal(true)}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                )}
                
                {msg.message && (
                  <div className="mt-2 small">
                    {msg.message}
                  </div>
                )}
              </div>
            )}
            
            {msg.message && msg.type !== 'image' && (
              <div style={{ 
                lineHeight: '1.4',
                fontSize: '14px'
              }}>
                {msg.message}
              </div>
            )}

            {/* Message status indicator for current user */}
            {isCurrentUser && (
              <div className="position-absolute bottom-0 end-0 translate-middle-y pe-2">
                <i 
                  className="bi bi-check2-all text-white-50" 
                  style={{ fontSize: '12px' }}
                  title="Delivered"
                ></i>
              </div>
            )}
          </div>
        </div>
        
        {/* Timestamp and sender info */}
        <div className={`d-flex align-items-center mt-1 ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
          <div className="d-flex align-items-center text-muted" style={{ fontSize: '12px' }}>
            {!isCurrentUser && (
              <Badge 
                bg="secondary" 
                className="me-2 px-2 py-1"
                style={{ fontSize: '10px', fontWeight: 'normal' }}
              >
                {displayName}
              </Badge>
            )}
            <OverlayTrigger
              placement="top"
              delay={{ show: 500, hide: 100 }}
              overlay={renderTooltip}
            >
              <span 
                style={{ cursor: 'pointer' }}
                className="user-select-none"
              >
                {formatTime(msg.timeCreated || msg.createdAt)}
              </span>
            </OverlayTrigger>
          </div>
        </div>
      </ListGroup.Item>

      {/* Enhanced Image Modal */}
      <Modal 
        show={showImageModal} 
        onHide={() => setShowImageModal(false)} 
        centered 
        size="lg"
        backdrop="static"
        keyboard={true}
      >
        <Modal.Header 
          closeButton 
          className="border-0 pb-2"
          style={{ backgroundColor: '#f8f9fa' }}
        >
          <Modal.Title className="fs-6 text-muted">
            <i className="bi bi-image me-2"></i>
            Image Preview
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="text-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="position-relative">
            <Image 
              src={msg.imageLink} 
              fluid 
              className="shadow rounded"
              style={{ 
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          </div>
          
          {msg.message && (
            <div className="mt-3 p-3 bg-white rounded shadow-sm">
              <small className="text-muted d-block mb-1">Caption:</small>
              <div className="text-dark">{msg.message}</div>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-2" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <small className="text-muted">
              Shared by {displayName} • {formatTime(msg.timeCreated || msg.createdAt)}
            </small>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => window.open(msg.imageLink, '_blank')}
              >
                <i className="bi bi-box-arrow-up-right me-1"></i>
                Open Original
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowImageModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message-bubble:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
};

export default MessageItem;