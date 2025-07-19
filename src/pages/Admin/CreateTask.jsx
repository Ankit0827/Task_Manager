import { useLocation, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { LuTrash2 } from "react-icons/lu"
import { useEffect, useState } from "react";
import { PRIORITY_DATA } from "../../utils/data";
import SelecDropdown from "../../components/inputs/SelecDropdown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const CreateTask = () => {

    const location = useLocation();

    const { taskId } = location.state || {};

    const navigate = useNavigate();
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "",
        dueDate: null,
        assignedTo: [],
        todoChecklist: [],
        attachments: []

    });

    const [currentTask, setCurrentTask] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState()
    const [openDeleteAlert, setOpenDeleteAlert] = useState()

    const handleChangeValue = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }))
    };


    const ClearFormData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            dueDate: null,
            assignedTo: [],
            todoChecklist: [],
            attachments: []
        })
    };


    //  create Task 
    const createTask = async () => {
        setLoading(true);

        try {
            const todoList = taskData?.todoChecklist?.map((item) => ({
                text: item,
                completed: false,
            }));

            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData?.dueDate).toISOString(),
                todoChecklist: todoList,
            });
            toast.success("Task created successfully..");
            ClearFormData();
        } catch (error) {
            console.error("Error in task Creating..", error);
            setLoading(false);

        } finally {
            setLoading(false);
        }
    };


    // update task
    const updateTask = async () => {
        setLoading(true);
        try {
            const todolist = taskData.todoChecklist?.map((item) => {
                const prevTodoChecklist = currentTask?.todoChecklist || [];
                const matchedTask = prevTodoChecklist.find((task) => task.text === item)

                return {
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false
                }
            });
             axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todolist
            });

            toast.success("Task updated Successfully..")
        } catch (error) {
            console.error("fetching error while updating Task", error);

        } finally {
            setLoading(false);
        }
    };


    // form submission of task
    const handleSubmit = async () => {
        setError(null);

        if (!taskData?.title.trim()) {
            setError("Title is required.");
            return;
        }

        if (!taskData?.description.trim()) {
            setError("Description is required.");
            return;
        }


        if (!taskData?.priority) {
            setError("Priority is required.");
            return;

        }

        if (!taskData?.dueDate) {
            setError("Due Date is required.");
            return;

        }

        if (taskData?.assignedTo?.length === 0) {
            setError("Task is not assigned to any member. ");
            return;

        }

        if (taskData?.todoChecklist?.length === 0) {
            setError("Add atleast one todo task.");
            return;

        }

        if (taskId) {
            updateTask();
            return;
        }


        createTask();
    };


    // get Task by ID
    const getTaskDetailsById = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

            if (response.data) {
                const taskInfo = response.data;
                setCurrentTask(taskInfo);

                setTaskData(() => ({
                    title: taskInfo.title,
                    description: taskInfo.description,
                    priority: taskInfo.priority,
                    dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format("YYYY-MM-DD") : null,
                    assignedTo: taskInfo.assignedTo?.map((item) => item._id) || [],
                    attachments: (taskInfo.attachments) ? taskInfo.attachments : [],
                    todoChecklist: taskInfo.todoChecklist?.map((item) => item?.text) || []
                }))

            }

        } catch (error) {

            console.error("Error fetching users:", error)

        }
    };


    // delete Task
    const deleteTask = async () => {

        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
            setOpenDeleteAlert(false);
            toast.success("Expense details deleted succesfully..");
            navigate("/admin/tasks")
        } catch (error) {
            console.error("Error deleting expences..",error.response?.data?.message||error.message)
        }
    };


    useEffect(() => {
        if (taskId) {
            getTaskDetailsById(taskId)
        }

        return () => { };
    }, [taskId])

    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-xl font-medium">{taskId ? "Update Task" : "Create Task"}</h2>
                            {taskId && (
                                <button
                                    className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                                    onClick={() => 
                                        setOpenDeleteAlert(true)
                                    }
                                >
                                    <LuTrash2 className="text-base" />Delete
                                </button>
                            )}
                        </div>
                        <div className="mt-4 flex flex-col">
                            <label className="text-xs font-medium text-slate-600">Task Title</label>
                            <input type="text" placeholder="Create App UI" className="form-input" value={taskData.title} onChange={({ target }) => handleChangeValue("title", target.value)} />
                        </div>
                        <div className="mt-4 flex flex-col">
                            <label className="text-xs font-medium text-slate-600">Description</label>
                            <textarea type="text" placeholder="Describe task" rows={4} className="form-input" value={taskData.description} onChange={({ target }) => handleChangeValue("description", target.value)} />
                        </div>
                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-6 md:col-span-6">
                                <label className="text-xs font-medium text-slate-600">Priority</label>
                                <SelecDropdown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleChangeValue('priority', value)}
                                    placeholder="Select Priority" />
                            </div>
                            <div className="col-span-6 md:col-span-6">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Due Date
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={taskData.dueDate || ""}
                                        onChange={({ target }) => handleChangeValue("dueDate", target.value)}
                                    />
                                </div>


                            </div>


                        </div>

                        {/* Assign user's DropDown */}
                        <div className="col-span-12 md:col-span-3 mt-2">
                            <label className="text-xs font-medium text-slate-600">Assigned To</label>
                            <SelectUsers
                                selectedUsers={taskData?.assignedTo}
                                setSelectedUsers={(value) => handleChangeValue('assignedTo', value)}
                                placeholder="Select Users" />
                        </div>

                        {/* TODO ChECKLIST */}
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">TODO Checklist</label>
                            <TodoListInput todoList={taskData?.todoChecklist} setTodoList={(value) => handleChangeValue("todoChecklist", value)} />
                        </div>
                        {/* Attachemnt Add  */}
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">Add Attachments</label>

                            <AddAttachmentsInput attachments={taskData?.attachments} setAttachments={(value) => handleChangeValue("attachments", value)} />
                        </div>
                        {
                            error && (
                                <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
                            )
                        }

                        <div className="flex justify-end mt-7">
                            {
                                <button className="add-btn" onClick={handleSubmit} disabled={loading}>
                                    {taskId ? "UPDATED TASK" : "CREATE TASK"}
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={openDeleteAlert} onClose={()=>setOpenDeleteAlert(false)} title="Delete task">
                <DeleteAlert content="Are you sure want to delete this task" onDelete={()=>deleteTask()}/>
            </Modal>

        </DashboardLayout>
    )
}

export default CreateTask