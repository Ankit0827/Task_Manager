import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";

const MyTasks=()=>{
    const [allTasks,setAllTasks]=useState([]);
    const [tabs,setTabs]=useState([]);
    const [filterStatus,setFilterStatus]=useState("All");

    const navigate=useNavigate();

    const getAllTasks=async()=>{
        try {

            const response= await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS,{
                params:{
                    status:filterStatus==="All" ? "":filterStatus,
                },

        });

        setAllTasks(response.data?.tasks?.length>0?response?.data?.tasks:[]);

        // Map status Summary data with fixed labels and order

        const statusSummary=response.data?.statusSummary||{};

        console.log("mytask_statusSummary",statusSummary)

        const statusArray=[
            {label:"All",count:statusSummary.all||0},
            {label:"Pending",count:statusSummary.pendingTasks||0},
            {label:"In progress",count:statusSummary.inProgressTasks||0},
            {label:"Completed",count:statusSummary.completedTasks||0},
        ];

        setTabs(statusArray);
            
        } catch (error) {
            console.error("Error fetching users:",error)
            
        }
    };

    const handleClick=(taskId)=>{
        navigate(`/user/tasks-details/${taskId}`)

    }

    useEffect(()=>{
        getAllTasks(filterStatus);

        return ()=>{};
    },[filterStatus])


    return(
        <DashboardLayout activeMenu="My Tasks">
            {
                allTasks? <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl md:text-xl font-medium ">My Tasks</h2>
                    </div>
                    {
                         tabs?.[0]?.count>0 &&(
                            <div className="flex items-center gap-3">
                                <TaskStatusTabs tabs={tabs} activeTabs={filterStatus} setActiveTabs={setFilterStatus}/>
                              
                             </div>
                         )
                    }
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {allTasks?.map((item)=>(
                        <TaskCard 
                        key={item._id}
                         title={item.title}
                         description={item.description}
                         priority={item.priority}
                         status={item.status}
                         progress={item.progress}
                         createdAt={item.createdAt}
                         dueDate={item.dueDate}
                         assignedTo={item.assignedTo?.map((item)=>item.profileImageUrl)}
                         attachments={item.attachments?.length || 0}
                         completedTodoCount={item.CompletedTodoCount||0}
                         todoChecklist={item.todoChecklist||[]}
                         onClick={()=>handleClick(item._id)}/>
                    ))}
                </div>
            </div>:<div className="flex items-center justify-center h-full"><h2 className="text-gray-500">No Task Available....</h2></div>
            }
           
           
        </DashboardLayout>
    )
}

export default MyTasks