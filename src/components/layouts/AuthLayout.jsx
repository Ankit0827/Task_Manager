import RightsideLoginimage from "../../assets/images/RightsideLoginimage.png"



const AuthLayout=({children})=>{
    return <div className="flex">
           <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
            <h2 className="text-black font-medium text-lg">Task Manager</h2>
            {children}
           </div>
           <div className="hidden md:flex w-[40vw] h-screen">
            <img src={RightsideLoginimage} alt="Login_UI_image" className=" lg:w-[100%]" />
           </div>
    </div>
}

export default AuthLayout