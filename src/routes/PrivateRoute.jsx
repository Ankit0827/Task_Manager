import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({ allowedRoles }) => {

  // User is allowed
  return <Outlet />;
};

export default PrivateRoute;
