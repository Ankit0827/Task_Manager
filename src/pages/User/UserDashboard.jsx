import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { useUserAuth } from "../../hooks/useUserAuth"
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import InfoCard from "../../components/cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import TaskListTable from "../../components/TaskListTable";
import CustomePieChart from "../../components/charts/CustomePieChart";
import CustomeBarChart from "../../components/charts/CustomeBarChart";



const COLORS = ["#8D51FF", "#00B8DB", "#50C878"]

const UserDashboard = () => {
    const { user } = useContext(UserContext);

    const [dashBoardData, setDashBoardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    useUserAuth();

    const navigate = useNavigate();

    const prepareChartData = (data) => {

        // here got data null 
        console.log(data)

        const taskDistribution = data?.taskDistribution || null;
        const taskPriorityLevels = data?.taskPriorityLevels || null;

        const taskDistributionData = [
            { status: "Pending", count: taskDistribution?.Pending || 0 },
            { status: "In progress", count: taskDistribution?.Inprogress || 0 },
            { status: "Completed", count: taskDistribution?.Completed || 0 },
        ]

        setPieChartData(taskDistributionData);

        const taskPriorityLevelData = [
            { priority: "Low", count: taskPriorityLevels?.Low || 0 },
            { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
            { priority: "High", count: taskPriorityLevels?.High || 0 },


        ]

        setBarChartData(taskPriorityLevelData)

    }


    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);

            if (response?.data) {
                setDashBoardData(response?.data);
                prepareChartData(response?.data?.charts || null);

            }
        } catch (error) {
            console.error("Error fetching users:", error)

        }
    };

    useEffect(() => {
        getDashboardData();

        return () => { };
    }, [])

    const onSeeMore = () => {

        navigate("/admin/tasks")

    }

    // Prepare Chart Data



    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="card my-5">
                <div className="">
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl">Welcome back! {user?.name}</h2>
                        <p className="text-xl md:[13px] text-gray-500 mt-1.5">
                            {moment().format('dddd Do MMM YYYY')}
                        </p>

                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                    <InfoCard label="Total Task" value={addThousandsSeparator(dashBoardData?.charts?.taskDistribution?.All || 0)} color="bg-primary" />

                    <InfoCard label="Pending Task" value={addThousandsSeparator(dashBoardData?.charts?.taskDistribution?.Pending || 0)} color="bg-violet-500" />


                    <InfoCard label="In Progress Task" value={addThousandsSeparator(dashBoardData?.charts?.taskDistribution?.Inprogress || 0)} color="bg-cyan-500" />


                    <InfoCard label="Completed Task" value={addThousandsSeparator(dashBoardData?.charts?.taskDistribution?.Completed || 0)} color="bg-lime-500" />

                </div>
            </div>

            <div className="flex">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <h5>Task Distribution</h5>
                    </div>
                    <CustomePieChart data={pieChartData} colors={COLORS} />
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <h5>Task Priority Lavels</h5>
                    </div>
                    <CustomeBarChart data={barChartData} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">



                <div className="md:col-span-2">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <h5>Recent Task</h5>
                            <button className="card-btn" onClick={onSeeMore}>See All <LuArrowRight className="text-base" /></button>
                        </div>
                        <TaskListTable tableData={dashBoardData?.recentTask || []} />
                    </div>
                </div>
            </div>

        </DashboardLayout>
    )
}

export default UserDashboard