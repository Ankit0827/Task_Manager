import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { validateEmail, validateFullName} from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";


const SignUp = () => {
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
    adminInviteToken: ""
  });

  const [error, setError] = useState("");
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
    const { name, email, password, profilePic } = signupDetails;

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

    if (!password || password.length < 8) {
      return setError("*Please enter at least 8 characters for password");
    }

    // if (!adminInviteToken) {
    //   return setError("*Please enter a 6-digit token");
    // }
    // if (!validateSixDigitNumber(adminInviteToken)) {
    //   return setError("*Only 6-digit numeric values are allowed");
    // }

    setError(""); // Clear error if all validations pass

    try {
      let profileImageUrl = "";

      // Upload profile image if selected
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      // Make API call
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        ...signupDetails,
        profileImageUrl,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updatedUser(response.data);

        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
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
              type="text"
              label="Email Address"
            />

            <Input
              name="password"
              value={signupDetails.password}
              onChange={handleInputChange}
              placeholder="Min 8 characters"
              type="password"
              label="Password"
            />

            <Input
              name="adminInviteToken"
              value={signupDetails.adminInviteToken}
              onChange={handleInputChange}
              placeholder="6 Digit Code"
              type="text"
              label="Admin Invite Token"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}


          <button type="submit" className="btn-primary">
            SIGN UP
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
