import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/cards/UserCard";
import toast from "react-hot-toast";

const ManageUsers=()=>{
    const [allusers,setAllusers]=useState([]);

    // get all users 
    const getAllUsers=async()=>{
         try {
            const response=await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

            if(response.data?.length>0){
                setAllusers(response.data);
            }
            
         } catch (error) {
            console.error("fetching error users:",error);
         }
    };

    useEffect(()=>{

        getAllUsers();

        return ()=>{};
    },[])

    //  Download report
    const handleDownloadReport=async()=>{
        try {
            const response=await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERTASKS,{
               responseType:"blob",
            });

            // create URL for Blob

            const url =window.URL.createObjectURL(new Blob([response.data]));
            const link= document.createElement("a");
            link.href=url;
            link.setAttribute("download","user_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
          
        } catch (error) {
            console.error("Error downloading expense details.",error);
            toast.error("failed to download expence deatils. Please try again.")
            
        }
    };
    return(
        <DashboardLayout activeMenu="Team Member">
            <div className="mt-5 mb-10">
                <div className="flex md:flex-row md:items-center justify-between">
                    <h2 className="text-xl md:text-xl font-medium">Team Memeber</h2>
                    <button className="flex md:flex download-btn" onClick={handleDownloadReport}>
                          <LuFileSpreadsheet className="text-lg"/>
                           Download Report
                        </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {allusers?.map((user)=>(
                            <UserCard key={user._id} userInfo={user}/>
                        ))}
                </div>
            </div>
           
        </DashboardLayout>
    )
}

export default ManageUsers