import { FaUsers, FaTint, FaClipboardList, FaUserShield, FaClock, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useContext, useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../providers/AuthProvider";
import useRole from "../../hooks/useRole";
import Loader from "../../components/Loader";

const AdminDashboard = ({ stats }) => {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [request, setRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, requestsRes] = await Promise.all([
          axiosSecure.get("/get-users"),
          axiosSecure.get("/all-donation-requests")
        ]);
        setUsers(usersRes.data || []);
        setRequest(requestsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  if (loading) {
    return <Loader label="Loading dashboard..." full={true} />;
  }

  const donors = users.filter((user) => user.role === "donor");
  const receivers = users.filter((user) => user.role === "receiver");
  const admins = users.filter((user) => user.role === "admin");
  const totalDone = request.filter((item) => item.donationStatus === "done").length;
  const pendingRequests = request.filter((item) => item.donationStatus === "pending").length;
  const inProgressRequests = request.filter((item) => item.donationStatus === "inprogress").length;
  const totalRequests = request.length;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-slate-950 min-h-screen">
      <PageTitle title={"Admin Dashboard"} />

      {/* Welcome Message */}
      {user && (
        <div className="bg-slate-800/50 backdrop-blur-sm mb-8 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">👨‍💼</span>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {user.displayName || user.name || "Admin"}
                </span>
                !
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Managing as{" "}
                <span className="font-semibold capitalize text-emerald-400">{role}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Users */}
        <Link to="/admindashboard/all-users" className="block">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-l-4 border-emerald-600 shadow-xl hover:shadow-2xl group transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">
                  Total Users
                </p>
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {users.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {donors.length} donors • {receivers.length} recipients
                </p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-2xl sm:text-3xl text-white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Total Donors */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-l-4 border-blue-600 shadow-xl group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">
                Total Donors
              </p>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
                {donors.length}
              </p>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaUserShield className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
        </div>

        {/* Total Requests */}
        <Link to="/admindashboard/all-blood-donation-request" className="block">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-l-4 border-orange-600 shadow-xl hover:shadow-2xl group transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">
                  Total Requests
                </p>
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {totalRequests}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {pendingRequests} pending • {inProgressRequests} in progress
                </p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaClipboardList className="text-2xl sm:text-3xl text-white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Completed Donations */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-l-4 border-purple-600 shadow-xl group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">
                Completed
              </p>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {totalDone}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {totalRequests > 0 ? Math.round((totalDone / totalRequests) * 100) : 0}% completion rate
              </p>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaCheckCircle className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Request Status Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <FaTint className="text-emerald-400" />
            Request Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pending</span>
              <span className="text-yellow-400 font-bold">{pendingRequests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">In Progress</span>
              <span className="text-blue-400 font-bold">{inProgressRequests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Completed</span>
              <span className="text-green-400 font-bold">{totalDone}</span>
            </div>
          </div>
        </div>

        {/* User Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <FaUsers className="text-emerald-400" />
            User Roles
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Donors</span>
              <span className="text-blue-400 font-bold">{donors.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Recipients</span>
              <span className="text-orange-400 font-bold">{receivers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Admins</span>
              <span className="text-purple-400 font-bold">{admins.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <FaClock className="text-emerald-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              to="/admindashboard/all-users"
              className="block w-full text-left px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              Manage Users
            </Link>
            <Link
              to="/admindashboard/all-blood-donation-request"
              className="block w-full text-left px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              View Requests
            </Link>
            <Link
              to="/admindashboard/content-management"
              className="block w-full text-left px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              Content Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
