import { useEffect, useState } from "react";
import { FiAward, FiHeart, FiTrendingUp, FiUsers } from "react-icons/fi";
import useAxiosPublic from "../hooks/axiosPublic";

const ImpactStatistics = () => {
  const axiosPublic = useAxiosPublic();
  const [stats, setStats] = useState({
    totalDonors: 0,
    activeDonors: 0,
    totalRequests: 0,
    completedRequests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axiosPublic.get("/public-stats");
        if (statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback: try individual endpoints
        try {
          const [donorsRes, requestsRes] = await Promise.all([
            axiosPublic.get("/get-donors"),
            axiosPublic.get("/all-donation-requests-public"),
          ]);

          const donors = donorsRes.data || [];
          const requests = requestsRes.data || [];

          setStats({
            totalDonors: donors.length,
            activeDonors: donors.filter(
              (d) => d.role === "donor" && d.status === "active"
            ).length,
            totalRequests: requests.length,
            completedRequests: requests.filter((r) => r.donationStatus === "done")
              .length,
          });
        } catch (fallbackError) {
          console.error("Fallback stats fetch also failed:", fallbackError);
        }
      }
    };

    fetchStats();
  }, [axiosPublic]);

  const impactCards = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Total Donors",
      value: stats.totalDonors,
      suffix: "+",
      description: "Registered blood donors in our community",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      accentColor: "text-blue-600",
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Active Donors",
      value: stats.activeDonors,
      suffix: "+",
      description: "Ready to donate and save lives",
      color: "from-rose-600 to-red-600",
      bgColor: "bg-rose-50",
      accentColor: "text-rose-600",
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Donation Requests",
      value: stats.totalRequests,
      suffix: "+",
      description: "Total blood requests received",
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-50",
      accentColor: "text-green-600",
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Lives Saved",
      value: stats.completedRequests * 3,
      suffix: "+",
      description: "Lives impacted through donations",
      color: "from-orange-600 to-orange-700",
      bgColor: "bg-orange-50",
      accentColor: "text-orange-600",
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm font-semibold text-slate-300 mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Together We're Saving Lives
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Every donation counts. See the real-time impact of our community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {impactCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/50 overflow-hidden hover:border-slate-700"
            >
              {/* Background Gradient Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              {/* Icon */}
              <div
                className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-slate-700`}
              >
                {card.icon}
              </div>

              {/* Value */}
              <div className="relative space-y-2">
                <h3
                  className={`text-4xl sm:text-5xl font-black text-white mb-2`}
                >
                  {card.value}
                  <span className="text-2xl text-slate-500">{card.suffix}</span>
                </h3>
                <h4 className="text-lg font-bold text-gray-200">
                  {card.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              ></div>
            </div>
          ))}
        </div>

        {/* Fun Facts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-center hover:border-slate-700 transition-all duration-300">
            <div className="text-4xl mb-4">🩸</div>
            <h4 className="text-lg font-bold text-gray-100 mb-2">
              One Donation
            </h4>
            <p className="text-slate-400 text-sm">
              Can save up to{" "}
              <span className="font-bold text-white">3 lives</span>
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-center hover:border-slate-700 transition-all duration-300">
            <div className="text-4xl mb-4">⏱️</div>
            <h4 className="text-lg font-bold text-gray-100 mb-2">
              Every 2 Seconds
            </h4>
            <p className="text-slate-400 text-sm">
              Someone needs{" "}
              <span className="font-bold text-white">blood</span> transfusion
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-center hover:border-slate-700 transition-all duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-bold text-gray-100 mb-2">
              38% Population
            </h4>
            <p className="text-slate-400 text-sm">
              Eligible to donate, but only{" "}
              <span className="font-bold text-white">3%</span> do
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Be Part of Our Growing Community
            </h3>
            <p className="text-slate-400 mb-8">
              Join thousands of donors who have made a difference
            </p>
            <a
              href="/search"
              className="inline-block px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl shadow-lg hover:shadow-slate-900/40 transform hover:-translate-y-1 transition-all duration-300"
            >
              Find Someone to Help Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStatistics;
