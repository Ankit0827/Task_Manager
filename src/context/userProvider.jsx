import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosIntance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "./userContext";


const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");

        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []); // Run only once on mount

    console.log("user",user)

    const updatedUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token); // Save token
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ user, loading, updatedUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;