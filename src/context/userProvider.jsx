import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosIntance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "./userContext";
import socket from "../utils/socket";

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token and fetch user data on mount
    useEffect(() => {
        const initializeUser = async () => {
            const accessToken = localStorage.getItem("token");

            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                
                // Handle new response format
                if (response.data.success && response.data.data) {
                    setUser(response.data.data);
                    // Emit userOnline when user is loaded
                    if (response.data.data._id) {
                        socket.emit("userOnline", response.data.data._id);
                    }
                } else {
                    // Fallback for old format
                    setUser(response.data);
                    if (response.data._id) {
                        socket.emit("userOnline", response.data._id);
                    }
                }
            } catch (error) {
                console.error("User not authenticated", error);
                // Clear invalid token
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []); // Run only once on mount

    const updatedUser = (userData) => {
        setUser(userData);
        if (userData.token) {
            localStorage.setItem("token", userData.token);
        }
        // Emit userOnline when user logs in
        if (userData._id) {
            socket.emit("userOnline", userData._id);
        }
        setLoading(false);
    };

    const clearUser = () => {
        // Notify server that user is going offline
        if (user?._id) {
            socket.emit("userOffline", user._id);
        }
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{ user, loading, updatedUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;