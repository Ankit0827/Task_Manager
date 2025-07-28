import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/cards/UserCard";
import toast from "react-hot-toast";

const ManageUsers = () => {
    const [allusers, setAllusers] = useState([]);
    const [loading, setLoading] = useState(true);

    // get all users 
    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

            if (response.data?.length > 0) {
                setAllusers(response.data);
            } else {
                setAllusers([]);
            }
            
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    //  Download report
    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERTASKS, {
                responseType: "blob",
            });

            // create URL for Blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "user_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error("Error downloading user details:", error);
            toast.error("Failed to download report. Please try again.");
        }
    };

    return (
        <DashboardLayout activeMenu="Team Member">
            <div className="mt-5 mb-10">
                <div className="flex md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Team Members</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your team members and their roles</p>
                    </div>
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
                        onClick={handleDownloadReport}
                    >
                        <LuFileSpreadsheet className="text-lg" />
                        Download Report
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : allusers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LuFileSpreadsheet className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members</h3>
                        <p className="text-gray-500">No team members found. Users will appear here once they register.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {allusers?.map((user) => (
                            <UserCard 
                                key={user._id} 
                                userInfo={user} 
                                onUserUpdate={getAllUsers}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageUsers;