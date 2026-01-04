import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/axiosPublic";
import useRole from "../../hooks/useRole";
import PageTitle from "../../components/PageTitle";
import Loader from "../../components/Loader";

export default function AllBloodDonationRequest() {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  console.log(role);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  //   useEffect(() => {
  //     if (!user) return;
  //     axiosSecure
  //       .get("/all-donation-requests")
  //       .then((res) => setDonations(res.data))
  //       .catch((err) => {
  //         console.error("Error fetching donation requests:", err);
  //       })
  //       .finally(() => setLoading(false));
  //   }, [user]);

  useEffect(() => {
    if (!user) return;

    axiosSecure
      .get("/all-donation-requests")
      .then(async (res) => {
        const donations = res.data;
        setDonations(donations);

        const donorData = {};
        await Promise.all(
          donations.map(async (donation) => {
            try {
              const donorRes = await axiosSecure.get(
                `/find-donor?donationId=${donation._id}`
              );
              if (donorRes.data.length > 0) {
                donorData[donation._id] = donorRes.data[0];
              }
            } catch (err) {
              console.error("Error fetching donor for donation:", donation._id);
            }
          })
        );
        setDonors(donorData);
      })
      .catch((err) => {
        console.error("Error fetching donation requests:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);
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
    <div className="px-4 py-6 bg-slate-950 min-h-screen">
      <PageTitle title={"All Donation Request"} />
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        All Donation Requests
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
              filterStatus === status
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <Loader label="Loading requests..." />
      ) : filteredDonations.length === 0 ? (
        <p className="text-center text-slate-400 py-8">
          No donation requests found.
        </p>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[800px]">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-200">
                    Recipient
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-200">
                    Location
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-200">
                    Date & Time
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-200">
                    Blood Group
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-200">
                    Status
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-200">
                    Donor Info
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, i) => (
                  <tr
                    key={donation._id}
                    className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${
                      i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                    }`}
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-200">
                      {donation.recipientName}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-400">
                      {donation.recipientDistrict}, {donation.recipientUpazila}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-400">
                      {donation.donationDate} <br />
                      <span className="text-xs opacity-75">
                        {donation.donationTime}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className="inline-block px-2 py-1 bg-emerald-900/50 text-emerald-400 border border-emerald-700 rounded text-xs sm:text-sm font-medium">
                        {donation.bloodGroup}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          donation.donationStatus === "done"
                            ? "bg-green-100 text-green-700"
                            : donation.donationStatus === "inprogress"
                            ? "bg-blue-100 text-blue-700"
                            : donation.donationStatus === "canceled"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {donation.donationStatus}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-400">
                      {donors[donation._id] ? (
                        <>
                          <div className="font-medium text-xs sm:text-sm text-slate-200">
                            {donors[donation._id].donorName}
                          </div>
                          <div className="text-xs opacity-75">
                            {donors[donation._id].donorEmail}
                          </div>
                        </>
                      ) : (
                        <span className="opacity-50 italic">—</span>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {/* Only show these actions if NOT a volunteer */}
                        {role !== "volunteer" && (
                          <>
                            <Link
                              to={`/details/${donation._id}`}
                              className="text-blue-400 hover:text-blue-300 hover:underline text-xs sm:text-sm font-medium"
                            >
                              View
                            </Link>
                            <Link
                              to={`/dashboard/update-donation-request/${donation._id}`}
                              className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs sm:text-sm font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(donation._id)}
                              className="text-orange-400 hover:text-orange-300 hover:underline text-xs sm:text-sm font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {donation.donationStatus === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(donation._id, "done")
                              }
                              className="text-green-600 hover:underline text-xs sm:text-sm font-medium"
                            >
                              Done
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(donation._id, "canceled")
                              }
                              className="text-yellow-600 hover:underline text-xs sm:text-sm font-medium"
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
