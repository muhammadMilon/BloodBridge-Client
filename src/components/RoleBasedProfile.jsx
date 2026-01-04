import { useContext, Suspense } from "react";
import React from "react";
import { useLocation } from "react-router";
import useRole from "../hooks/useRole";
import AdminProfile from "../pages/adminDashboard/Profile";
import DonorProfile from "../pages/donorDashboard/Profile";
import ReceiverProfile from "../pages/receiverDashboard/Profile";
import { AuthContext } from "../providers/AuthProvider";
import Loader from "./Loader";
import WelcomeMsg from "./WelcomeMsg";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-slate-950 min-h-screen">
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h2>
          <p className="text-slate-400 mb-4">Please try refreshing the page.</p>
          <p className="text-xs text-slate-500">Error: {this.state.error?.message || "Unknown error"}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


export default function RoleBasedProfile() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useRole();
  const location = useLocation();

  // Debug logging
  console.log("RoleBasedProfile render:", { 
    hasUser: !!user, 
    role, 
    roleLoading, 
    authLoading, 
    pathname: location.pathname 
  });

  // Show loader while authentication is loading
  if (authLoading) {
    return <Loader label="Authenticating..." full={true} />;
  }

  // Show loader while role is being determined
  if (roleLoading) {
    return <Loader label="Loading profile..." full={true} />;
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4 bg-slate-950">
        <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
        <p className="text-slate-400">Please log in to view your profile.</p>
      </div>
    );
  }

  // Render based on role with error boundary
  try {
    if (role === "admin") {
      return (
        <ErrorBoundary>
          <Suspense fallback={<Loader label="Loading admin profile..." full={true} />}>
            <AdminProfile />
          </Suspense>
        </ErrorBoundary>
      );
    }

    if (role === "donor") {
      return (
        <ErrorBoundary>
          <Suspense fallback={<Loader label="Loading donor profile..." full={true} />}>
            <DonorProfile />
          </Suspense>
        </ErrorBoundary>
      );
    }

    if (role === "receiver" || role === "recipient") {
      console.log("Rendering receiver profile for role:", role);
      return (
        <ErrorBoundary>
          <Suspense fallback={<Loader label="Loading recipient profile..." full={true} />}>
            <ReceiverProfile />
          </Suspense>
        </ErrorBoundary>
      );
    }

    // Fallback: If we're on recipient dashboard but role is not set, try receiver profile
    // This handles edge cases where role might not be loaded yet
    if (location.pathname.includes("recipientdashboard") && !role) {
      console.warn("Role not determined but on recipient dashboard, rendering receiver profile");
      return (
        <ErrorBoundary>
          <Suspense fallback={<Loader label="Loading profile..." full={true} />}>
            <ReceiverProfile />
          </Suspense>
        </ErrorBoundary>
      );
    }
  } catch (error) {
    console.error("Error in RoleBasedProfile render:", error);
    return (
      <div className="p-8 text-center bg-slate-950 min-h-screen">
        <h2 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h2>
        <p className="text-slate-400 mb-4">Please try refreshing the page.</p>
        <p className="text-xs text-slate-500">Error: {error?.message || "Unknown error"}</p>
      </div>
    );
  }

  // Final fallback for unknown role
  return (
    <div className="p-8 text-center bg-slate-950 min-h-screen">
      <WelcomeMsg />
      <p className="text-slate-400 mt-4">
        {role ? `Profile not available for role: ${role}` : "Unable to determine your role. Please contact support."}
      </p>
      <p className="text-xs text-slate-500 mt-2">Current path: {location.pathname}</p>
    </div>
  );
}
