// import React, { useState, useEffect } from 'react';
// import { formatDistanceToNow } from 'date-fns';
// import { ListGroup, Form, Image, Button, ButtonGroup, Badge, Spinner } from 'react-bootstrap';
// import axios from "axios";

// export default function ChatList({ onSelectChat }) {
//   const [filter, setFilter] = useState('all');
//   const [chatList, setChatList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchChatList = async () => {
//     // const username = localStorage.user;
//     const username = localStorage.getItem('companyName') || localStorage.getItem('user');

//     try {
//       setLoading(true); // Start loading
//       const response = await axios.post('https://spaceshare-backend.onrender.com/get-chats', { username });
//       setChatList(response.data);
//     } catch (error) {
//       console.error('Error fetching packages:', error);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   const handleSelectChat = async (chat) => {
//     if (!chat.read) {
//       try {
//         await axios.put(`https://spaceshare-backend.onrender.com/edit-chats/${chat._id}`, { read: true });
  
//         // Update local state for immediate feedback
//         setChatList(prevChats =>
//           prevChats.map(c => (c._id === chat._id ? { ...c, read: true } : c))
//         );
//       } catch (err) {
//         console.error("Failed to mark chat as read:", err);
//       }
//     }
  
//     onSelectChat(chat); // continue with original behavior
//   };

//   useEffect(() => {
//     fetchChatList();
//   }, []);

//   const truncateMessage = (msg, maxLength = 10) => {
//     return msg.length > maxLength ? msg.slice(0, maxLength) + '...' : msg;
//   };

//   const filteredChats = chatList.filter(chat =>
//     filter === 'all' ? true : filter === 'unread' ? !chat.read : chat.read
//   );

//   return (
//     <div className="h-100 d-flex flex-column bg-light p-3 rounded">
//   <h5 className="text-center mb-3 fw-bold">Space Share Chat</h5>

//   <Form.Control type="text" placeholder="Search..." className="mb-2" />

//   <ButtonGroup className="mb-3 w-100">
//     <Button
//       variant={filter === 'all' ? 'primary' : 'outline-primary'}
//       onClick={() => setFilter('all')}
//     >
//       All
//     </Button>
//     <Button
//       variant={filter === 'read' ? 'primary' : 'outline-primary'}
//       onClick={() => setFilter('read')}
//     >
//       Read
//     </Button>
//     <Button
//       variant={filter === 'unread' ? 'primary' : 'outline-primary'}
//       onClick={() => setFilter('unread')}
//     >
//       Unread
//     </Button>
//   </ButtonGroup>

//   {loading ? (
//     <div className="d-flex justify-content-center align-items-center flex-grow-1">
//       <Spinner animation="border" variant="primary" />
//     </div>
//   ) : (
//     <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '500px' }}>
//       <ListGroup variant="flush">
//         {filteredChats.length === 0 ? (
//           <div className="text-center text-muted my-4">No chats yet</div>
//         ) : (
//           filteredChats.map(chat => (
//             <ListGroup.Item
//               key={chat._id}
//               action
//               onClick={() => handleSelectChat(chat)}
//               className="d-flex justify-content-between align-items-start mb-2 rounded px-3 py-2"
//               style={{ backgroundColor: '#f8f9fa' }}
//             >
//               <div className="d-flex align-items-start">
//                 <Image
//                   src={chat.avatar}
//                   roundedCircle
//                   width="40"
//                   height="40"
//                   className="me-3"
//                 />
//                 <div>
//                   <div className="fw-bold">
//                     {chat.recieverName === localStorage.getItem("user") || chat.recieverName === localStorage.getItem('companyName')
//                       ? chat.userId
//                       : chat.recieverName}
//                   </div>
//                   <div className="text-muted small">
//                     {truncateMessage(chat.lastMessage)}
//                   </div>
//                 </div>
//               </div>
//               <div className="text-end">
//                 <div className="text-muted small">
//                   {formatDistanceToNow(new Date(chat.lastTimestamp), {
//                     addSuffix: true,
//                   })}
//                 </div>
//                 {!chat.read && (
//                   <Badge bg="danger" className="mt-1">
//                     Unread
//                   </Badge>
//                 )}
//               </div>
//             </ListGroup.Item>
//           ))
//         )}
//       </ListGroup>
//     </div>
//   )}
// </div>

//   );
// }

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import axios from "axios";
import { IoSearch, IoTime, IoCheckmarkDone, IoMailUnread } from 'react-icons/io5';
import '../components/sidebar.css';
import io from 'socket.io-client';


