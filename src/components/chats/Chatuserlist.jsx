import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosIntance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import { LuUsers } from 'react-icons/lu';
import { BsCircleFill } from 'react-icons/bs';
import socket from '../../utils/socket';

function Chatuserlist({ onUserSelect, selectedUserId }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [unseenCounts, setUnseenCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const { userId } = useParams();

  const getUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.CHATS.TEAM_MEMBERS);
      setTeamMembers(res?.data || []);
      
      // If there's a userId in URL, automatically select that user
      if (userId && res?.data?.length > 0) {
        const userFromUrl = res.data.find(u => u._id === userId);
        if (userFromUrl && !selectedUserId) {
          onUserSelect(userFromUrl);
        }
      }
    } catch {
      toast.error("Error fetching Team Members");
    }
  };

  const getNewMessageCount = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.CHATS.GET_NEW_MESSAGE_COUNT(currentUser._id));
      
      // Make the result easier to access by senderId
      const countMap = {};
      res.data.forEach((item) => {
        countMap[item._id] = item.count;
      });

      setUnseenCounts(countMap);
    } catch {
      toast.error("Error fetching New message Count");
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      getUsers();
      getNewMessageCount();
    }
  }, [currentUser, userId]);

  // Listen for online users updates and emit userOnline
  useEffect(() => {
    if (currentUser?._id) {
      // Emit userOnline when component mounts
      socket.emit("userOnline", currentUser._id);
    }

    const handleOnlineUsers = (userIds) => {
      console.log("Online users updated:", userIds);
      setOnlineUsers(userIds);
    };

    socket.on("updateOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("updateOnlineUsers", handleOnlineUsers);
    };
  }, [currentUser]);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <LuUsers className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-500">{teamMembers.length} members</p>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {teamMembers.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">No team members found</p>
          </div>
        ) : (
          teamMembers.map((member, index) => {
            const isSelected = member._id === selectedUserId;
            const isOnline = onlineUsers.includes(member._id);
            const unseenCount = unseenCounts[member._id] || 0;

            return (
              <div key={member._id || index} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => onUserSelect(member)}
                  className={`w-full flex items-center gap-3 text-left px-6 py-4 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                    isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  {/* Avatar with online indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={member?.profileImageUrl || "https://via.placeholder.com/40"}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`} />
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium text-sm truncate ${
                        isSelected ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {member?.name}
                      </h3>
                      {unseenCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {unseenCount > 99 ? '99+' : unseenCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {isOnline ? "Online" : " Offline"}
                    </p>
                  </div>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Chatuserlist;
