import { useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import { Link, useNavigate } from 'react-router-dom'
import Input from "../../components/inputs/Input"
import { validateEmail } from "../../utils/helper"
import axiosIntance from "../../utils/axiosIntance"
import { API_PATHS } from "../../utils/apiPaths"
import { useContext } from "react"
import { UserContext } from "../../context/userContext"

const Login = () => {
    const [loginDetails, setLoginDetails] = useState({
        "email": "",
        "password": ""
    })

    const {updatedUser}=useContext(UserContext)

    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(loginDetails.email)) {
            setError("*Please enter a valid email")
            return;
        }

        if (!loginDetails.password) {
            setError("*Please enter the password")
            return;
        }

        if (loginDetails.password.length < 8) {
            setError("*Please enter minimum 8 characters")
            return;
        } else {
            setError("")

        }

        setError("")

        //Login  API call

        try {

            const response = await axiosIntance.post(API_PATHS.AUTH.LOGIN, {
                ...loginDetails
            });

            const { token, role } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                updatedUser(response.data)

                if (role === "admin") {
                    navigate("/admin/dashboard")
                } else {
                    navigate("/user/dashboard")
                }
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError("Something went wrong . Please try again.")
            }

        }

    }
    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your dteails to log in </p>
                <form onSubmit={handleLogin}>
                    <Input value={loginDetails.email} onChange={({ target }) => setLoginDetails({ ...loginDetails, email: target.value })} placeholder="jhon@example.com" type="text" label="Email Address" />

                    <Input value={loginDetails.password} onChange={({ target }) => setLoginDetails({ ...loginDetails, password: target.value })} placeholder="Min 8 character" type="password" label="Password" />

                    {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}
                    <button type="submit" className="btn-primary">Login</button>
                    <p className="text-[13px] text-slate-800 mt-3">Don't have an account{" "}
                        <Link to="/SignUp" className="font-medium text-primary underline">Signup</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Login