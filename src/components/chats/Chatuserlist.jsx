import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosIntance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import { LuUsers } from 'react-icons/lu'

function Chatuserlist({ onUserSelect, selectedUserId }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const { user: currentUser } = useContext(UserContext);

  const getUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.CHATS.TEAM_MEMBERS);
      setTeamMembers(res?.data);
    } catch (error) {
      console.error("Error fetching Team Members", error);
      toast.error("Error fetching Team Members");
    }
  };

  useEffect(() => {
    if (currentUser?._id) getUsers();
  }, [currentUser]);

  return (
    <div className="Chat-user-list  bg-white  h-full overflow-y-auto border border-gray-500 rounded-lg">
      <div className='bg-gray-500 py-2 text-white flex items-center justify-center gap-3'>
        <LuUsers />
        <h2 className="text-[13px] font-semibold text-center py-3 border-b border-gray-500">Team Members</h2>
      </div>
      {teamMembers?.map((member, index) => {
        const isSelected = member._id === selectedUserId;

        return (
          <div key={index} className="border-b border-gray-500">
            <button
              onClick={() => onUserSelect(member)}
              className={`w-full flex items-center gap-3 text-left px-4 py-2 transition duration-200 cursor-pointer
                ${isSelected ? 'bg-primary text-white' : 'hover:bg-blue-100 hover:text-blue-800'}
              `}
            >
              <img
                src={member?.profileImageUrl}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <span className="text-sm font-medium">{member?.name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Chatuserlist;
