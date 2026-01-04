const Loader = ({ label = "Loading...", full = false }) => {
  return (
    <div className={`${full ? "min-h-screen bg-slate-950" : "min-h-[200px]"} w-full flex flex-col items-center justify-center gap-4`}>
      <div className="relative flex items-center justify-center">
        {/* Spinning Outer Ring */}
        <div className="w-20 h-20 rounded-full border-4 border-slate-700 border-t-rose-800 animate-spin"></div>
        {/* Logo in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-rose-800/20 flex items-center justify-center">
            <span className="text-rose-700 text-2xl">🩸</span>
          </div>
        </div>
      </div>
      <p className="text-rose-700 font-medium animate-pulse">{label}</p>
    </div>
  );
};

export default Loader;


