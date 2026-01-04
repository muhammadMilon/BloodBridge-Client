import axios from "axios";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  BiDroplet,
  BiEnvelope,
  BiKey,
  BiPhone,
  BiUser,
} from "react-icons/bi";
import { GrLocationPin } from "react-icons/gr";
import { SlLocationPin } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import PageTitle from "../components/PageTitle";
import useAxiosPublic from "../hooks/axiosPublic";
import { AuthContext } from "../providers/AuthProvider";
import { getAvatarUrl } from "../utils/avatarHelper";

const RecipientRegister = () => {
  const goTo = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const { createUser, signIn } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "male",
    blood: "",
    district: "",
    districtId: "",
    upazila: "",
    pass: "",
    confirmPass: "",
    phone: "",
    urgencyLevel: "normal",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      gender,
      blood,
      district,
      upazila,
      pass,
      confirmPass,
      phone,
      urgencyLevel,
    } = formData;

    if (pass !== confirmPass) {
      setErrorMsg("Passwords do not match!");
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    setErrorMsg("");
    setLoadingSave(true);

    try {
      const res = await createUser(email, pass, name, {
          image: getAvatarUrl(gender),
          gender,
          bloodGroup: blood,
          district,
          upazila,
          phone,
          role: "receiver",
          status: "active",
          urgencyLevel,
      });

      Swal.fire("Success", "Recipient registration completed successfully!", "success");

      // Sign in automatically
      await signIn(email, pass);

      goTo(location?.state || "/recipientdashboard");
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
    <div className="bg-slate-950 min-h-screen py-20 flex items-center relative overflow-hidden">
      <PageTitle title={"Register as Recipient"} />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-40 left-10 w-40 h-40 bg-emerald-900/20 rounded-full filter blur-3xl"
          />
          <motion.div
             animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute bottom-40 right-10 w-60 h-60 bg-slate-800/40 rounded-full filter blur-3xl"
          />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center items-start gap-12 lg:gap-20 flex-col lg:flex-row">
          
          {/* Left Side: Form */}
          <div className="flex-1 w-full max-w-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Register as Recipient
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Create an account to request blood donations
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/50 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 shadow-2xl rounded-2xl border border-slate-800"
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <BiUser className="text-2xl text-slate-500 flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base placeholder-slate-600"
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Gender
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <BiEnvelope className="text-2xl text-slate-500 flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base placeholder-slate-600"
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <BiPhone className="text-2xl text-slate-500 flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base placeholder-slate-600"
                  type="tel"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Blood Group */}
              <div className="flex items-center gap-3">
                <BiDroplet className="text-2xl text-slate-500 flex-shrink-0" />
                <select
                  name="blood"
                  value={formData.blood}
                  onChange={handleChange}
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base [&>option]:bg-slate-900 [&>option]:text-white"
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
              <div className="flex items-center gap-3">
                <SlLocationPin className="text-2xl text-slate-500 flex-shrink-0" />
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base [&>option]:bg-slate-900 [&>option]:text-white"
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
              <div className="flex items-center gap-3">
                <GrLocationPin className="text-2xl text-slate-500 flex-shrink-0" />
                <select
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base [&>option]:bg-slate-900 [&>option]:text-white"
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

              {/* Urgency Level */}
              <div className="border border-slate-800 rounded-2xl p-5 space-y-3 bg-slate-800/30">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Urgency Level
                </label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="w-full border border-slate-700 rounded-xl px-3 py-2 bg-slate-800/50 text-white text-sm focus:border-emerald-500 outline-none [&>option]:bg-slate-900"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
                <p className="text-xs text-slate-500">
                  Select the urgency level for your typical blood needs
                </p>
              </div>

              {/* Password */}
              <div className="flex items-center gap-3">
                <BiKey className="text-2xl text-slate-500 flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base placeholder-slate-600"
                  type="password"
                  name="pass"
                  placeholder="Enter Password"
                  value={formData.pass}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="flex items-center gap-3">
                <BiKey className="text-2xl text-slate-500 flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-colors text-white text-sm sm:text-base placeholder-slate-600"
                  type="password"
                  name="confirmPass"
                  placeholder="Confirm Password"
                  value={formData.confirmPass}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Error */}
              {errorMsg && (
                <p className="text-red-400 text-xs sm:text-sm text-center font-medium bg-red-900/20 py-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              {/* Links */}
              <div className="flex flex-col gap-2 text-center text-xs sm:text-sm text-slate-500 mt-2">
                <div>
                  Have an account?{" "}
                  <Link
                    to="/login"
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Login
                  </Link>
                </div>
                <div>
                  Want to donate blood?{" "}
                  <Link
                    to="/register/donor"
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Register as Donor
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="cursor-pointer px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg hover:shadow-emerald-900/20 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                disabled={loadingSave}
              >
                {loadingSave ? "Registering..." : "Register as Recipient"}
              </button>
            </form>
          </div>

          {/* Right Side: Animation */}
          <div className="hidden lg:flex flex-1 w-full max-w-md justify-center items-center relative h-[600px] sticky top-20">
             {/* Central Heart Icon */}
             <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-[180px] drop-shadow-2xl z-20 relative text-emerald-600"
             >
                ❤️
             </motion.div>

              {/* Floating Hands */}
             <motion.div
                animate={{ y: [10, -10, 10], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 text-8xl z-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
             >
                🤲
             </motion.div>

             {/* Small plus signs */}
             <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute top-10 right-20 text-4xl text-emerald-400"
             >
                ➕
             </motion.div>
             <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 left-20 text-3xl text-emerald-400"
             >
                ➕
             </motion.div>
             
             <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl -z-10"
              />

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientRegister;

