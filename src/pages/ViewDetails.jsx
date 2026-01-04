import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";
import { useParams, Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/axiosPublic";
import useRole from "../hooks/useRole";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import QRCode from "react-qr-code";

export default function ViewDetails() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const [details, setDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ID) {
      setLoading(false);
      setError("Invalid request ID");
      return;
    }
    
    let isMounted = true;
    
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try authenticated endpoint first
        let res;
        try {
          res = await axiosSecure.get(`/details/${ID}`);
        } catch (authError) {
          // If auth fails and user is not logged in, try public endpoint
          if (!user && (authError.response?.status === 401 || authError.response?.status === 403)) {
            // Try to get from public requests list and find the matching one
            try {
              const publicRes = await axiosPublic.get("/all-donation-requests-public");
              const found = publicRes.data?.find((req) => req._id === ID);
              if (found) {
                res = { data: found };
              } else {
                throw new Error("Request not found");
              }
            } catch (publicError) {
              throw authError; // Re-throw auth error
            }
          } else {
            throw authError;
          }
        }
        
        if (isMounted) {
          if (res.data) {
            setDetails(res.data);
          } else {
            setError("Request details not found");
          }
        }
      } catch (err) {
        console.error("Error fetching request details:", err);
        if (isMounted) {
          const errorMessage = err.response?.data?.message || err.message || "Failed to load request details";
          setError(errorMessage);
          
          // If it's an auth error, suggest login
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError("Please log in to view request details");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [ID, axiosSecure, axiosPublic, user]);

  if (loading) {
    return <Loader label="Loading donation details..." full={true} />;
  }

  if (error || !details) {
    const isAuthError = error?.toLowerCase().includes("log in") || error?.toLowerCase().includes("auth") || error?.toLowerCase().includes("401") || error?.toLowerCase().includes("403");
    
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🩸</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Details</h2>
          <p className="text-slate-400 mb-4">{error || "Request details not found"}</p>
          <div className="flex gap-4 justify-center">
            {isAuthError && (
              <Link
                to={`/login?redirect=${encodeURIComponent(`/details/${ID}`)}`}
                className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Log In
              </Link>
            )}
            <Link
              to="/request"
              className="inline-block px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back to Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    requesterName,
    requesterEmail,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
    donationStatus,
    urgencyLevel,
    unitsNeeded,
    needsAmbulance,
    patientCondition,
    hospitalPhone,
    aiRecommendations,
  } = details;

  const handleConfirmDonation = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to be logged in to confirm donation.",
      });
      setShowModal(false);
      navigate("/login");
      return;
    }

    try {
      setShowModal(false);
      
      // Step 1: Update donation status
      const res = await axiosSecure.patch("/donation-status", {
        id: details._id,
        donationStatus: "inprogress",
      });

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        // Step 2: Save donor info
        const donorInfo = {
          donorName: user?.displayName || user?.name,
          donorEmail: user?.email,
          donationId: details._id,
          createdAt: new Date(),
        };

        try {
          const donorRes = await axiosPublic.post("/add-donor", donorInfo);

          if (donorRes.data.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Donation In Progress!",
              text: `Thank you ${user?.displayName || user?.name} for your generosity.`,
              timer: 2000,
            }).then(() => {
              // Update local state and refresh
              setDetails({ ...details, donationStatus: "inprogress" });
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: "warning",
              title: "Donor Not Saved",
              text: "Donation status updated, but donor info wasn't saved.",
            });
            setDetails({ ...details, donationStatus: "inprogress" });
          }
        } catch (donorError) {
          console.error("Error saving donor info:", donorError);
          // Status is updated, so still show success
          Swal.fire({
            icon: "success",
            title: "Donation Status Updated!",
            text: "Donation is now in progress.",
            timer: 2000,
          });
          setDetails({ ...details, donationStatus: "inprogress" });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "No changes made",
          text: "Donation status was not updated. It may already be in progress.",
        });
      }
    } catch (error) {
      console.error("Error confirming donation:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong while confirming the donation.",
      });
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("request-qr");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(blob);
    const img = new Image();
    img.onload = function handleImg() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      const png = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = png;
      link.download = "bloodbridge-request-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = url;
  };

  const isOwner = () => {
    return user && requesterEmail && requesterEmail.toLowerCase() === user.email?.toLowerCase();
  };

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
              Swal.fire(
                "Deleted!",
                "Your request has been deleted.",
                "success"
              ).then(() => {
                navigate("/request");
              });
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

  const getEditPath = () => {
    if (role === "donor") {
      return `/donordashboard/update-donation-request/${details._id}`;
    } else if (role === "receiver") {
      return `/recipientdashboard/update-donation-request/${details._id}`;
    }
    // Default fallback
    return `/update-donation-request/${details._id}`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen py-6 sm:py-8 bg-slate-950">
      <PageTitle title={"Details"} />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Blood Donation Request
        </h2>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
              urgencyLevel === "critical"
                ? "bg-orange-900/60 text-orange-400 border border-orange-800"
                : urgencyLevel === "urgent"
                ? "bg-orange-900/50 text-orange-400 border border-orange-800"
                : "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
            }`}
          >
            {urgencyLevel || "urgent"}
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-800/50 text-slate-300 border border-slate-700">
            Units needed: {unitsNeeded || 1}
          </span>
        </div>
        <div
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            donationStatus === "pending"
              ? "bg-yellow-900/50 text-yellow-400 border border-yellow-800"
              : donationStatus === "inprogress"
              ? "bg-blue-900/50 text-blue-400 border border-blue-800"
              : donationStatus === "done"
              ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
              : "bg-slate-800/50 text-slate-400 border border-slate-700"
          }`}
        >
          Status: {donationStatus.toUpperCase()}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 sm:p-6 shadow-lg backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Requester Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-2 sm:mb-3">
                Requester Information
              </h3>
              <div className="space-y-2 text-slate-300">
                <p>
                  <strong className="text-white">Name:</strong> {requesterName}
                </p>
                <p>
                  <strong className="text-white">Email:</strong> {requesterEmail}
                </p>
              </div>
            </div>

            {/* Recipient Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-2 sm:mb-3">
                Recipient Information
              </h3>
              <div className="space-y-2 text-slate-300">
                <p>
                  <strong className="text-white">Name:</strong> {recipientName}
                </p>
                <p>
                  <strong className="text-white">Location:</strong> {recipientUpazila},{" "}
                  {recipientDistrict}
                </p>
                <p>
                  <strong className="text-white">Hospital:</strong> {hospitalName}
                </p>
                {hospitalPhone && (
                  <p>
                    <strong className="text-white">Hospital Phone:</strong>{" "}
                    <a href={`tel:${hospitalPhone}`} className="text-emerald-400 hover:text-emerald-300">
                      {hospitalPhone}
                    </a>
                  </p>
                )}
                <p>
                  <strong className="text-white">Address:</strong> {fullAddress}
                </p>
                {patientCondition && (
                  <p>
                    <strong className="text-white">Condition:</strong> {patientCondition}
                  </p>
                )}
                <p>
                  <strong className="text-white">Ambulance:</strong>{" "}
                  {needsAmbulance ? "Required / linked" : "Not requested"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Donation Details */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-2 sm:mb-3">
                Donation Details
              </h3>
              <div className="space-y-2 text-slate-300">
                <p>
                  <strong className="text-white">Blood Group:</strong>{" "}
                  <span className="text-emerald-400 font-bold">
                    {bloodGroup}
                  </span>
                </p>
                <p>
                  <strong className="text-white">Date:</strong> {donationDate}
                </p>
                <p>
                  <strong className="text-white">Time:</strong> {donationTime}
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-2 sm:mb-3">
                Message
              </h3>
              <div className="bg-slate-800/50 p-4 rounded-lg border-2 border-slate-700 shadow-sm">
                <p className="text-slate-300 text-base leading-relaxed">
                  {requestMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations & QR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {Array.isArray(aiRecommendations) && aiRecommendations.length > 0 && (
          <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/40">
            <h3 className="text-lg font-semibold text-white mb-3">
              Auto-matched donors
            </h3>
            <ul className="space-y-2 text-sm">
              {aiRecommendations.map((rec) => (
                <li key={rec.email} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 flex justify-between">
                  <div>
                    <p className="font-semibold text-white">{rec.name}</p>
                    <p className="text-xs text-slate-400">
                      {rec.upazila}, {rec.district}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    Score {rec.score}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="border border-dashed border-slate-700 rounded-2xl p-4 text-center bg-slate-900/40">
          <p className="font-semibold text-white mb-3">Scan to verify request</p>
          <div className="inline-block bg-white p-4 rounded-2xl shadow-inner">
            <QRCode id="request-qr" value={`bloodbridge:request:${details._id}`} size={140} />
          </div>
          <button
            onClick={handleDownloadQR}
            className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold"
          >
            Download QR
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-6 sm:mt-8">
        {isOwner() ? (
          // Show Edit and Delete buttons for owner
          <div className="flex items-center justify-center gap-4">
            <Link
              to={getEditPath()}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(details._id)}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Delete
            </button>
          </div>
        ) : (
          // Show Confirm Donation button for non-owners
          <button
            onClick={() => {
              if (
                donationStatus !== "inprogress" &&
                donationStatus !== "done" &&
                donationStatus !== "canceled"
              ) {
                setShowModal(true);
              }
            }}
            disabled={
              donationStatus === "inprogress" ||
              donationStatus === "done" ||
              donationStatus === "canceled"
            }
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 cursor-pointer ${
              donationStatus === "inprogress" ||
              donationStatus === "done" ||
              donationStatus === "canceled"
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {donationStatus === "inprogress"
              ? "Donation in Progress"
              : donationStatus === "done"
              ? "Donation Completed"
              : donationStatus === "canceled"
              ? "Request Canceled"
              : "Confirm Donation"}
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl transition-colors"
              type="button"
            >
              ×
            </button>

            <h3 className="text-2xl font-semibold text-emerald-400 mb-6 text-center">
              Confirm Donation
            </h3>

            {!user ? (
              <div className="text-center py-4">
                <p className="text-slate-400 mb-4">Please log in to confirm donation.</p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Donor Name
                    </label>
                    <input
                      type="text"
                      value={user?.displayName || ""}
                      readOnly
                      className="w-full border border-slate-700 rounded-lg px-4 py-3 bg-slate-800/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Donor Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full border border-slate-700 rounded-lg px-4 py-3 bg-slate-800/50 text-white"
                    />
                  </div>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-emerald-400 font-semibold">
                    ⚠️ By confirming, you agree to donate blood and will be
                    contacted for further details.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="px-6 py-3 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDonation}
                    type="button"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Confirm Donation
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
