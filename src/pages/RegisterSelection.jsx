import { motion } from "framer-motion";
import { BiDroplet, BiHeart } from "react-icons/bi";
import { Link } from "react-router";
import PageTitle from "../components/PageTitle";

const RegisterSelection = () => {
  return (
    <div className="bg-slate-950 min-h-screen py-20 flex items-center relative overflow-hidden">
      <PageTitle title={"Choose Registration Type"} />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [-20, 20, -20], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 left-10 text-9xl text-slate-800 opacity-20"
          >
             🩸
          </motion.div>
          <motion.div
            animate={{ y: [20, -20, 20], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 right-10 text-9xl text-slate-800 opacity-20"
          >
             ❤️
          </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Join Our Community
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Choose how you'd like to participate in our mission to save lives
          </p>
        </div>

        <div className="flex justify-center items-stretch gap-8 lg:gap-12 flex-col lg:flex-row max-w-5xl mx-auto">
          {/* Donor Registration Card */}
          <Link
            to="/register/donor"
            className="group flex-1 w-full max-w-md bg-slate-900/50 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-800 hover:border-emerald-500/50 shadow-xl hover:shadow-emerald-900/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="text-center flex-1 flex flex-col">
              <div className="mx-auto inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 group-hover:border-emerald-500/50 group-hover:scale-110 mb-6 transition-all duration-300 shadow-inner">
                <BiDroplet className="text-4xl text-emerald-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Register as Donor
              </h2>
              <p className="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
                Save lives by donating blood. Join thousands of heroes making a difference in their communities.
              </p>
              <ul className="text-left space-y-3 mb-8 text-sm text-slate-400 flex-1">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Health assessment tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Donation history & reminders</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Reward points & recognition</span>
                </li>
              </ul>
              <div className="px-6 py-4 bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl font-bold group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                Become a Donor
              </div>
            </div>
          </Link>

          {/* Recipient Registration Card */}
          <Link
            to="/register/recipient"
            className="group flex-1 w-full max-w-md bg-slate-900/50 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-800 hover:border-emerald-500/50 shadow-xl hover:shadow-emerald-900/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="text-center flex-1 flex flex-col">
              <div className="mx-auto inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 group-hover:border-emerald-500/50 group-hover:scale-110 mb-6 transition-all duration-300 shadow-inner">
                <BiHeart className="text-4xl text-emerald-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Register as Recipient
              </h2>
              <p className="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
                Need blood? Register to request donations and connect with donors in your area.
              </p>
              <ul className="text-left space-y-3 mb-8 text-sm text-slate-400 flex-1">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Quick blood request system</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Connect with nearby donors</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Urgency level management</span>
                </li>
              </ul>
              <div className="px-6 py-4 bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl font-bold group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                Register as Recipient
              </div>
            </div>
          </Link>
        </div>

        {/* Happy Community Animation Replacement */}
        <div className="flex justify-center mt-20 relative h-32 opacity-80 mix-blend-luminosity">
           <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-7xl absolute grayscale hover:grayscale-0 transition-all duration-500"
           >
              🤝
           </motion.div>
           <motion.div
              animate={{ x: [-50, -30, -50], rotate: [-10, 0, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl absolute -left-20 top-10 grayscale hover:grayscale-0 transition-all duration-500"
           >
              🙌
           </motion.div>
            <motion.div
              animate={{ x: [50, 30, 50], rotate: [10, 0, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="text-5xl absolute -right-20 top-10 grayscale hover:grayscale-0 transition-all duration-500"
           >
              🥰
           </motion.div>
        </div>

        {/* Login link */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:underline font-bold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;

