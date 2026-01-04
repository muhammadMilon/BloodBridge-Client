import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageTitle from "../../components/PageTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import { getAvatarUrl } from "../../utils/avatarHelper";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    gender: "male",
    district: "",
    upazila: "",
    bloodGroup: "",
    status: "active",
  });
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  // Fetch DB user data in background
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get("/get-user")
        .then(res => {
          const data = res.data;
          setDbUser(data);
          setFormData(prev => ({
            ...prev,
            name: data.name || user.displayName || "",
            gender: data.gender || "male",
            district: data.district || "",
            upazila: data.upazila || "",
            bloodGroup: data.bloodGroup || "",
            status: data.status || "active",
          }));
        })
        .catch(err => console.error("Background fetch failed", err));
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Need DB ID for update
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
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <PageTitle title="Receiver Profile" />
      
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col items-center mb-8">
              <div className="relative">
                 <img 
                    src={dbUser?.image || dbUser?.photoURL || getAvatarUrl(dbUser?.gender || formData.gender)} 
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = getAvatarUrl(dbUser?.gender || formData.gender);
                    }}
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full border border-slate-700/50"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mt-4">{formData.name}</h2>
              <p className="text-slate-400">{user?.email}</p>
              <span className="mt-2 px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700">
                  {dbUser?.role || "receiver"}
              </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
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

              {/* Gender */}
              <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Gender</label>
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

               {/* Blood Group - Read Only or Editable? Editable for now as per Donor demands */}
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/70 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      {saving ? "Saving Changes..." : "Save Profile Changes"}
                  </button>
              </div>
          </form>
      </div>
    </div>
  );
}
