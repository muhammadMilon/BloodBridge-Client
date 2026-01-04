import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { Link } from "react-router";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import WelcomeMsg from "../../components/WelcomeMsg";
import useAxiosPublic from "../../hooks/axiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import { getAvatarUrl } from "../../utils/avatarHelper";

export default function DonorDashboard() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationHistory, setDonationHistory] = useState([]);
  const [dbUser, setDbUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    upazila: "",
    bloodGroup: "",
    status: "active",
  });
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      setUserLoading(false);
      return;
    }

    let isMounted = true;

    // Fetch all data in parallel for better performance
    const fetchAllData = async () => {
      try {
        const [requestsRes, userRes, historyRes] = await Promise.allSettled([
          axiosSecure.get("/my-donation-request"),
          axiosSecure.get("/get-user"),
          axiosSecure.get(`/donor-history/${user.email}`)
        ]);

        if (isMounted) {
          // Handle donation requests
          if (requestsRes.status === 'fulfilled') {
            const sorted = (requestsRes.value.data || [])
              .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
              .slice(0, 3);
            setDonationRequests(sorted);
          } else {
            console.error("Error fetching donation requests:", requestsRes.reason);
          }
          setLoading(false);

          // Handle user data
          if (userRes.status === 'fulfilled') {
            const data = userRes.value.data;
            setDbUser(data);
            setFormData({
              name: data.name || user.displayName || "",
              district: data.district || "",
              upazila: data.upazila || "",
              bloodGroup: data.bloodGroup || "",
              status: data.status || "active",
            });
          } else {
            console.error("Error fetching user data", userRes.reason);
            setDbUser(null);
          }
          setUserLoading(false);

          // Handle donation history
          if (historyRes.status === 'fulfilled') {
            setDonationHistory(historyRes.value.data || []);
          } else {
            setDonationHistory([]);
          }
        }
      } catch (err) {
        console.error("Error in fetchAllData:", err);
        if (isMounted) {
          setLoading(false);
          setUserLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [user, axiosSecure]);

  // Fetch location data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [dRes, uRes] = await Promise.all([
          axios.get("/districts.json"),
          axios.get("/upazilas.json"),
        ]);
        setDistricts(dRes.data);
        setUpazilas(uRes.data);
      } catch (err) {
        console.error("Failed to fetch location data", err);
      }
    };
    fetchLocations();
  }, []);

  // Filter upazilas when district changes
  useEffect(() => {
    if (formData.district && districts.length > 0 && upazilas.length > 0) {
      const dist = districts.find((d) => d.name === formData.district);
      if (dist) {
        const filtered = upazilas.filter((u) => u.district_id === dist.id);
        setFilteredUpazilas(filtered);
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.district, districts, upazilas]);

  // Use dbUser if available, otherwise fallback to context user
  const currentUser = dbUser || user;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/delete-request/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setDonationRequests((prev) =>
                prev.filter((req) => req._id !== id)
              );
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!dbUser?._id) {
        throw new Error("User data not fully loaded yet. Please wait a moment.");
      }

      const res = await axiosSecure.patch(`/update-user/${dbUser._id}`, formData);
      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        Swal.fire({
          title: "Success",
          text: "Profile updated successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        setDbUser(prev => ({ ...prev, ...formData }));
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const totalDonations = donationHistory.length;
  const badge =
    totalDonations >= 5
      ? "Gold"
      : totalDonations >= 3
        ? "Silver"
        : totalDonations >= 1
          ? "Bronze"
          : "New Donor";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <PageTitle title={"Donor Dashboard"} />
      <WelcomeMsg />

      {/* Quick Actions - Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/donordashboard/create-donation-request"
          className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] shadow-lg hover:shadow-emerald-900/20"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl group-hover:bg-emerald-900/30 transition-all duration-300">
              <MdCreate className="text-3xl text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Create Request
              </h3>
              <p className="text-sm text-slate-400">New donation request</p>
            </div>
            <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/donordashboard/my-donation-requests"
          className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-emerald-600 transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] shadow-lg hover:shadow-emerald-900/20"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl group-hover:bg-emerald-900/30 transition-all duration-300">
              <FaClipboardList className="text-3xl text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                My Requests
              </h3>
              <p className="text-sm text-slate-400">View request history</p>
            </div>
            <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        </Link>
      </div>

      {/* Profile Section with Edit Form */}
      {!userLoading && currentUser && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-300 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <img
                src={currentUser?.image || currentUser?.photoURL || getAvatarUrl(currentUser?.gender)}
                onError={(e) => {
                  e.target.onerror = null;
                  // Fallback to gender-based avatar
                  e.target.src = getAvatarUrl(currentUser?.gender);
                }}
                alt={currentUser.name || currentUser.displayName || "Donor"}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {currentUser.name || currentUser.displayName || "Donor"}
              </h3>
              <p className="text-slate-400 font-medium">{currentUser.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-1.5 rounded-full bg-emerald-900/30 text-emerald-400 font-bold border border-emerald-800/50 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {currentUser.bloodGroup ? `Blood: ${currentUser.bloodGroup}` : "Set Blood Group"}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-slate-800/50 text-slate-300 font-medium border border-slate-700 shadow-sm">
                  {currentUser.upazila && currentUser.district
                    ? `📍 ${currentUser.upazila}, ${currentUser.district}`
                    : "📍 Set Location"}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-800/50">
                  {dbUser?.role || "donor"}
                </span>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isEditingProfile ? "Cancel Editing" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Edit Form */}
          {isEditingProfile && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto mt-8 pt-8 border-t border-slate-700">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/70 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/70 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all"
                  >
                    <option value="">Select District</option>
                    {districts.sort((a, b) => a.name.localeCompare(b.name)).map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Upazila</label>
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.district}
                  >
                    <option value="">Select Upazila</option>
                    {filteredUpazilas.sort((a, b) => a.name.localeCompare(b.name)).map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving Changes..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold mb-2">
              Reward Progress
            </p>
            <h3 className="text-3xl font-black text-white mb-1">{badge}</h3>
            <p className="text-slate-400 font-medium">
              {totalDonations} verified donation{totalDonations === 1 ? "" : "s"}
            </p>
          </div>
          <div className="mt-6">
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min((totalDonations / 5) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-right mt-2 text-emerald-400 font-medium">
              {5 - Math.min(totalDonations, 5)} more for next tier
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold mb-4">
              Reminder Settings
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-slate-300 font-medium">Email</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentUser?.reminderPreferences?.email
                  ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}>
                  {currentUser?.reminderPreferences?.email ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-slate-300 font-medium">SMS</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentUser?.reminderPreferences?.sms
                  ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}>
                  {currentUser?.reminderPreferences?.sms ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-full flex flex-col hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold mb-3">
            Next Eligibility
          </p>
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
            <span className="text-4xl mb-2">📅</span>
            <p className="text-slate-300 font-medium leading-relaxed">
              ~90 days after your last donation
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Keep your donation history updated for accurate tracking
            </p>
          </div>
        </div>
      </div>

      {/* Donation Requests Table */}
      {loading && <Loader label="Loading your latest requests..." />}

      {!loading && donationRequests.length > 0 && (
        <div className="bg-slate-900/60 rounded-2xl overflow-hidden shadow-xl border border-slate-800 backdrop-blur-sm">
          <div className="p-6 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Recent Requests</h3>
            <Link
              to="/donordashboard/my-donation-requests"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-300 uppercase text-xs tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-300 uppercase text-xs tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-300 uppercase text-xs tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-center font-bold text-slate-300 uppercase text-xs tracking-wider">Blood</th>
                  <th className="px-6 py-4 text-center font-bold text-slate-300 uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-300 uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {donationRequests.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-white">{item.recipientName}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {item.recipientDistrict}, {item.recipientUpazila}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{item.donationDate}</span>
                        <span className="text-xs">{item.donationTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-900/50 text-emerald-400 font-bold text-xs ring-2 ring-slate-700 border border-emerald-800">
                        {item.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${item.donationStatus === 'done' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' :
                        item.donationStatus === 'canceled' ? 'bg-slate-800/50 text-slate-400 border border-slate-700' :
                          'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                        }`}>
                        {item.donationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/donordashboard/update-donation-request/${item._id}`}
                        className="text-slate-400 hover:text-indigo-400 transition-colors font-medium"
                        title="Edit"
                      >
                        ✎
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-slate-400 hover:text-slate-200 transition-colors font-medium"
                        title="Delete"
                      >
                        🗑
                      </button>
                      <Link
                        to={`/details/${item._id}`}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-emerald-900/50 text-emerald-400 text-xs font-bold hover:bg-emerald-800/50 border border-emerald-800 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No requests */}
      {!loading && donationRequests.length === 0 && (
        <div className="bg-slate-900/60 p-12 rounded-2xl text-center border-2 border-dashed border-slate-700 backdrop-blur-sm">
          <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">🩸</div>
          <h3 className="text-xl font-bold text-white mb-2">No Requests Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            You haven't created any donation requests. Start by creating one to track your blood donation journey.
          </p>
          <Link
            to="/donordashboard/create-donation-request"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Create Request
          </Link>
        </div>
      )}

      {/* View All Requests Button - Footer Style */}
      {!loading && donationRequests.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link
            to="/donordashboard/my-donation-requests"
            className="group inline-flex items-center gap-2 px-8 py-3 bg-slate-800/50 border border-slate-700 hover:border-emerald-600 text-emerald-400 hover:text-emerald-300 font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          >
            View All History
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
