import { useContext, useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import Input from "../../components/inputs/Input"
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector"
import { validateEmail } from "../../utils/helper"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosIntance"
import { API_PATHS } from "../../utils/apiPaths"
import { UserContext } from "../../context/userContext"
import uploadImage from "../../utils/uploadImage"

const SignUp = () => {

    const [signupDetails, setSignupDetails] = useState({
        "name": "",
        "email": "",
        "password": "",
        "profilePic": null,
        "adminInviteToken": ""
    })

    const [error, setError] = useState("")
    const { updatedUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault();

        let profileImageUrl = '';

        if (!signupDetails.name) {
            setError("*Please enter  full name")
            return;
        }

        if (!validateEmail(signupDetails.email)) {
            setError("*Please enter a valid email")
            return;
        }

        //   if (!signupDetails.adminInviteToken) {
        //     setError("*for add user you have to fill adminInviteToken")
        //     return;
        // }
        // if(signupDetails.adminInviteToken.length<6){
        //      setError("*AdminInviteToken should be 6 Digits")
        //     return;
        // }

        if (!signupDetails.password) {
            setError("*Please enter the password")
            return;
        }

        if (signupDetails.password.length < 8) {
            setError("*Please enter minimum 8 characters")
            return;
        } else {
            setError("")

        }


        setError("")


        //Signup API call

        try {

            // upload Image if present

            if (signupDetails.profilePic) {
                const imgUploadRes = await uploadImage(signupDetails.profilePic)
                profileImageUrl = imgUploadRes.imageUrl || ""
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                ...signupDetails, profileImageUrl
            })

            const { token, role } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                updatedUser(response.data);
            }

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError("Something went wrong . Please try again.")
            }
        }

    }
    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Create an Account </h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering your details below.</p>

                <form onSubmit={handleSignup}>
                    <ProfilePhotoSelector
                        image={signupDetails.profilePic}
                        setImage={(newImage) =>
                            setSignupDetails(prev => ({ ...prev, profilePic: newImage }))
                        }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Input value={signupDetails.name} onChange={({ target }) => setSignupDetails({ ...signupDetails, name: target.value })} placeholder="full name" type="text" label="Full Name" />

                        <Input value={signupDetails.email} onChange={({ target }) => setSignupDetails({ ...signupDetails, email: target.value })} placeholder="jhon@example.com" type="text" label="Emai Address" />

                        <Input value={signupDetails.password} onChange={({ target }) => setSignupDetails({ ...signupDetails, password: target.value })} placeholder="Min 8 character" type="password" label="Password" />

                        <Input value={signupDetails.adminInviteToken} onChange={({ target }) => setSignupDetails({ ...signupDetails, adminInviteToken: target.value })} placeholder="6 Digit Code" type="" label="Admin Invite Token " />

                    </div>
                    {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}
                    <button type="submit" className="btn-primary">SIGN UP</button>
                    <p className="text-[13px] text-slate-800 mt-3">Already have an account{" "}
                        <Link to="/login" className="font-medium text-primary underline">Login</Link>
                    </p>

                </form>

            </div>
        </AuthLayout>
    )
}

export default SignUp