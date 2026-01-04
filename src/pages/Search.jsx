import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import useAxiosPublic from "../hooks/axiosPublic";
import { getAvatarUrl } from "../utils/avatarHelper";

const Search = () => {
  const axiosPublic = useAxiosPublic();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [donorHistory, setDonorHistory] = useState({});
  const [chartData, setChartData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    districtId: "",
    upazila: "",
    thana: "",
    availability: "",
  });
  const [availableThanas, setAvailableThanas] = useState([]);

  // Load districts and upazilas
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [districtRes, upazilaRes] = await Promise.all([
                axios.get("/districts.json"),
                axios.get("/upazilas.json"),
            ]);
            setDistricts(districtRes.data);
            setUpazilas(upazilaRes.data);
        } catch (error) {
            console.error("Failed to load location data", error);
        }
    };
    fetchData();
  }, []);

  // Fetch all donors for statistics
  useEffect(() => {
      axiosPublic.get("/get-donors")
      .then(res => {
          const allDonors = res.data;
          console.log("Donor Stats Data:", allDonors); 
          // Calculate chart data
          const counts = {};
          allDonors.forEach(d => {
              if (d.bloodGroup) {
                  counts[d.bloodGroup] = (counts[d.bloodGroup] || 0) + 1;
              }
          });
          
          const total = Object.values(counts).reduce((a, b) => a + b, 0);
          const data = Object.entries(counts).map(([name, value]) => ({
              name,
              value,
              percentage: ((value / total) * 100).toFixed(1)
          }));
          setChartData(data);
      })
      .catch(err => console.error("Failed to load donor stats", err));
  }, [axiosPublic]);

  useEffect(() => {
    axiosPublic
      .get("/donor-history")
      .then(({ data }) => {
        const mapping = {};
        data.forEach((item) => {
          mapping[item._id] = item;
        });
        setDonorHistory(mapping);
      })
      .catch(() => {
        setDonorHistory({});
      });
  }, [axiosPublic]);

  // Update filtered upazilas based on district selection
  useEffect(() => {
    if (formData.districtId) {
      const filtered = upazilas.filter(
        (u) => String(u.district_id) === String(formData.districtId)
      );
      console.log("Filtering upazilas for districtId:", formData.districtId, "Found:", filtered.length);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
      setAvailableThanas([]);
    }
  }, [formData.districtId, upazilas]);

  // Update available thanas when upazila changes (for Dhaka)
  useEffect(() => {
    if (formData.upazila && formData.district === "Dhaka") {
      const selectedUpazila = filteredUpazilas.find((u) => u.name === formData.upazila);
      if (selectedUpazila && selectedUpazila.thana && Array.isArray(selectedUpazila.thana)) {
        setAvailableThanas(selectedUpazila.thana);
      } else {
        setAvailableThanas([]);
      }
    } else {
      setAvailableThanas([]);
      if (formData.thana) {
        setFormData((prev) => ({ ...prev, thana: "" }));
      }
    }
  }, [formData.upazila, formData.district, filteredUpazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When district changes, update both name & id
    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selectedDistrict ? selectedDistrict.id : "",
        upazila: "",
        thana: "",
      }));
    } else if (name === "upazila") {
      setFormData((prev) => ({
        ...prev,
        upazila: value,
        thana: "", // Reset thana when upazila changes
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    setSearchLoading(true);

    try {
      const res = await axiosPublic.get("/get-donors");
      const allDonors = res.data;
      setDonors(allDonors);

      // Filter based on formData
      const filtered = allDonors.filter((donor) => {
        // Backend already filters by role: "donor"
        // Relaxing status check - if status is undefined, assume active, or check if specific status requested
        const matchesStatus = formData.availability 
            ? donor.availabilityStatus === formData.availability 
            : true; // If no availability selected, show all (active/inactive logic handled by backend or implied)

        return (
          (formData.bloodGroup
            ? donor.bloodGroup === formData.bloodGroup
            : true) &&
          (formData.district ? donor.district === formData.district : true) &&
          (formData.upazila ? donor.upazila === formData.upazila : true) &&
          (formData.thana ? donor.thana === formData.thana : true) &&
          matchesStatus
        );
      });

      setSearchResult(filtered);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const badgeForDonations = (count = 0) => {
    if (count >= 5) return { label: "Gold", color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" };
    if (count >= 3) return { label: "Silver", color: "bg-slate-500/20 text-slate-300 border border-slate-500/30" };
    if (count >= 1) return { label: "Bronze", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30" };
    return null;
  };

  const COLORS = ["#FF5252", "#FF4081", "#E040FB", "#7C4DFF", "#536DFE", "#448AFF", "#18FFFF", "#69F0AE"];

  return (
    <div className="min-h-screen bg-slate-950 py-12 relative overflow-hidden">
      <PageTitle title={"Search"} />
    
        {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/10 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-800/10 rounded-full blur-3xl" />
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
        <div className="text-center mb-12">
            <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                <span className="text-gray-400">Find a </span>
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Blood Donor
                </span>
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Connect with local donors available in your area precisely when you need them.
              </p>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSearch}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 mb-16 max-w-5xl mx-auto"
        >
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${formData.district === "Dhaka" && availableThanas.length > 0 ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-4 mb-6`}>
            {/* Blood Group */}
            <div className="relative group">
                <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750"
                >
                <option value="" className="bg-slate-800 text-gray-400">Blood Group</option>
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
            <div className="relative">
                <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750"
                >
                <option value="" className="bg-slate-800 text-gray-400">District</option>
                {districts.sort((a, b) => a.name.localeCompare(b.name)).map((district) => (
                    <option key={district.id} value={district.name}>
                    {district.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Upazila */}
            <div className="relative">
                <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!filteredUpazilas.length}
                >
                <option value="" className="bg-slate-800 text-gray-400">Upazila</option>
                {filteredUpazilas.sort((a, b) => a.name.localeCompare(b.name)).map((u) => (
                    <option key={u.id} value={u.name}>
                    {u.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Thana (only for Dhaka) */}
            {formData.district === "Dhaka" && availableThanas.length > 0 && (
              <div className="relative">
                <select
                  name="thana"
                  value={formData.thana}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750"
                >
                  <option value="" className="bg-slate-800 text-gray-400">Thana</option>
                  {availableThanas.sort((a, b) => a.localeCompare(b)).map((thana, index) => (
                    <option key={index} value={thana}>
                      {thana}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Availability */}
            <div className="relative">
                <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750"
                >
                <option value="" className="bg-slate-800 text-gray-400">Availability</option>
                <option value="available">Available Now</option>
                <option value="resting">Resting</option>
                <option value="medical-review">Medical Review</option>
                </select>
            </div>

             {/* Search Button */}
             <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-white border border-slate-600 rounded-xl px-6 py-3 font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-700/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                Search
            </button>
          </div>
        </motion.form>

        {/* Stats Chart */}
        {!hasSearched && chartData.length > 0 && (
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto mb-16"
            >
                <h3 className="text-2xl text-white font-bold mb-8 text-center">Donor Distribution Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Chart Column */}
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '12px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Statistics List Column */}
                    <div className="space-y-3">
                        {chartData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full shadow-sm" 
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="font-bold text-gray-200">Blood Group {item.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 text-sm font-medium">{item.value} Donors</span>
                                    <span className="text-white font-bold bg-slate-700/50 px-2 py-1 rounded-lg text-xs min-w-[50px] text-center">
                                        {item.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}

        {/* Loading State */}
        {searchLoading && (
          <Loader label="Searching for donors..." />
        )}

        {/* Search Result */}
        {!searchLoading && searchResult.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResult.map((donor, index) => {
              const history = donorHistory[donor.email] || {};
              const badge = badgeForDonations(history.totalDonations);
              const verified = history.totalDonations > 0;
              return (
              <motion.div
                key={donor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-slate-600 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-900/30 overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="relative inline-block mb-4">
                    <img
                      src={donor.image || donor.photoURL || getAvatarUrl(donor.gender)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getAvatarUrl(donor.gender);
                      }}
                      alt={donor.name}
                      className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-slate-700 shadow-xl group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-slate-600">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-200 line-clamp-1 group-hover:text-white transition-colors">
                      {donor.name}
                    </h3>
                    {verified && (
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-700 text-gray-300 text-xs" title="Verified Donor">
                         ✓
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-3">
                    <span className="line-clamp-1">
                       {donor.upazila}, {donor.district}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-4">
                    <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700 capitalize text-gray-400">
                      {donor.availabilityStatus || "available"}
                    </span>
                    {badge && (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 break-all p-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer mb-3">
                    <span className="line-clamp-1">{donor.email}</span>
                  </div>

                  {/* Phone Number Display */}
                  {donor.phone && (
                    <div className="mb-3">
                      <div className="text-xs text-slate-500 mb-1">Mobile Number</div>
                      <div className="text-sm font-semibold text-gray-300">{donor.phone}</div>
                    </div>
                  )}

                  {/* Contact Button */}
                  {donor.phone ? (
                    <a
                      href={`tel:${donor.phone}`}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Contact
                    </a>
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-2">
                      Phone number not available
                    </div>
                  )}
                </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!searchLoading && hasSearched && searchResult.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 flex flex-col items-center justify-center"
          >
            <img 
              src="/NotFound.png" 
              alt="No Donors Found" 
              className="w-full max-w-md object-contain mb-8 hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-3xl font-bold text-gray-300 mb-2">No Donors Found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search criteria to find available donors.</p>
          </motion.div>
        )}
        
        {/* Empty State / Initial State Animations */}
        {!hasSearched && searchResult.length === 0 && (
            <div className="flex justify-center items-center py-20 relative h-64">
                 <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-8xl absolute text-slate-700"
                    style={{ opacity: 0.2, filter: 'blur(2px)' }}
                 >
                    🩸
                 </motion.div>
                 
                  <motion.div
                    animate={{ x: [-50, 50, -50], y: [20, -20, 20] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="text-6xl absolute top-10 left-1/4 opacity-10 text-slate-600"
                 >
                    🔍
                 </motion.div>

                  <motion.div
                    animate={{ x: [50, -50, 50], y: [-20, 20, -20] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    className="text-6xl absolute bottom-10 right-1/4 opacity-10 text-slate-600"
                 >
                    🏥
                 </motion.div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Search;
