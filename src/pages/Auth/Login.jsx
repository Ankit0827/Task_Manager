import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from 'react-router-dom';
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosIntance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { debugAPI, debugError, extractData } from "../../utils/debug";

const Login = () => {
    const [loginDetails, setLoginDetails] = useState({
        "email": "",
        "password": ""
    });

    const { updatedUser } = useContext(UserContext);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setError("");

        // Validation
        if (!validateEmail(loginDetails.email)) {
            setError("*Please enter a valid email");
            return;
        }

        if (!loginDetails.password) {
            setError("*Please enter the password");
            return;
        }

        if (loginDetails.password.length < 6) {
            setError("*Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await axiosIntance.post(API_PATHS.AUTH.LOGIN, {
                ...loginDetails
            });

            // Debug the response
            debugAPI(response, "LOGIN");

            // Extract data using helper function
            const userData = extractData(response);
            const { token, role } = userData;

            if (token) {
                localStorage.setItem("token", token);
                updatedUser(userData);
                
                toast.success("Login successful!");

                if (role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
            } else {
                setError("Invalid response from server");
            }
        } catch (error) {
            debugError(error, "LOGIN");
            
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setError(errorData.message || "Login failed. Please try again.");
                toast.error(errorData.message || "Login failed");
            } else if (error.message) {
                setError("Network error. Please check your connection.");
                toast.error("Network error");
            } else {
                setError("Something went wrong. Please try again.");
                toast.error("Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your details to log in</p>
                
                <form onSubmit={handleLogin}>
                    <Input 
                        value={loginDetails.email} 
                        onChange={({ target }) => setLoginDetails({ ...loginDetails, email: target.value })} 
                        placeholder="john@example.com" 
                        type="email" 
                        label="Email Address" 
                    />

                    <Input 
                        value={loginDetails.password} 
                        onChange={({ target }) => setLoginDetails({ ...loginDetails, password: target.value })} 
                        placeholder="Enter your password" 
                        type="password" 
                        label="Password" 
                    />

                    {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}
                    
                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    
                    <p className="text-[13px] text-slate-800 mt-3">
                        Don't have an account{" "}
                        <Link to="/signup" className="font-medium text-primary underline">Signup</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;