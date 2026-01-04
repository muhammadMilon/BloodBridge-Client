import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import { AuthContext } from "../providers/AuthProvider";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Banner = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [activeDonors, setActiveDonors] = useState(0);

  useEffect(() => {
    axiosPublic
      .get("/get-donors")
      .then((res) => {
        const active = res.data.filter(
          (donor) => donor.role === "donor" && donor.status === "active"
        ).length;
        setActiveDonors(active);
      })
      .catch((err) => console.error("Error fetching donors:", err));
  }, []);

  const slides = [
    {
      img: "https://i.dawn.com/primary/2025/07/1719085944184e5.jpg",
      title1: "Be Someone’s",
      title2: "Hope & Hero",
      text: "Donate blood and save lives today.",
      link: "/search",
      btn: "Find a Donor",
    },
    {
      img: "https://nhsbtdbe.blob.core.windows.net/umbraco-assets-corp/12022/platelet-donation-process.jpg",
      title1: "Know the",
      title2: "Donation Process",
      text: "Learn how blood donation works and why it matters.",
      link: "/donation-process",
      btn: "Learn More",
    },
    {
      img: "https://images.seattletimes.com/wp-content/uploads/2022/10/202210111813MCT_____PHOTO____US-NEWS-MED-BLOOD-GROUP-SYSTEM-GET.jpg?d=2040x1360",
      title1: "Discover",
      title2: "Blood Groups",
      text: "Understand blood types to ensure safe transfusions.",
      link: "/blood-groups",
      btn: "Explore Groups",
    },
    {
      img: "https://media.sheerluxe.com/UT_jSBhBTAffnME_UqGMMduMSC4=/800x0/smart/https%3A%2F%2Fsheerluxe.com%2Fsites%2Fsheerluxe%2Ffiles%2Farticles%2F2018%2F06%2Fdonating-blood.jpg?itok=1Vu_6gwu",
      title1: "Become a",
      title2: "Life Saver",
      text: "Join our donor community now!",
      link: "/donor-registration",
      btn: "Register Now",
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-16 bg-slate-950">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-950 to-slate-900"></div>

      {/* Animated blob (Dark Mode adapted) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-slate-700 to-emerald-900 rounded-full mix-blend-screen filter blur-3xl"
        />
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop={true}
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* LEFT SIDE TEXT */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 sm:space-y-8 text-center lg:text-left"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                    <span className="text-slate-300">
                      {slide.title1}
                    </span>
                    <br />
                    <span className="text-white">
                      {slide.title2}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    {slide.text}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
                    <Link
                      to={slide.link}
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 transform hover:-translate-y-1 transition-all duration-300"
                    >
                      {slide.btn}
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto lg:mx-0">
                    <div className="text-center p-3 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800">
                      <div className="text-3xl font-black text-white">
                        1000+
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Active Donors
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800">
                      <div className="text-3xl font-black text-white">
                        5000+
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Lives Saved
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800">
                      <div className="text-3xl font-black text-white">
                        24/7
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Support
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT SIDE IMAGE */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-center lg:justify-end relative"
                >
                  <img
                    src={slide.img}
                    alt="banner-slide"
                    className="w-full max-w-[1400px] h-[500px] sm:h-[600px] object-cover rounded-3xl shadow-2xl border-4 border-slate-700/50"
                  />
                </motion.div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
