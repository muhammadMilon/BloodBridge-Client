import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useParams, useNavigate, useLocation } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useRole from "../hooks/useRole";
import Swal from "sweetalert2";

export default function UpdateDonationRequest() {
  const { ID } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();
  const [details, setDetails] = useState(null);

  // Determine the correct navigation path based on role or current location
  const getMyRequestsPath = () => {
    // Check if we're in a specific dashboard route
    if (location.pathname.includes('/donordashboard')) {
      return '/donordashboard/my-donation-requests';
    }
    if (location.pathname.includes('/recipientdashboard')) {
      return '/recipientdashboard/my-donation-requests';
    }
    if (location.pathname.includes('/admindashboard')) {
      return '/admindashboard/all-blood-donation-request';
    }
    // Fallback based on role
    if (role === 'donor') {
      return '/donordashboard/my-donation-requests';
    }
    if (role === 'receiver') {
      return '/recipientdashboard/my-donation-requests';
    }
    if (role === 'admin') {
      return '/admindashboard/all-blood-donation-request';
    }
    // Default fallback
    return '/dashboard';
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosSecure.get(`/get-donation-request/${ID}`);
        setDetails(res.data);
      } catch (error) {
        console.error("Error fetching request details:", error);
        Swal.fire("Error", "Failed to load request details. Please try again.", "error");
      }
    };
    if (ID) {
      fetchDetails();
    }
  }, [ID, axiosSecure]);

  if (!details) return <Loader label="Loading request..." full={true} />;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedRequest = {
      requesterName: form.requesterName.value,
      requesterEmail: details.requesterEmail, // keep email from original data
      recipientName: form.recipientName.value,
      recipientDistrict: form.recipientDistrict.value,
      recipientUpazila: form.recipientUpazila.value,
      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
      donationStatus: details.donationStatus, // preserve status
    };

    try {
      const res = await axiosSecure.put(
        `/update-donation-request/${ID}`,
        updatedRequest
      );

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Request updated successfully.",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate(getMyRequestsPath());
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "No changes",
          text: "No changes were made to the request.",
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to update request. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMsg
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen bg-slate-950">
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Update Donation Request
      </h2>
      <form onSubmit={handleUpdate} className="bg-slate-900/60 p-8 rounded-2xl space-y-6 border border-slate-800 backdrop-blur-sm">
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Requester Name
          </label>
          <input
            type="text"
            name="requesterName"
            defaultValue={details.requesterName}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Requester Email
          </label>
          <input
            type="email"
            name="requesterEmail"
            defaultValue={details.requesterEmail}
            className="w-full border-2 border-slate-700 bg-slate-800/50 text-slate-400 p-3 rounded-lg"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Recipient Name
          </label>
          <input
            type="text"
            name="recipientName"
            defaultValue={details.recipientName}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              District
            </label>
            <input
              type="text"
              name="recipientDistrict"
              defaultValue={details.recipientDistrict}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Upazila
            </label>
            <input
              type="text"
              name="recipientUpazila"
              defaultValue={details.recipientUpazila}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Hospital Name
          </label>
          <input
            type="text"
            name="hospitalName"
            defaultValue={details.hospitalName}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Full Address
          </label>
          <textarea
            name="fullAddress"
            defaultValue={details.fullAddress}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Blood Group
            </label>
            <input
              type="text"
              name="bloodGroup"
              defaultValue={details.bloodGroup}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Status
            </label>
            <input
              type="text"
              name="donationStatus"
              defaultValue={details.donationStatus}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-slate-400 capitalize p-3 rounded-lg"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Date
            </label>
            <input
              type="date"
              name="donationDate"
              defaultValue={details.donationDate}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Time
            </label>
            <input
              type="time"
              name="donationTime"
              defaultValue={details.donationTime}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Request Message
          </label>
          <textarea
            name="requestMessage"
            defaultValue={details.requestMessage}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 transition-all"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Update Request
        </button>
      </form>
    </div>
  );
}
