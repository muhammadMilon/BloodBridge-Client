import { useContext } from "react";
import { FiActivity, FiClipboard, FiCoffee, FiHeart } from "react-icons/fi";
import { AuthContext } from "../providers/AuthProvider";

const DonationProcess = () => {
  const { user } = useContext(AuthContext);
  const steps = [
    {
      icon: <FiClipboard className="w-8 h-8" />,
      title: "Registration",
      description:
        "Fill out a simple health questionnaire and provide basic information",
      duration: "10 minutes",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: <FiActivity className="w-8 h-8" />,
      title: "Health Screening",
      description:
        "Quick check of blood pressure, temperature, and hemoglobin levels",
      duration: "15 minutes",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Blood Donation",
      description: "Safe and sterile blood collection by trained professionals",
      duration: "10-15 minutes",
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-50",
    },
    {
      icon: <FiCoffee className="w-8 h-8" />,
      title: "Rest & Refresh",
      description: "Relax with refreshments and snacks after your donation",
      duration: "10 minutes",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm font-semibold text-emerald-400 mb-4">
            Simple & Safe Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            How Blood Donation Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Your journey to saving lives is simple and takes less than an hour
          </p>
        </div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-800 via-emerald-900/40 to-slate-800 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Card */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/20 hover:border-emerald-500/30 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-slate-800 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 text-white mb-6 group-hover:scale-110 transition-transform duration-300 mt-4 border border-slate-700 shadow-inner`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-100 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Duration Badge */}
                  <div
                    className={`inline-block px-4 py-2 bg-slate-800 rounded-full border border-slate-700`}
                  >
                    <span className="text-sm font-semibold text-slate-300">
                      ⏱️ {step.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Ready to Save Lives?
            </h3>
            <p className="text-slate-400 mb-8">
              The entire process takes less than an hour, but your impact lasts
              a lifetime
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <a
                  href="/registration"
                  className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-900/40 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Register as Donor
                </a>
              )}
              <a
                href="/blood-helper"
                className="inline-block px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-300 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-800 hover:text-white hover:border-slate-500 transform hover:-translate-y-1 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationProcess;
