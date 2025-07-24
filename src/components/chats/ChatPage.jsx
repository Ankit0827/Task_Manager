import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatUserList from './Chatuserlist';
import Chatbox from './Chatbox';
import DashboardLayout from '../layouts/DashboardLayout';

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();
    const { userId } = useParams();

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if(user.role==="member"){
             navigate(`/user/chat/${user._id}`);
        }
        if(user.role==="admin"){
            navigate(`/admin/chat/${user._id}`);
        }
        
    };

    // Sync selectedUser when URL changes
    useEffect(() => {
        if (!selectedUser && userId) {
            setSelectedUser(null);
             navigate("/admin/chat");
        }
    }, []);

    return (
        <DashboardLayout activeMenu="Chat">
            <div className="flex h-[90vh] border  bg-gray-50 rounded-lg">
                <div>
                    <ChatUserList onUserSelect={handleUserSelect} selectedUserId={selectedUser?._id} />
                </div>

                <div className="flex-1 p-4">
                    {selectedUser ? (
                        <Chatbox selectedUser={selectedUser} />
                    ) : (
                        <div className="text-gray-600 text-lg text-center mt-40">
                            Start the Conversation...
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default ChatPage;
