import { useState } from "react";
import StatCard from "./StatCard";
import axiosInstance from "../../utils/axiosIntance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuPencil, LuTrash2, LuShield, LuUser } from "react-icons/lu";

const UserCard = ({ userInfo, onUserUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [reassignTo, setReassignTo] = useState("");
    const [reassignmentOptions, setReassignmentOptions] = useState([]);

    const handleRoleUpdate = async (newRole) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.put(API_PATHS.USERS.UPDATE_USER_ROLE(userInfo._id), {
                role: newRole
            });

            toast.success(response.data.message);
            setShowRoleModal(false);
            if (onUserUpdate) onUserUpdate();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update user role";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userInfo._id), {
                data: { reassignTo: reassignTo || undefined }
            });

            toast.success(response.data.message);
            setShowDeleteModal(false);
            setReassignTo("");
            if (onUserUpdate) onUserUpdate();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete user";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const loadReassignmentOptions = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_REASSIGNMENT_OPTIONS(userInfo._id));
            setReassignmentOptions(response.data);
        } catch (error) {
            console.error("Failed to load reassignment options:", error);
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        loadReassignmentOptions();
    };

    return (
        <div className="user-card p-5 bg-white rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src={userInfo?.profileImageUrl || "https://via.placeholder.com/48"}
                        alt="Avatar"
                        className="w-14 h-14 rounded-full border border-gray-300 object-cover"
                    />
                    <div>
                        <p className="text-base font-semibold text-gray-900">{userInfo?.name}</p>
                        <p className="text-sm text-gray-500">{userInfo?.email}</p>
                        <div className="flex items-center gap-2 mt-1 ">
                            {userInfo?.role === "admin" ? (
                                <LuShield className="w-4 h-4 text-blue-500" />
                            ) : (
                                <LuUser className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-500 capitalize">{userInfo?.role}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowRoleModal(true)}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition"
                        title="Change role"
                    >
                        <LuPencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={openDeleteModal}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                        title="Delete user"
                    >
                        <LuTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex justify-between text-center mt-3 px-2">
                <StatCard label="Pending" count={userInfo?.PendingTask || 0} status="Pending" />
                <StatCard label="In Progress" count={userInfo?.inProgressTask || 0} status="In progress" />
                <StatCard label="Completed" count={userInfo?.completedTask || 0} status="Completed" />
            </div>

            {/* Role Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Update User Role</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Change role for <strong>{userInfo?.name}</strong>
                        </p>

                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="member"
                                    defaultChecked={userInfo?.role === "member"}
                                    className="accent-blue-600"
                                />
                                <span className="flex items-center gap-2 text-gray-700">
                                    <LuUser className="w-4 h-4" /> Member
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    defaultChecked={userInfo?.role === "admin"}
                                    className="accent-blue-600"
                                />
                                <span className="flex items-center gap-2 text-gray-700">
                                    <LuShield className="w-4 h-4" /> Admin
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const selectedRole = document.querySelector('input[name="role"]:checked').value;
                                    handleRoleUpdate(selectedRole);
                                }}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? "Updating..." : "Update Role"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">Delete User</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete <strong>{userInfo?.name}</strong>?
                            {userInfo?.PendingTask > 0 || userInfo?.inProgressTask > 0 ? (
                                <span className="block mt-2 text-orange-600">
                                    This user has {userInfo?.PendingTask + userInfo?.inProgressTask} active tasks.
                                </span>
                            ) : null}
                        </p>

                        {reassignmentOptions.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reassign tasks to (optional):
                                </label>
                                <select
                                    value={reassignTo}
                                    onChange={(e) => setReassignTo(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Remove from tasks</option>
                                    {reassignmentOptions.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setReassignTo("");
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {isLoading ? "Deleting..." : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCard;
