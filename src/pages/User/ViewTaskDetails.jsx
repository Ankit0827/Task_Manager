import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const ViewTaskDetails = () => {

    const { id } = useParams();
    const [task, setTask] = useState(null);

    const getStatusTagColor = (status) => {
        switch (status) {
            case "In progress":
                return "text-cyan-600 bg-cyan-100 border border-cyan-200";
            case "Completed":
                return "text-lime-600 bg-lime-100 border border-lime-200";
            default:
                return "text-violet-600 bg-violet-100 border border-violet-200";
        }
    };


    const getTaskDetailsById = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));

            if (response.data) {
                const taskInfo = response.data;

                setTask(taskInfo);
            }
        } catch (error) {
            console.error("fetching error task Details", error)

        }
    };

    console.log(task)

    // handle totoList 
    const updateTodocheckList = async (index) => { 
       const todoChecklist = [...(task?.todoChecklist || [])];
        const taskId=id;
        if(todoChecklist && todoChecklist[index]){
            todoChecklist[index].completed=!todoChecklist[index].completed;

            try {
                const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),{todoChecklist});
                if(response.status===200){
                    setTask(response?.data?.task||task)
                }else{
                    // optionally revert the toggle if API call fails
                     todoChecklist[index].completed=!todoChecklist[index].completed;

                }
            } catch (error) {
                console.error("fetching error while updating todoCheklist.",error)
            }

        }
    };

    // handle attachment link click

    const handleLinkclick = (link) => {
        if(!/https?:\/\//i.test(link)){
            link="https://"+ link;// Default to Https
        }
        window.open(link, "_blank");
    };


    useEffect(() => {
        getTaskDetailsById();

        return () => { };
    }, [])



    return (
        <DashboardLayout activeMenu="My Tasks">
            <div className="w-full mt-8">
                {task && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-4 bg-white w-full p-6 rounded border border-gray-200 transition duration-300 hover:shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                                <h2 className="font-medium text-gray-900">
                                    {task?.title}
                                </h2>
                                <span
                                    className={`text-xs md:text-sm font-medium ${getStatusTagColor(
                                        task?.status
                                    )} px-4 py-1 rounded whitespace-nowrap`}
                                >
                                    {task?.status}
                                </span>
                            </div>
                            <div className="mt-4">
                                <InfoBox label="Description" value={task?.description} />
                            </div>
                            <div className="grid grid-cols-12 gap-4 mt-4">
                                <div className="col-span-6 md:col-span-4">
                                    <InfoBox label="Priority" value={task?.priority} />
                                </div>
                                <div className="col-span-6 md:col-span-4">
                                    <InfoBox label="Due date" value={task?.dueDate ? moment(task?.dueDate).format("DD/MM/YYYY") : "N/A"} />
                                </div>

                                <div className="col-span-6 md:col-span-4">
                                    <label className="text-xs font-medium text-slate-500">Assign To</label>
                                    <AvatarGroup avatars={task?.assignedTo.map((item) => item?.profileImageUrl) || []} maxVisible={5} />
                                </div>
                            </div>

                            <div className="mt-2">
                                <label className="text-xs font-medium text-slate-500">Todo Checklist</label>
                                {task?.todoChecklist?.map((item,index)=>(
                                    <TodocheckList key={`todo_${index}`} text={item.text} isChecked={item?.completed}  onChange={(e) => updateTodocheckList(index, e)}/>
                                ))}
                            </div>
                            {
                                task?.attachments?.length > 0 &&(
                                    <div className="mt-2">

                                        <label className="text-xs font-medium text-slate-500">Attachments</label>

                                        {
                                            task?.attachments?.map((link,index)=>(
                                                <Attachments key={`link_${index}`} link={link}  onClick={() => handleLinkclick(link)}  index={index}/>
                                            ))
                                        }

                                    </div>
                                )
                            }
                        </div>

                    </div>
                )}


            </div>
        </DashboardLayout>
    )
}

export default ViewTaskDetails


const InfoBox = ({ label, value }) => {

    return (
        <>
            <label className="text-xs font-medium text-slate-700">{label}</label>
            <p className="text-[13px] md:text-[13px] font-medium text-gray-500 mt-0.5">{value}</p>
        </>
    )

}


const TodocheckList=({text, isChecked, onChange})=>{
    return(
        <div className="flex items-center gap-3 p-3">
            <input type="checkbox" checked={isChecked} onChange={onChange} className="w-3 h-3 text-primary outline-none"/>
            <p className="text-[13px] text-gray-700">{text}</p>
        </div>
    )
}


const Attachments=({link,onClick,index})=>{
    return(
        <div className="flex items-center  justify-between bg-gray-50 border border-gray-100 px-3 py-2 cursor-pointer rounded" onClick={onClick}>
            <div className="flex-1  items-center gap-3 border border-gray-100">
                <span className="">{index<9?`0${index+1}`:index+1}: </span>
                <p className="text-xs text-gray-400 font-medium">{link}</p>
            </div>

            <LuSquareArrowOutUpRight className="" />

        </div>
    )
}



