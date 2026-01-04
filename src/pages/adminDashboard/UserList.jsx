import { useContext, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import { FaUsers } from "react-icons/fa";
import { getAvatarUrl } from "../../utils/avatarHelper";

const UsersList = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user) {
      setLoading(true);
      axiosSecure("/get-users")
        .then(({ data }) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleRoleChange = (e, email) => {
    const role = e.target.value;

    axiosSecure
      .patch("/update-role", {
        role,
        email,
      })
      .then(({ data }) => {
        if (data.modifiedCount) {
          toast.success("User role updated successfully");
          setUsers((prevUsers) =>
            prevUsers.map((u) => (u.email === email ? { ...u, role } : u))
          );
        } else {
          toast.error("Failed to update role");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const handleStatus = (email, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    axiosSecure
      .patch("/update-status", { email, status: newStatus })
      .then(({ data }) => {
        if (data.modifiedCount) {
          toast.success(`User status updated to ${newStatus}`);
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.email === email ? { ...u, status: newStatus } : u
            )
          );
        } else {
          toast.error("Failed to update user status");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  // Filter users based on status
  const filteredUsers =
    filterStatus === "all"
      ? users
      : users.filter((user) => user.status === filterStatus);

  if (loading) {
    return <Loader label="Loading users..." full={true} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-950 min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border border-slate-700 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              Manage user roles and account status
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-300 hidden sm:block">
              Filter by:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700 border-2 border-slate-600 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <option value="all">All Users ({users.length})</option>
              <option value="active">
                Active Users (
                {users.filter((u) => u.status === "active").length})
              </option>
              <option value="blocked">
                Blocked Users (
                {users.filter((u) => u.status === "blocked").length})
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div>
        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.image || user.photoURL || getAvatarUrl(user.gender)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getAvatarUrl(user.gender);
                  }}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-600"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-200">{user.name}</h3>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      user.status === "active"
                        ? "bg-green-900/50 text-green-400 border border-green-700"
                        : "bg-orange-900/50 text-orange-400 border border-orange-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Change Role
                  </label>
                  <select
                    onChange={(e) => handleRoleChange(e, user.email)}
                    defaultValue={user.role}
                    className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Change Status
                  </label>
                  <button
                    onClick={() => handleStatus(user.email, user.status)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                      user.status === "active"
                        ? "bg-orange-900/50 text-orange-400 hover:bg-orange-900/70 border-2 border-orange-700"
                        : "bg-green-900/50 text-green-400 hover:bg-green-900/70 border-2 border-green-700"
                    }`}
                  >
                    {user.status === "active" ? "Block User" : "Activate User"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-200 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-200 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-200 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-200 uppercase tracking-wider">
                    Change Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.image || user.photoURL || getAvatarUrl(user.gender)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getAvatarUrl(user.gender);
                          }}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-200">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/50 text-emerald-400 border border-emerald-700 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === "active"
                            ? "bg-green-900/50 text-green-400 border border-green-700"
                            : "bg-orange-900/50 text-orange-400 border border-orange-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        onChange={(e) => handleRoleChange(e, user.email)}
                        defaultValue={user.role}
                        className="bg-slate-700 border-2 border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="donor">Donor</option>
                        <option value="volunteer">Volunteer</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatus(user.email, user.status)}
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
                          user.status === "active"
                            ? "bg-orange-900/50 text-orange-400 hover:bg-orange-900/70 border-2 border-orange-700"
                            : "bg-green-900/50 text-green-400 hover:bg-green-900/70 border-2 border-green-700"
                        }`}
                      >
                        {user.status === "active" ? "Block" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-700 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
              <FaUsers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">No users found</h3>
            <p className="text-slate-400">
              No users match your current filter selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
