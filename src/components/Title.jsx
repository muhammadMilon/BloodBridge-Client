import { motion } from "framer-motion";

const Title = ({ children }) => {
  return (
    <div className="relative border-s-8 border-rose-400 ps-3 md:ps-4 py-2 my-4">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.h2>
      <motion.p
        className="absolute bottom-0 text-4xl sm:text-5xl md:text-6xl lg:text-8xl -z-10 opacity-5 select-none pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.p>
    </div>
  );
};

export default Title;
