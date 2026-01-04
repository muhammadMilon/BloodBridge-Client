import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import useAxiosPublic from "../../hooks/axiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";

export default function DonationRequest() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();

  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch data when component mounts or location changes (ensures fresh data after navigation)
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/my-donation-request");
        if (isMounted) {
          const donations = res.data || [];
          setDonations(donations);
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
  }, [user, axiosSecure, location.pathname]); // Add location.pathname to refetch when navigating to this page

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/delete-request/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setDonations((prev) =>
                prev.filter((donation) => donation._id !== id)
              );
              Swal.fire(
                "Deleted!",
                "Your request has been deleted.",
                "success"
              );
            } else {
              Swal.fire("Error", "Deletion failed. Please try again.", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong.", "error");
          });
      }
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    Swal.fire({
      title: `Change status to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await axiosSecure.patch("/donation-status", {
          id,
          donationStatus: newStatus,
        });

        if (res.data.modifiedCount > 0) {
          setDonations((prev) =>
            prev.map((donation) =>
              donation._id === id
                ? { ...donation, donationStatus: newStatus }
                : donation
            )
          );
          Swal.fire("Success!", `Status updated to "${newStatus}".`, "success");
        } else {
          Swal.fire("Failed", "Status update failed. Try again.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    });
  };

  const filteredDonations =
    filterStatus === "all"
      ? donations
      : donations.filter((d) => d.donationStatus === filterStatus);

  return (
    <div className="px-4 py-6 min-h-screen bg-slate-950">
      <PageTitle title={"My Donation Request"} />
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        My Donation Requests
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${filterStatus === status
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <Loader label="Loading your requests..." />
      ) : filteredDonations.length === 0 ? (
        <p className="text-center text-slate-400 py-8">
          No donation requests found.
        </p>
      ) : (
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Recipient
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Blood Group
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Donor Info
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, i) => (
                  <tr
                    key={donation._id}
                    className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"
                      }`}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {donation.recipientName}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {donation.recipientDistrict}, {donation.recipientUpazila}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {donation.donationDate} <br />
                      <span className="text-xs opacity-75">
                        {donation.donationTime}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-emerald-900/50 text-emerald-400 rounded text-sm font-medium border border-emerald-800">
                        {donation.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${donation.donationStatus === "done"
                          ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
                          : donation.donationStatus === "inprogress"
                            ? "bg-blue-900/50 text-blue-400 border border-blue-800"
                            : donation.donationStatus === "canceled"
                              ? "bg-gray-800 text-gray-400 border border-gray-700"
                              : "bg-yellow-900/50 text-yellow-400 border border-yellow-800"
                          }`}
                      >
                        {donation.donationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {donation.donorDetails ? (
                        <>
                          <div className="font-medium text-white">
                            {donation.donorDetails.donorName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {donation.donorDetails.donorEmail}
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/details/${donation._id}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium"
                        >
                          View
                        </Link>
                        <Link
                          to={`/donordashboard/update-donation-request/${donation._id}`}
                          className="text-emerald-400 hover:text-emerald-300 hover:underline text-sm font-medium"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(donation._id)}
                          className="text-red-400 hover:text-red-300 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>

                        {donation.donationStatus === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(donation._id, "done")
                              }
                              className="text-emerald-400 hover:text-emerald-300 hover:underline text-sm font-medium"
                            >
                              Done
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(donation._id, "canceled")
                              }
                              className="text-yellow-400 hover:text-yellow-300 hover:underline text-sm font-medium"
                            >
                              Cancel
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
    </div>
  );
}
