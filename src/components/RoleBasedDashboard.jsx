
import { useContext } from "react";
import useRole from "../hooks/useRole";
import AdminDashboard from "../pages/adminDashboard/AdminDashboard";
import DonorDashboard from "../pages/donorDashboard/DonorDashboard";
import ReceiverDashboard from "../pages/receiverDashboard/ReceiverDashboard";
import { AuthContext } from "../providers/AuthProvider";
import Loader from "./Loader";
import WelcomeMsg from "./WelcomeMsg";

export default function RoleBasedDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useRole();

  if (authLoading || (roleLoading && user)) {
    return <Loader label="Loading dashboard..." />;
  }

  if (!user) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">User not found</h2>
              <p className="text-slate-600">Please log in to view your dashboard.</p>
          </div>
      );
  }

  const userWithRole = { ...user, role }; // Combine firebase user with role

  if (role === "admin") {
    return <AdminDashboard user={userWithRole} role={role} />;
  }

  if (role === "donor") {
    return <DonorDashboard user={userWithRole} />;
  }

  if (role === "receiver") {
    return <ReceiverDashboard user={userWithRole} role={role} />;
  }

  // Fallback for unknown role
  return (
    <div className="p-8 text-center">
       <WelcomeMsg />
       <div className="mt-8 p-6 glass rounded-2xl max-w-lg mx-auto">
           <h3 className="text-xl font-bold text-slate-800 mb-2">Account Status</h3>
           <p className="text-slate-600">
               Your account role is: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{role || "undefined"}</span>
           </p>
           <p className="mt-4 text-sm text-slate-500">
               If you believe this is an error, please contact support.
           </p>
       </div>
    </div>
  );
}
