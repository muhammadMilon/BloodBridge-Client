import { motion } from "framer-motion";
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-900/40 rounded-full blur-3xl opacity-50" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-900/40 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <img
          src="/error-404.png"
          alt="404 Not Found"
          className="w-full max-w-lg mx-auto mb-8 object-contain drop-shadow-2xl"
        />
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold rounded-xl shadow-lg border border-slate-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-slate-900/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
