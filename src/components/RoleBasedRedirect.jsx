import { useContext } from "react";
import { Navigate } from "react-router";
import useRole from "../hooks/useRole";
import { AuthContext } from "../providers/AuthProvider";
import Loader from "./Loader";

const RoleBasedRedirect = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return <Loader label="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (role === "admin") {
    return <Navigate to="/admindashboard" replace />;
  }

  if (role === "donor") {
    return <Navigate to="/donordashboard" replace />;
  }

  if (role === "receiver") {
    return <Navigate to="/recipientdashboard" replace />;
  }

  // Fallback to home if role is unknown
  return <Navigate to="/" replace />;
};

export default RoleBasedRedirect;

