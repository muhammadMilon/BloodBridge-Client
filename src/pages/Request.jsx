import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import AmbulanceDirectory from "../components/AmbulanceDirectory";
import ClinicHighlights from "../components/ClinicHighlights";
import Loader from "../components/Loader";
import PageTitle from "../components/PageTitle";
import UrgencyMatrix from "../components/UrgencyMatrix";
import useAxiosPublic from "../hooks/axiosPublic";
import useRole from "../hooks/useRole";
import { AuthContext } from "../providers/AuthProvider";

export default function Request() {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const axiosPublic = useAxiosPublic();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await axiosPublic.get("/all-donation-requests-public");
        if (isMounted) {
          setDonations(res.data || []);
        }
      } catch (err) {
        console.error("Error fetching donation requests:", err);
        if (isMounted) {
          setDonations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [axiosPublic]);

  const filteredRequests = useMemo(() => {
    if (urgencyFilter === "all") return donations;
    return donations.filter(
      (item) => (item.urgencyLevel || "urgent") === urgencyFilter
    );
  }, [donations, urgencyFilter]);

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
              setDonations((prev) => prev.filter((req) => req._id !== id));
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

  const isOwner = (donation) => {
    return user && donation.requesterEmail && donation.requesterEmail.toLowerCase() === user.email?.toLowerCase();
  };

  const getEditPath = (id) => {
    if (role === "donor") {
      return `/donordashboard/update-donation-request/${id}`;
    } else if (role === "receiver") {
      return `/recipientdashboard/update-donation-request/${id}`;
    }
    // Default fallback
    return `/update-donation-request/${id}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-slate-400">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-900/20 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <PageTitle title={"Request"} />

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
            Blood Donation Requests
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Find urgent blood requests and be someone's hero
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-semibold text-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-700 outline-none cursor-pointer hover:bg-slate-800"
          >
            <option value="all" className="bg-slate-900">All Urgencies</option>
            <option value="critical" className="bg-slate-900">Critical (3h)</option>
            <option value="urgent" className="bg-slate-900">Urgent (24h)</option>
            <option value="flexible" className="bg-slate-900">Flexible (2-3 days)</option>
          </select>
        </div>

        {loading ? (
          <Loader label="Loading pending requests..." />
        ) : filteredRequests.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-2xl text-center backdrop-blur-sm">
            <div className="text-6xl mb-4 opacity-30 grayscale">🩸</div>
            <p className="text-slate-500 text-lg">
              No pending donation requests found.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[640px]">
                <thead className="bg-slate-900/80 border-b border-slate-800">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-slate-300">
                      Recipient
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-slate-300">
                      Location
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-slate-300">
                      Urgency
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-slate-300">
                      Date & Time
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-slate-300">
                      Blood Group
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-slate-300">
                      Ambulance
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-slate-300">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-bold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  {filteredRequests.map((donation) => (
                    <tr
                      key={donation._id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-2 sm:px-3 py-2 sm:py-3 font-medium text-left text-slate-200">
                        {donation.recipientName}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 text-left">
                        {donation.recipientDistrict}, {donation.recipientUpazila}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 text-left">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            donation.urgencyLevel === "critical"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : donation.urgencyLevel === "urgent"
                              ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          }`}
                        >
                          {donation.urgencyLevel || "urgent"}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 text-left">
                        {donation.donationDate}
                        <br />
                        <span className="text-xs text-slate-600">
                          {donation.donationTime}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 font-bold text-center text-slate-200">
                        {donation.bloodGroup}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs">
                        {donation.needsAmbulance ? (
                          <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                            SOS Linked
                          </span>
                        ) : (
                          <span className="text-slate-600">No</span>
                        )}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 capitalize text-center text-slate-500">
                        {donation.donationStatus}
                      </td>

                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/details/${donation._id}`}
                            className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs sm:text-sm font-medium"
                          >
                            View
                          </Link>
                          {isOwner(donation) && (
                            <>
                              <Link
                                to={getEditPath(donation._id)}
                                className="text-blue-400 hover:text-blue-300 hover:underline text-xs sm:text-sm font-medium"
                        >
                                Edit
                        </Link>
                              <button
                                onClick={() => handleDelete(donation._id)}
                                className="text-slate-400 hover:text-slate-300 hover:underline text-xs sm:text-sm font-medium"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resource Hub */}
        <section className="mt-16 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Lifesaver Support Hub
            </h3>
            <p className="text-slate-500">
              Triage urgent donor needs, dispatch ambulances, and find verified hematology
              clinics—all without leaving the Request center.
            </p>
          </div>
          <UrgencyMatrix />
          <AmbulanceDirectory />
          <ClinicHighlights />
        </section>
      </div>
    </div>
  );
}
