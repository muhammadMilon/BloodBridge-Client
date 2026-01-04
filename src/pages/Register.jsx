import axios from "axios";
import Lottie from "lottie-react";
import { useContext, useEffect, useState } from "react";
import {
    BiCalendar,
    BiDroplet,
    BiEnvelope,
    BiImageAdd,
    BiKey,
    BiPulse,
    BiUser,
} from "react-icons/bi";
import { GrLocationPin } from "react-icons/gr";
import { SlLocationPin } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import happy from "../assets/happy.json";
import PageTitle from "../components/PageTitle";
import useAxiosPublic from "../hooks/axiosPublic";
import { AuthContext } from "../providers/AuthProvider";

const Register = () => {
  const goTo = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const { createUser, setUser, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    blood: "",
    district: "",
    districtId: "",
    upazila: "",
    pass: "",
    confirmPass: "",
    availabilityStatus: "available",
    lastDonationDate: "",
    hemoglobinLevel: "",
    healthNotes: "",
    reminderEmail: true,
    reminderSMS: false,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [healthFlags, setHealthFlags] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [userType, setUserType] = useState("donor"); // "donor" or "recipient"

  useEffect(() => {
    const fetchData = async () => {
      const [districtRes, upazilaRes] = await Promise.all([
        axios.get("/districts.json"),
        axios.get("/upazilas.json"),
      ]);
      setDistricts(districtRes.data);
      setUpazilas(upazilaRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.districtId) {
      const filtered = upazilas.filter(
        (u) => u.district_id === formData.districtId
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.districtId, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const selectedName = e.target.value;
    const selectedDistrict = districts.find((d) => d.name === selectedName);
    setFormData((prev) => ({
      ...prev,
      district: selectedName,
      districtId: selectedDistrict ? selectedDistrict.id : "",
      upazila: "",
    }));
  };

  const toggleHealthFlag = (value) => {
    setHealthFlags((prev) =>
      prev.includes(value) ? prev.filter((flag) => flag !== value) : [...prev, value]
    );
  };

  const healthChecklist = [
    { label: "No chronic illness", value: "no-chronic" },
    { label: "No recent surgery", value: "no-surgery" },
    { label: "Hemoglobin within safe range", value: "hb-stable" },
    { label: "Blood pressure normal", value: "bp-stable" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      image,
      blood,
      district,
      upazila,
      pass,
      confirmPass,
      availabilityStatus,
      lastDonationDate,
      hemoglobinLevel,
      healthNotes,
      reminderEmail,
      reminderSMS,
    } = formData;

    if (pass !== confirmPass) {
      setErrorMsg("Passwords do not match!");
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    setErrorMsg("");
    setLoadingSave(true);

    try {
      const res = await createUser(email, pass);
      await updateUser({ displayName: name, photoURL: image });

      try {
        await axiosPublic.post("/add-user", {
          name,
          email,
          image,
          bloodGroup: blood,
          district,
          upazila,
          role: userType === "recipient" ? "receiver" : "donor",
          status: "active",
          availabilityStatus,
          lastDonationDate,
          healthAssessment: {
            hemoglobinLevel,
            notes: healthNotes,
            flags: healthFlags,
            lastUpdated: new Date().toISOString(),
          },
          reminderPreferences: {
            email: reminderEmail,
            sms: reminderSMS,
          },
        });
      } catch (dbError) {
        console.error("Failed to save user in database:", dbError);
        // Continue registration even if DB write fails
      }

      Swal.fire("Success", "Registration completed successfully!", "success");

      setUser({
        ...res.user,
        displayName: name,
        photoURL: image,
        bloodGroup: blood,
        district,
        upazila,
        role: userType === "recipient" ? "receiver" : "donor",
        status: "active",
        availabilityStatus,
      });

      goTo(location?.state || "/");
    } catch (error) {
      console.error("Registration failed:", error);
      const message =
        error?.code === "auth/email-already-in-use"
          ? "This email is already registered. Please log in instead."
          : error?.message || "Registration failed. Try again.";
      Swal.fire("Error", message, "error");
      setErrorMsg(message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20">
      <PageTitle title={"Register"} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-2">
            Join Our Community
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Register to become a lifesaver today
          </p>
        </div>

        <div className="flex justify-between items-start gap-8 lg:gap-12 flex-col lg:flex-row">
          {/* Form */}
          <div className="flex-1 w-full max-w-lg">
            <form
              onSubmit={handleSubmit}
              className="glass p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 shadow-2xl rounded-2xl border border-rose-200"
            >
              {/* User Type Toggle */}
              <div className="flex items-center justify-center gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setUserType("donor")}
                  className={`flex-1 px-3 py-2 rounded-full text-sm font-semibold border ${
                    userType === "donor"
                      ? "bg-rose-600 text-white border-rose-600"
                      : "border-rose-200 text-rose-600 bg-white"
                  }`}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("recipient")}
                  className={`flex-1 px-3 py-2 rounded-full text-sm font-semibold border ${
                    userType === "recipient"
                      ? "bg-rose-600 text-white border-rose-600"
                      : "border-rose-200 text-rose-600 bg-white"
                  }`}
                >
                  Recipient
                </button>
              </div>
              {/* Name */}
              <div className="flex items-center gap-2">
                <BiUser className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Image */}
              <div className="flex items-center gap-2">
                <BiImageAdd className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                  type="text"
                  name="image"
                  placeholder="Enter Image URL"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <BiEnvelope className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Blood Group */}
              <div className="flex items-center gap-2">
                <BiDroplet className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <select
                  name="blood"
                  value={formData.blood}
                  onChange={handleChange}
                  className="outline-none flex-1 border-b p-2 bg-white focus:border-highlighted border-border text-text text-sm sm:text-base"
                  required
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

              {/* District */}
              <div className="flex items-center gap-2">
                <SlLocationPin className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="outline-none flex-1 border-b p-2 bg-white focus:border-highlighted border-border text-text text-sm sm:text-base"
                  required
                >
                  <option value="">Select District</option>
                  {districts.sort((a, b) => a.name.localeCompare(b.name)).map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila */}
              <div className="flex items-center gap-2">
                <GrLocationPin className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <select
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  className="outline-none flex-1 border-b p-2 bg-white focus:border-highlighted border-border text-text text-sm sm:text-base"
                  required
                >
                  <option value="">Select Upazila</option>
                  {filteredUpazilas.sort((a, b) => a.name.localeCompare(b.name)).map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className="flex items-center gap-2">
                <BiKey className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                  type="password"
                  name="pass"
                  placeholder="Enter Password"
                  value={formData.pass}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="flex items-center gap-2">
                <BiKey className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                  type="password"
                  name="confirmPass"
                  placeholder="Confirm Password"
                  value={formData.confirmPass}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Availability + History */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.3em]">
                    Availability
                  </label>
                  <select
                    name="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2 mt-2 bg-white text-sm"
                  >
                    <option value="available">Ready to Donate</option>
                    <option value="resting">Resting (90-day cooldown)</option>
                    <option value="medical-review">Medical Review</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.3em] flex items-center gap-1">
                    <BiCalendar /> Last Donation
                  </label>
                  <input
                    type="date"
                    name="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2 mt-2 bg-white text-sm"
                  />
                </div>
              </div>


              {/* Health Self Assessment */}
              <div className="border border-rose-100 rounded-2xl p-4 space-y-4 bg-white/70">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <BiPulse /> Health self-assessment
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Hemoglobin (g/dL)
                    </label>
                    <input
                      type="number"
                      name="hemoglobinLevel"
                      value={formData.hemoglobinLevel}
                      onChange={handleChange}
                      className="w-full border border-border rounded-lg px-3 py-2 mt-2 bg-white text-sm"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Notes
                    </label>
                    <input
                      type="text"
                      name="healthNotes"
                      value={formData.healthNotes}
                      onChange={handleChange}
                      placeholder="Any medications, wellness notes..."
                      className="w-full border border-border rounded-lg px-3 py-2 mt-2 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {healthChecklist.map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={healthFlags.includes(item.value)}
                        onChange={() => toggleHealthFlag(item.value)}
                        className="accent-rose-600"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Reminder Preference */}
              <div className="border border-rose-100 rounded-2xl p-4 space-y-3 bg-white/70">
                <p className="text-sm font-semibold text-slate-700">
                  Donation reminders (we ping you ~90 days after donation)
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="reminderEmail"
                    checked={formData.reminderEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, reminderEmail: e.target.checked }))
                    }
                    className="accent-rose-600"
                  />
                  Email reminders
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="reminderSMS"
                    checked={formData.reminderSMS}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, reminderSMS: e.target.checked }))
                    }
                    className="accent-rose-600"
                  />
                  SMS reminders & nearby donation drives
                </label>
              </div>

              {/* Error */}
              {errorMsg && (
                <p className="text-highlighted text-xs sm:text-sm text-center font-medium">
                  {errorMsg}
                </p>
              )}

              {/* Login link */}
              <div className="p-1 flex gap-2 text-xs sm:text-sm text-text opacity-80">
                <span>Have an account?</span>
                <Link
                  to="/login"
                  className="text-highlighted hover:underline font-medium"
                >
                  Login
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="cursor-pointer px-4 py-2.5 sm:py-3 rounded-lg bg-cta text-btn-text font-semibold text-sm sm:text-base hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingSave}
              >
                {loadingSave ? "Registering..." : "Register Now"}
              </button>
            </form>
          </div>

          {/* Lottie Animation */}
          <div className="lottie flex-1 w-full max-w-md lg:max-w-lg mx-auto">
            <Lottie animationData={happy} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
