// import React, { useContext, useEffect, useRef, useState } from 'react';
// import axiosInstance from '../../utils/axiosIntance';
// import { UserContext } from '../../context/userContext';
// import { API_PATHS } from '../../utils/apiPaths';
// import toast from 'react-hot-toast';
// import socket from '../../utils/socket'; // Import socket

// function Chatbox({ selectedUser }) {
//   const { user: currentUser } = useContext(UserContext);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // JOIN ROOM on user select
//   useEffect(() => {
//     if (selectedUser?._id && currentUser?._id) {
//       const roomId =
//         currentUser._id > selectedUser._id
//           ? `${currentUser._id}-${selectedUser._id}`
//           : `${selectedUser._id}-${currentUser._id}`;
//       socket.emit("joinRoom", roomId);

//       return () => {
//         socket.emit("leaveRoom", roomId); // optional
//       };
//     }
//   }, [selectedUser]);

//   // Fetch messages on mount / change
//   useEffect(() => {
//     const getMessages = async () => {
//       try {
//         const res = await axiosInstance.get(API_PATHS.CHATS.GET_MESSAGES(selectedUser._id));
//         setMessages(res?.data);
//       } catch (error) {
//         toast.error("Failed to load chat",error);
//       }
//     };
//     if (selectedUser?._id) getMessages();
//   }, [selectedUser]);

//   // Socket listener for incoming messages
//   useEffect(() => {
//     const handleReceiveMessage = (message) => {
//       if (message.senderId === selectedUser._id) {
//         setMessages((prev) => [...prev, message]);
//       }
//     };

//     socket.on("receiveMessage", handleReceiveMessage);
//     return () => socket.off("receiveMessage", handleReceiveMessage);
//   }, [selectedUser]);

//   const handleSend = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const res = await axiosInstance.post(API_PATHS.CHATS.SEND_MESSAGES(selectedUser._id), {
//         text: newMessage.trim(),
//       });

//       setMessages((prev) => [...prev, res.data]);
//       socket.emit("sendMessage", {
//         ...res.data,
//         receiverId: selectedUser._id,
//       });

//       setNewMessage('');
//     } catch (error) {
//       toast.error("Failed to send message",error);
//     }
//   };

//   if (!messages) {
//     return <div>Loading....</div>;
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="flex items-center gap-3 border-b border-gray-300 p-4 bg-white shadow-sm">
//         <img
//           src={selectedUser?.profileImageUrl}
//           alt="profile"
//           className="w-10 h-10 rounded-full object-cover border border-gray-300"
//         />
//         <h2 className="font-medium">{selectedUser.name}</h2>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
//               msg.senderId === currentUser._id
//                 ? 'bg-blue-500 text-white self-end ml-auto'
//                 : 'bg-gray-200 text-black self-start'
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t border-gray-300 bg-white flex gap-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message"
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Chatbox;

import React, { useContext, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosIntance';
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import socket from '../../utils/socket';

function Chatbox({ selectedUser }) {
  const { user: currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 👇 Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 👇 Join socket room for 1-on-1 conversation
  useEffect(() => {
    if (selectedUser?._id && currentUser?._id) {
      const roomId =
        currentUser._id > selectedUser._id
          ? `${currentUser._id}-${selectedUser._id}`
          : `${selectedUser._id}-${currentUser._id}`;
      socket.emit("joinRoom", roomId);

      return () => {
        socket.emit("leaveRoom", roomId); // optional cleanup
      };
    }
  }, [selectedUser]);

  // 👇 Fetch existing messages from backend
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CHATS.GET_MESSAGES(selectedUser._id));
        setMessages(res?.data);
      } catch (error) {
        toast.error("Failed to load chat", error);
      }
    };
    if (selectedUser?._id) getMessages();
  }, [selectedUser]);

  // 👇 Receive real-time message from socket
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (message.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [selectedUser]);

  // 👇 Handle send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axiosInstance.post(API_PATHS.CHATS.SEND_MESSAGES(selectedUser._id), {
        text: newMessage.trim(),
      });

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", {
        ...res.data,
        receiverId: selectedUser._id,
      });

      setNewMessage('');
    } catch (error) {
      toast.error("Failed to send message", error);
    }
  };

  if (!messages) {
    return <div>Loading....</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* 👤 Header: Shows selected user */}
      <div className="flex items-center gap-3 border-b border-gray-300 p-4 bg-white shadow-sm">
        <img
          src={selectedUser?.profileImageUrl}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
        <h2 className="font-medium">{selectedUser.name}</h2>
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUser._id;

          // 👇 Decide which profile image to show
          const profilePic = isCurrentUser
            ? currentUser.profileImageUrl
            : selectedUser.profileImageUrl;

          // 👇 Format time from msg.createdAt
          const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isCurrentUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* 👤 Avatar for the sender (left if other user, right if you) */}
              {!isCurrentUser && (
                <img
                  src={profilePic}
                  alt="sender"
                  className="w-8 h-8 rounded-full border"
                />
              )}

              {/*  Message + time */}
              <div className="flex flex-col max-w-xs items-center">
                <div
                  className={`p-3 rounded-lg text-sm ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white self-end'
                      : 'bg-gray-200 text-black self-start'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1 self-end">
                  {formattedTime}
                </span>
              </div>

              {isCurrentUser && (
                <img
                  src={profilePic}
                  alt="you"
                  className="w-8 h-8 rounded-full border"
                />
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-4 border-t border-gray-300 bg-white flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
