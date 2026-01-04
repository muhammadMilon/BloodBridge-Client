import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import useAxiosPublic from "../../hooks/axiosPublic";
import useRole from "../../hooks/useRole";
import useStatus from "../../hooks/useStatus";
import { AuthContext } from "../../providers/AuthProvider";

const CreateDonationRequest = () => {
  const axiosPublic = useAxiosPublic();
  const { status, loading } = useStatus();
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset error on mount
  useEffect(() => {
    setError(null);
  }, []);

  // Show loader if user is not loaded yet
  if (!user && !error) {
    return <Loader label="Loading..." full={true} />;
  }

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [suggestedDonors, setSuggestedDonors] = useState([]);

  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
    urgencyLevel: "critical",
    unitsNeeded: 1,
    patientCondition: "",
    hospitalPhone: "",
    needsAmbulance: true,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        requesterName: user.displayName || "",
        requesterEmail: user.email || "",
      }));
    }
  }, [user]);

  // Optimize: Load districts and upazilas in parallel
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const [districtsRes, upazilasRes] = await Promise.all([
          fetch("/districts.json").then(res => res.json()),
          fetch("/upazilas.json").then(res => res.json())
        ]);
        setDistricts(districtsRes);
        setUpazilas(upazilasRes);
      } catch (err) {
        console.error("Failed to load location data:", err);
        toast.error("Failed to load location data");
      }
    };
    loadLocationData();
  }, []);

  // Fetch donors only once
  useEffect(() => {
    let isMounted = true;
    
    const fetchDonors = async () => {
      try {
        const { data } = await axiosPublic.get("/get-donors");
        if (isMounted) {
          setDonors(data || []);
        }
      } catch (err) {
        console.error("Error fetching donors:", err);
        if (isMounted) {
          setDonors([]);
        }
      }
    };

    fetchDonors();

    return () => {
      isMounted = false;
    };
  }, [axiosPublic]);

  // Filter upazilas based on selected district
  useEffect(() => {
    if (formData.recipientDistrict && districts.length > 0 && upazilas.length > 0) {
      const selectedDist = districts.find((d) => d.id === formData.recipientDistrict);
      if (selectedDist) {
        const filtered = upazilas.filter(
          (u) => u.district_id === selectedDist.id
        );
        setFilteredUpazilas(filtered);
      } else {
        setFilteredUpazilas([]);
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.recipientDistrict, districts, upazilas]);

  const selectedDistrict = useMemo(
    () => districts.find((d) => d.id === formData.recipientDistrict),
    [districts, formData.recipientDistrict]
  );

  useEffect(() => {
    if (!formData.bloodGroup) {
      setSuggestedDonors([]);
      return;
    }
    const scored = donors
      .filter((donor) => donor.status === "active" && donor.role === "donor")
      .map((donor) => {
        let score = 0;
        if (donor.bloodGroup === formData.bloodGroup) score += 5;
        if (donor.district === selectedDistrict?.name) score += 3;
        if (donor.upazila === formData.recipientUpazila) score += 2;
        if (donor.availabilityStatus === "available") score += 4;
        if (donor.lastDonationDate) {
          const diff =
            (Date.now() - new Date(donor.lastDonationDate).getTime()) /
            (1000 * 60 * 60 * 24);
          if (diff > 90) score += 2;
          if (diff < 60) score -= 3;
        }
        return { ...donor, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    setSuggestedDonors(scored);
  }, [
    donors,
    formData.bloodGroup,
    formData.recipientUpazila,
    selectedDistrict?.name,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Determine redirect path based on role or current location
  const getMyRequestsPath = () => {
    if (location.pathname.includes('/donordashboard')) {
      return '/donordashboard/my-donation-requests';
    }
    if (location.pathname.includes('/recipientdashboard')) {
      return '/recipientdashboard/my-donation-requests';
    }
    if (role === 'donor') {
      return '/donordashboard/my-donation-requests';
    }
    if (role === 'receiver') {
      return '/recipientdashboard/my-donation-requests';
    }
    return '/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || submitting) {
      if (loading) {
        toast.loading("Checking user status, please wait...");
      }
      return;
    }
    if (status === "blocked") {
      toast.error(
        "Your request cannot be processed as your account is blocked. Please contact the administrator."
      );
      return;
    }
    
    setSubmitting(true);
    const dataToSubmit = {
      ...formData,
      recipientDistrict: selectedDistrict?.name || "",
      donationStatus: "pending",
      unitsNeeded: Number(formData.unitsNeeded || 1),
      needsAmbulance: Boolean(formData.needsAmbulance),
      locationGeo: selectedDistrict
        ? {
            lat: Number(selectedDistrict.lat),
            lng: Number(selectedDistrict.lon),
          }
        : null,
      aiRecommendations: suggestedDonors.map((donor) => ({
        name: donor.name,
        email: donor.email,
        district: donor.district,
        upazila: donor.upazila,
        score: donor.score,
        availabilityStatus: donor.availabilityStatus,
      })),
    };

    try {
      const response = await axiosPublic.post(
        "/create-donation-request",
        dataToSubmit
      );
      
      if (response.data.insertedId || response.data.acknowledged) {
        toast.success("Donation request submitted successfully!", {
          duration: 2000,
        });
        // Navigate to requests page after a short delay
        setTimeout(() => {
          navigate(getMyRequestsPath());
        }, 500);
      } else {
        toast.error("Request submitted but confirmation failed");
      }
    } catch (error) {
      console.error("Error submitting donation request:", error);
      toast.error(error.response?.data?.message || "Failed to submit donation request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Form</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen bg-slate-950">
      <PageTitle title={"Create Donation Request"} />
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Create Donation Request
      </h2>
      <form onSubmit={handleSubmit} className="bg-slate-900/60 p-8 rounded-2xl space-y-6 border border-slate-800 backdrop-blur-sm">
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Requester Name
          </label>
          <input
            type="text"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            placeholder="Enter requester name"
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Requester Email
          </label>
          <input
            type="email"
            name="requesterEmail"
            value={formData.requesterEmail}
            readOnly
            className="w-full border-2 border-slate-700 p-3 rounded-lg bg-slate-800/70 text-slate-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Recipient Name
          </label>
          <input
            type="text"
            name="recipientName"
            placeholder="Recipient Name"
            value={formData.recipientName}
            onChange={handleChange}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all placeholder:text-slate-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              District
            </label>
            <select
              name="recipientDistrict"
              value={formData.recipientDistrict}
              onChange={handleChange}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all"
              required
            >
              <option value="">Select District</option>
              {districts.sort((a, b) => a.name.localeCompare(b.name)).map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Upazila
            </label>
            <select
              name="recipientUpazila"
              value={formData.recipientUpazila}
              onChange={handleChange}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all"
              required
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.sort((a, b) => a.name.localeCompare(b.name)).map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name}
                </option>
              ))}
            </select>
          </div>
        </div>

          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Urgency
            </label>
            <div className="flex gap-2">
              {["critical", "urgent", "flexible"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, urgencyLevel: level }))
                  }
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    formData.urgencyLevel === level
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-emerald-600"
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Units Needed
            </label>
            <input
              type="number"
              min="1"
              max="10"
              step="1"
              name="unitsNeeded"
              value={formData.unitsNeeded || 1}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setFormData((prev) => ({
                  ...prev,
                  unitsNeeded: value >= 1 ? value : 1,
                }));
              }}
            className="w-20 border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all"
              required
            />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Hospital Name
          </label>
          <input
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            value={formData.hospitalName}
            onChange={handleChange}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Full Address
          </label>
          <input
            type="text"
            name="fullAddress"
            placeholder="Full Address"
            value={formData.fullAddress}
            onChange={handleChange}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all placeholder:text-slate-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Hospital Contact Number
            </label>
            <input
              type="text"
              name="hospitalPhone"
              value={formData.hospitalPhone}
              onChange={handleChange}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all placeholder:text-slate-500"
              placeholder="Hospital or emergency desk phone"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Patient Condition
            </label>
            <input
              type="text"
              name="patientCondition"
              value={formData.patientCondition}
              onChange={handleChange}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all placeholder:text-slate-500"
              placeholder="Eg. Thalassemia crisis, surgery, trauma..."
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full border-2 border-slate-700 bg-slate-800/50 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/15 focus:border-rose-800 hover:border-slate-600 transition-all"
            required
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Donation Date
            </label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Donation Time
            </label>
            <input
              type="time"
              name="donationTime"
              value={formData.donationTime}
              onChange={handleChange}
              className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Request Message
          </label>
          <textarea
            name="requestMessage"
            placeholder="Why do you need blood?"
            value={formData.requestMessage}
            onChange={handleChange}
            className="w-full border-2 border-slate-700 bg-slate-800/70 text-white p-3 rounded-lg focus:ring-2 focus:ring-rose-900/20 focus:border-rose-800 hover:border-slate-600 transition-all placeholder:text-slate-500"
            rows="4"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {suggestedDonors.length > 0 && (
        <div className="mt-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">
            AI-matched donors nearby
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedDonors.map((donor) => (
              <div
                key={donor.email}
                className="border border-slate-700 rounded-2xl p-4 bg-slate-800/50"
              >
                <p className="font-semibold text-white">{donor.name}</p>
                <p className="text-sm text-slate-400">
                  {donor.upazila}, {donor.district}
                </p>
                <p className="text-sm mt-2 text-slate-300">
                  Score: <span className="font-bold text-rose-800">{donor.score}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Status: {donor.availabilityStatus || "available"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDonationRequest;
