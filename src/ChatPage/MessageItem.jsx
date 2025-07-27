// MessageItem.jsx
import React, { useState } from 'react';
import { ListGroup, Modal, Button, Image } from 'react-bootstrap';
import moment from 'moment';

const MessageItem = ({ msg, isCurrentUser, displayName }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <ListGroup.Item className={`border-0 ${isCurrentUser ? 'text-end' : 'text-start'}`}>
        <div className={`d-inline-block p-2 rounded ${isCurrentUser ? 'bg-primary text-white' : 'bg-light'}`}>
          {msg.type === 'image' && msg.imageLink && (
            <Image
              src={msg.imageLink}
              thumbnail
              style={{ maxHeight: '200px', cursor: 'pointer' }}
              onClick={() => setShowImageModal(true)}
            />
          )}
          {msg.message && msg.type !== 'image' && (
            <div>{msg.message}</div>
          )}
        </div>
        <div className="text-muted small mt-1">
          {displayName} • {moment(msg.timeCreated || msg.createdAt).format('h:mm A, MMM D')}
        </div>
      </ListGroup.Item>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={msg.imageLink} fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MessageItem;