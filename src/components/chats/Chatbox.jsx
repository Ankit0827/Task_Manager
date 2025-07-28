import { useContext, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosIntance';
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import socket from '../../utils/socket';
import { IoSend } from 'react-icons/io5';
import { BsCheck2All, BsCheck2 } from 'react-icons/bs';

function Chatbox({ selectedUser }) {
  const { user: currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isNearBottom, setIsNearBottom] = useState(true);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const isOnline = onlineUsers.includes(selectedUser._id);

  // Check if user is near bottom of messages
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const threshold = 100; // pixels from bottom
      setIsNearBottom(scrollHeight - scrollTop - clientHeight < threshold);
    }
  };

  // 👇 Auto-scroll to bottom only when new messages arrive and user is near bottom
  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isNearBottom]);

  // 👇 Join socket room for 1-on-1 conversation
  useEffect(() => {
    if (selectedUser?._id && currentUser?._id) {
      const roomId =
        currentUser._id > selectedUser._id
          ? `${currentUser._id}-${selectedUser._id}`
          : `${selectedUser._id}-${currentUser._id}`;
      socket.emit("joinRoom", roomId);

      return () => {
        socket.emit("leaveRoom", roomId);
      };
    }
  }, [selectedUser]);

  // 👇 Fetch existing messages from backend
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CHATS.GET_MESSAGES(selectedUser._id));
        setMessages(res?.data || []);
      } catch {
        toast.error("Failed to load chat");
      }
    };
    if (selectedUser?._id) getMessages();
  }, [selectedUser]);

  //  Receive real-time message from socket
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (message.senderId === selectedUser._id) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => msg._id === message._id);
          if (messageExists) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [selectedUser]);

  //  Handle send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axiosInstance.post(API_PATHS.CHATS.SEND_MESSAGES(selectedUser._id), {
        text: newMessage.trim(),
      });

      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(msg => msg._id === res.data._id);
        if (messageExists) {
          return prev;
        }
        return [...prev, res.data];
      });

      socket.emit("sendMessage", {
        ...res.data,
        receiverId: selectedUser._id,
      });

      setNewMessage('');
    } catch {
      toast.error("Failed to send message");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Listen for online users updates
  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("userOnline", currentUser._id);
    }

    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };

    socket.on("updateOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("updateOnlineUsers", handleOnlineUsers);
    };
  }, [currentUser]);

  // message seen or not 
  useEffect(() => {
    if (!messages || !currentUser || !selectedUser) return;

    const unseenMessages = messages.filter(
      (msg) =>
        msg.senderId === selectedUser._id &&
        !msg.seen
    );

    unseenMessages.forEach((msg) => {
      socket.emit("messageSeen", {
        messageId: msg._id,
        senderId: msg.senderId,
      });
    });
  }, [messages, selectedUser, currentUser]);

  useEffect(() => {
    const handleSeenAck = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, seen: true } : msg
        )
      );
    };

    socket.on("messageSeenAck", handleSeenAck);
    return () => socket.off("messageSeenAck", handleSeenAck);
  }, []);

  // Show loading while user context is loading
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!messages) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    // Sort messages by createdAt to ensure proper chronological order
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    const groups = {};
    sortedMessages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header: Shows selected user */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedUser?.profileImageUrl || "https://via.placeholder.com/40"}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`} />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-lg">{selectedUser.name}</h2>
            <p className="text-sm text-gray-500">
              {isOnline ? " Online" : " Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-gray-50"
      >
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date} className="mb-4">
            {/* Date separator */}
            <div className="flex justify-center mb-4">
              <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((msg, index) => {
              const isCurrentUser = msg.senderId === currentUser._id;
              const isLastMessage = index === dateMessages.length - 1;
              const showAvatar = !isCurrentUser && (index === 0 || dateMessages[index - 1]?.senderId !== msg.senderId);

              // Format time
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg._id || index}
                  className={`flex items-end gap-2 mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar for other user */}
                  {showAvatar && (
                    <div className="flex-shrink-0">
                      <img
                        src={selectedUser?.profileImageUrl || "https://via.placeholder.com/32"}
                        alt="sender"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`flex flex-col max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>

                    {/* Message metadata */}
                    <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-400">{formattedTime}</span>
                      
                      {/* Seen indicator for current user's messages */}
                      {isCurrentUser && (
                        <span className="text-xs text-gray-400">
                          {msg.seen ? (
                            <BsCheck2All className="text-blue-500" />
                          ) : (
                            <BsCheck2 className="text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avatar for current user (only for last message in group) */}
                  {isCurrentUser && isLastMessage && (
                    <div className="flex-shrink-0">
                      <img
                        src={currentUser?.profileImageUrl || "https://via.placeholder.com/32"}
                        alt="you"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
