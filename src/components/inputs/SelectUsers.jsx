import { useState } from "react"
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect } from "react";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";


const SelectUsers = ({ selectedUsers, setSelectedUsers, placeholder }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([])

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (response?.data?.length > 0) {
                setAllUsers(response?.data);
            }
        } catch (error) {
            console.error({ message: "Error fetching users.." }, error.message)
        }
    }

    const toogleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false)
    };

    const selectedUserAvatar = allUsers.filter((user) => selectedUsers.includes(user._id)).map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setTempSelectedUsers([])
        }
        return () => { };
    }, [selectedUsers]);


    return (
        <div className="space-y-4 mt-2">
            {selectedUserAvatar?.length === 0 && (
                <button className="card-btn" onClick={() => setIsModalOpen(true)}>
                    <LuUsers className="text-sm" />Add Members
                </button>
            )}
            {
                selectedUserAvatar.length>0 && (
                       <div className="cursor-pointer" onClick={()=>setIsModalOpen(true)}>
                        <AvatarGroup avatars={selectedUserAvatar} maxVisible={3}/>
                       </div>      
                )
            }
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
                <div className="space-y-4 h-[60vh] overflow-y-auto">
                    {allUsers?.map((user) => (
                        <div className="flex items-center gap-4 p-3 border-b border-gray-600" key={user._id}>
                            <img src={user?.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{user?.name}</p>
                                <p className="text-[13px] text-gray-500">{user?.email}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={tempSelectedUsers.includes(user._id)}
                                onChange={() => toogleUserSelection(user._id)}
                                className="w-4 h-4 accent-primary bg-white text-white border border-gray-300 rounded-sm focus:ring-0"
                            />

                        </div>
                    ))}
                </div>
                <div className="flex justify-end p-2 gap-4">
                    <button className="card-btn" onClick={()=>setIsModalOpen(false)}>CANCEL</button>
                    <button className="card-btn-fill" onClick={handleAssign}>DONE</button>
                </div>
            </Modal>
        </div>
    )
}

export default SelectUsers