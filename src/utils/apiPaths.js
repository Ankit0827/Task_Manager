export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details and also upDate profile
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users (Admin only)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
    UPDATE_USER_ROLE: (userId) => `/api/users/${userId}/role`, // Update user role (Admin only)
    GET_REASSIGNMENT_OPTIONS: (userId) => `/api/users/reassignment-options/${userId}`, // Get users for task reassignment
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data
    GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assigned)
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
    CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update todo checklist
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Export task data as an Excel file
    EXPORT_USERTASKS: "/api/reports/export/users", // Export task data as an Excel file
  },

  CHATS:{
    TEAM_MEMBERS:"/api/message/users",
    GET_MESSAGES:(userId)=>`/api/message/${userId}`,
    SEND_MESSAGES:(userId)=>`/api/message/send/${userId}`,
    GET_NEW_MESSAGE_COUNT:(userId)=>`/api/message/unseen-count/${userId}`
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // upload image
  },
};