const ChatList = ({ onSelectChat }) => {
  // [All your existing state and function declarations remain exactly the same]
  const [filter, setFilter] = useState('all');
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [socket, setSocket] = useState(null);

  // [All your existing functions remain exactly the same]
  const fetchChatList = async () => {
    const username = localStorage.getItem('companyName') || localStorage.getItem('user');
    try {
      setLoading(true);
      const response = await axios.post('https://space-share-chat.onrender.com/get-chats', { username });
      setChatList(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSelectChat = async (chat) => {
  //   if (!chat.read) {
  //     try {
  //       await axios.put(`https://spaceshare-backend.onrender.com/edit-chats/${chat._id}`, { read: true });
  //       setChatList(prevChats =>
  //         prevChats.map(c => (c._id === chat._id ? { ...c, read: true } : c))
  //       );
  //     } catch (err) {
  //       console.error("Failed to mark chat as read:", err);
  //     }
  //   }
  //   onSelectChat(chat);
  // };

  const handleSelectChat = async (chat) => {
  if (!chat.read) {
    try {
      // await axios.put(`https://space-share-chat.onrender.com/edit-chats/${chat._id}`, { read: true });
      await axios.put(`https://spaceshare-backend.onrender.com/edit-chats/${chat._id}`, { read: true });
      // No need to manually update state here - it will be handled by the socket update
      setChatList(prevChats =>
          prevChats.map(c => (c._id === chat._id ? { ...c, read: true } : c))
        );
    } catch (err) {
      console.error("Failed to mark chat as read:", err);
    }
  }
  onSelectChat(chat);
 };

  useEffect(() => {
    fetchChatList();
  }, []);

  const truncateMessage = (msg, maxLength = 10) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + '...' : msg;
  };

  const filteredChats = chatList.filter(chat =>
    filter === 'all' ? true : filter === 'unread' ? !chat.read : chat.read
  );

    useEffect(() => {
    // Initialize socket connection
    const newSocket = io('https://space-share-chat.onrender.com');
    setSocket(newSocket);

    return () => {
      // Clean up on unmount
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new chats
    socket.on('new-chat', (newChat) => {
      setChatList(prevChats => {
        // Check if chat already exists to avoid duplicates
        const exists = prevChats.some(chat => chat._id === newChat._id);
        if (!exists) {
          // Add new chat and sort by timestamp
          return [...prevChats, newChat].sort((a, b) => 
            new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
          );
        }
        return prevChats;
      });
    });

    // Listen for chat updates (like read status changes)
    socket.on('update-chat', (updatedChat) => {
      setChatList(prevChats => 
        prevChats.map(chat => 
          chat._id === updatedChat.id ? { ...chat, ...updatedChat } : chat
        )
      );
    });

    return () => {
      socket.off('new-chat');
      socket.off('update-chat');
    };
  }, [socket]);

  const customStyles = `
    .chatlist-container {
      background: linear-gradient(135deg, #F3F3E0 0%, #CBDCEB 100%);
      border-radius: 1.5rem;
      padding: 1.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
    }

    .chatlist-header {
      color: #133E87;
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .search-container {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #CBDCEB;
      border-radius: 1rem;
      font-size: 1rem;
      background-color: white;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.08);
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #608BC1;
      box-shadow: 0 0 0 0.25rem rgba(96, 139, 193, 0.25);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #608BC1;
    }

    .filter-buttons {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 0.5rem;
    }

    .filter-btn {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #CBDCEB;
      border-radius: 1rem;
      background-color: white;
      color: #608BC1;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .filter-btn:hover {
      border-color: #608BC1;
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      border-color: #133E87;
      color: white;
    }

    .chat-list {
      flex: 1;
      overflow-y: auto;
      max-height: 500px;
      padding-right: 0.5rem;
    }

    .chat-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.75rem;
      background-color: white;
      border-radius: 1rem;
      box-shadow: 0 4px 15px rgba(19, 62, 135, 0.08);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .chat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(19, 62, 135, 0.15);
    }

    .chat-item.unread {
      background-color: rgba(96, 139, 193, 0.1);
      border-left: 4px solid #133E87;
    }

    .chat-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #CBDCEB;
      margin-right: 1rem;
    }

    .chat-content {
      flex: 1;
      min-width: 0;
    }

    .chat-name {
      font-weight: 600;
      color: #133E87;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chat-message {
      color: #608BC1;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chat-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 1rem;
    }

    .chat-time {
      color: #608BC1;
      font-size: 0.8rem;
      white-space: nowrap;
    }

    .unread-badge {
      background: linear-gradient(135deg, #133E87 0%, #608BC1 100%);
      color: white;
      border-radius: 0.75rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.7rem;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    .empty-state {
      text-align: center;
      color: #608BC1;
      padding: 2rem 0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }

    .spinner {
      width: 3rem;
      height: 3rem;
      border: 0.25rem solid rgba(96, 139, 193, 0.3);
      border-radius: 50%;
      border-top-color: #133E87;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .chatlist-container {
        padding: 1rem;
        border-radius: 1rem;
      }

      .chatlist-header {
        font-size: 1.25rem;
      }

      .chat-item {
        padding: 0.75rem;
      }

      .chat-avatar {
        width: 40px;
        height: 40px;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="chatlist-container">
        <h5 className="chatlist-header">Meli-Flow Chat</h5>

        <div className="search-container">
          <IoSearch className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search chats..."
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <IoTime size={16} />
            All
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            <IoCheckmarkDone size={16} />
            Read
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            <IoMailUnread size={16} />
            Unread
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="chat-list">
            {filteredChats.length === 0 ? (
              <div className="empty-state">No chats yet</div>
            ) : (
              filteredChats.map(chat => (
                <div
                  key={chat._id}
                  className={`chat-item ${!chat.read ? 'unread' : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <img
                    src={chat.avatar}
                    alt="Profile"
                    className="chat-avatar"
                  />
                  <div className="chat-content">
                    <div className="chat-name">
                      {chat.recieverName === localStorage.getItem("user") || chat.recieverName === localStorage.getItem('companyName')
                        ? chat.userId
                        : chat.recieverName}
                    </div>
                    <div className="chat-message">
                      {truncateMessage(chat.lastMessage)}
                    </div>
                  </div>
                  <div className="chat-meta">
                    <div className="chat-time">
                      {formatDistanceToNow(new Date(chat.lastTimestamp), {
                        addSuffix: true,
                      })}
                    </div>
                    {!chat.read && (
                      <span className="unread-badge">Unread</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatList;