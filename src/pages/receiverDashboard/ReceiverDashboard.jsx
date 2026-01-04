import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import WelcomeMsg from "../../components/WelcomeMsg";
import useAxiosPublic from "../../hooks/axiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useCurrentUser from "../../hooks/useCurrentUser";
import useRole from "../../hooks/useRole";
import { AuthContext } from "../../providers/AuthProvider";
import { getAvatarUrl } from "../../utils/avatarHelper";

const ReceiverDashboard = () => {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const { currentUser } = useCurrentUser();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user data from database
  useEffect(() => {
    if (!user?.email) {
      setUserLoading(false);
      return;
    }

    axiosSecure.get("/get-user")
      .then(res => {
        const userData = res.data;
        setDbUser(userData);
      })
      .catch(err => {
        console.error("Error fetching user data", err);
        setDbUser(null);
      })
      .finally(() => {
        setUserLoading(false);
      });
  }, [user, axiosSecure]);

  // Fetch donation requests - optimized
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchRequests = async () => {
      try {
        const { data } = await axiosSecure.get("/my-donation-request");
        if (isMounted) {
          const sorted = (data || []).sort(
            (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
          );
          setRequests(sorted);
        }
      } catch (err) {
        console.error("Error fetching receiver requests:", err);
        if (isMounted) {
          setRequests([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [axiosSecure, user, location.pathname]); // Refetch when navigating to dashboard

  // Use hook-based currentUser if available (includes gender), otherwise fallback to dbUser or user
  const currentUserData = currentUser || dbUser || user;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/delete-request/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setRequests((prev) => prev.filter((req) => req._id !== id));
              Swal.fire(
                "Deleted!",
                "Your request has been deleted.",
                "success"
              );
            } else {
              Swal.fire(
                "Error",
                "Request not found or already deleted.",
                "error"
              );
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Something went wrong.", "error");
          });
      }
    });
  };

  const totalRequests = requests.length;
  const pending = requests.filter(
    (r) => String(r.donationStatus).toLowerCase() === "pending"
  ).length;
  const inProgress = requests.filter(
    (r) => String(r.donationStatus).toLowerCase() === "inprogress"
  ).length;
  const done = requests.filter(
    (r) => String(r.donationStatus).toLowerCase() === "done"
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950">
      <PageTitle title={"Recipient Dashboard"} />
      <WelcomeMsg />

      {/* Recipient profile summary */}
      {!userLoading && currentUserData && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mt-4 flex flex-col sm:flex-row items-center gap-4 backdrop-blur-sm">
          <img
            src={
              currentUserData?.image ||
              currentUserData?.photoURL ||
              getAvatarUrl(currentUserData?.gender || currentUser?.gender || dbUser?.gender)
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getAvatarUrl(currentUserData?.gender || currentUser?.gender || dbUser?.gender);
            }}
            alt={currentUserData?.name || currentUserData?.displayName || "Recipient"}
            className="w-20 h-20 rounded-full object-cover border-4 border-slate-700 shadow-lg"
          />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">
              {currentUserData.name || currentUserData.displayName || "Recipient"}
            </h3>
            <p className="text-sm text-slate-400">{currentUserData.email}</p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 font-semibold border border-slate-700">
                Blood Group: {currentUserData.bloodGroup || "Not set"}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700">
                Location:{" "}
                {currentUserData.upazila && currentUserData.district
                  ? `${currentUserData.upazila}, ${currentUserData.district}`
                  : "Not set"}
              </span>
            </div>
            <Link
              to="/recipientdashboard/profile"
              className="inline-block mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-semibold">
            Total Requests
          </p>
          <h3 className="text-3xl font-black text-white">
            {totalRequests}
          </h3>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400 font-semibold">
            Pending
          </p>
          <h3 className="text-3xl font-black text-white">{pending}</h3>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-semibold">
            In Progress
          </p>
          <h3 className="text-3xl font-black text-white">{inProgress}</h3>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-400 font-semibold">
            Completed
          </p>
          <h3 className="text-3xl font-black text-white">{done}</h3>
        </div>
      </div>

      {/* New Request Button - Always visible when not loading */}
      {!loading && (
        <div className="flex justify-end mt-8">
          <Link
            to="/recipientdashboard/create-donation-request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>+</span>
            New Request
          </Link>
        </div>
      )}

      {/* Requests table */}
      {loading && <Loader label="Loading your requests..." />}

      {!loading && requests.length > 0 && (
        <div className="bg-slate-900/60 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mt-6 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">
                    Recipient
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">
                    Blood
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-2 text-white">{item.recipientName}</td>
                    <td className="px-4 py-2 text-slate-400">
                      {item.recipientDistrict}, {item.recipientUpazila}
                    </td>
                    <td className="px-4 py-2 text-slate-400">{item.donationDate}</td>
                    <td className="px-4 py-2 text-slate-400">{item.donationTime}</td>
                    <td className="px-4 py-2 font-semibold text-slate-300">
                      {item.bloodGroup}
                    </td>
                    <td className="px-4 py-2 capitalize text-slate-300">
                      {item.donationStatus}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Link
                        to={`/details/${item._id}`}
                        className="text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        to={`/recipientdashboard/update-donation-request/${item._id}`}
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-slate-400 hover:text-slate-300 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="bg-slate-900/60 p-12 rounded-2xl text-center mt-8 border border-slate-800 backdrop-blur-sm">
          <div className="text-6xl mb-4">🩸</div>
          <p className="text-white text-lg">
            You haven&apos;t created any blood requests yet.
          </p>
          <div className="mt-4">
            <Link
              to="/recipientdashboard/create-donation-request"
              className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Create Your First Request
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiverDashboard;


