import "./App.css";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from './pages/Admin/Dashboard';
import ManageTask from "./pages/Admin/ManageTask";
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";
import { UserContext } from "./context/userContext";
import UserProvider from "./context/userProvider";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import ChatPage from "./components/chats/ChatPage";

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTask />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/chat" element={<ChatPage />} />
              <Route path="/admin/chat/:userId" element={<ChatPage />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["member"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTask />} />
              <Route path="/user/tasks-details/:id" element={<ViewTaskDetails />} />
              <Route path="/user/chat" element={<ChatPage />} />
              <Route path="/user/chat/:userId" element={<ChatPage />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </UserProvider>
  );
}

// Root component for handling initial routing
const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/user/dashboard" replace />;
  }
};

// 404 Not Found component
const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default App;

