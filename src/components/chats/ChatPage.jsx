import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatUserList from './Chatuserlist';
import Chatbox from './Chatbox';
import DashboardLayout from '../layouts/DashboardLayout';
import { UserContext } from '../../context/userContext';

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const { user: currentUser, loading } = useContext(UserContext);

    const handleUserSelect = (selectedUserData) => {
        setSelectedUser(selectedUserData);
        
        // Navigate to the appropriate chat URL based on CURRENT user's role (not selected user's role)
        if (currentUser.role === "admin") {
            navigate(`/admin/chat/${selectedUserData._id}`);
        } else {
            navigate(`/user/chat/${selectedUserData._id}`);
        }
    };

    // Show loading while user context is loading
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Redirect if no user (should be handled by PrivateRoute, but extra safety)
    if (!currentUser) {
        return null; // PrivateRoute will handle redirect
    }

    return (
        <DashboardLayout activeMenu="Chat">
            <div className="flex h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
                {/* User List Sidebar */}
                <ChatUserList 
                    onUserSelect={handleUserSelect} 
                    selectedUserId={selectedUser?._id}
                />

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <Chatbox selectedUser={selectedUser}/>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Conversation</h3>
                                <p className="text-gray-500">Select a team member from the list to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChatPage;
