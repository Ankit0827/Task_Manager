import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { validateEmail, validateFullName } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";
import { debugAPI, debugError, extractData } from "../../utils/debug";

const SignUp = () => {
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
    adminInviteToken: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatedUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, profilePic, adminInviteToken } = signupDetails;

    // Clear previous errors
    setError("");

    // Validation block
    if (!name) {
      return setError("*Please enter full name");
    }
    if (!validateFullName(name)) {
      return setError("*Full name must contain only letters");
    }

    if (!email) {
      return setError("*Please enter an email");
    }
    if (!validateEmail(email)) {
      return setError("*Please enter a valid email");
    }

    if (!password || password.length < 6) {
      return setError("*Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      let profileImageUrl = "";

      // Upload profile image if selected
      if (profilePic) {
        try {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          setError("Failed to upload profile image. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Make API call
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password,
        profileImageUrl,
        adminInviteToken: adminInviteToken || undefined
      });

      // Debug the response
      debugAPI(response, "REGISTER");

      // Extract data using helper function
      const userData = extractData(response);
      const { token, role } = userData;

      if (token) {
        localStorage.setItem("token", token);
        updatedUser(userData);
        
        toast.success("Account created successfully!");

        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      debugError(error, "REGISTER");
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          setError(errorData.errors.join(", "));
        } else {
          setError(errorData.message || "Registration failed. Please try again.");
        }
        toast.error(errorData.message || "Registration failed");
      } else if (error.message) {
        setError("Network error. Please check your connection.");
        toast.error("Network error");
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector
            image={signupDetails.profilePic}
            setImage={(newImage) =>
              setSignupDetails((prev) => ({ ...prev, profilePic: newImage }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              value={signupDetails.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              type="text"
              label="Full Name"
            />

            <Input
              name="email"
              value={signupDetails.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              type="email"
              label="Email Address"
            />

            <Input
              name="password"
              value={signupDetails.password}
              onChange={handleInputChange}
              placeholder="Min 6 characters"
              type="password"
              label="Password"
            />

            <Input
              name="adminInviteToken"
              value={signupDetails.adminInviteToken}
              onChange={handleInputChange}
              placeholder="Admin Token (Optional)"
              type="text"
              label="Admin Invite Token"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "SIGN UP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
