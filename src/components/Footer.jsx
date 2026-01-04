import {
    FiFacebook,
    FiHeart,
    FiInstagram,
    FiLinkedin,
    FiMail,
    FiMapPin,
    FiPhone,
    FiTwitter,
} from "react-icons/fi";
import { Link } from "react-router";

const Footer = () => {
  const logoSrc = "/Logo.png";
  const quickLinks = [
    { name: "Search Donors", path: "/search" },
    { name: "Blood Requests", path: "/request" },
    { name: "Blog", path: "/blog" },
    { name: "Help Center", path: "/help-center" },
  ];

  const resources = [
    { name: "Blood Helper", path: "/blood-helper" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 border-t border-slate-900 text-slate-400">
        {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-900/40 rounded-full blur-3xl opacity-50" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-900/40 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 inline-block group">
              <img
                src={logoSrc}
                alt="BloodBridge logo"
                className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform"
                style={{ backgroundColor: "transparent", mixBlendMode: "normal" }}
              />
              <span className="text-2xl font-black tracking-tight text-gray-100 group-hover:text-white transition-colors">
                BloodBridge
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bridging the gap between donors and patients in need. We believe
              every drop counts, and every donor serves as a beacon of hope.
              Join our mission to create a healthier, safer community.
            </p>
            <div className="flex items-center gap-2">
              <FiHeart className="text-slate-300 w-5 h-5" />
              <span className="text-sm font-semibold text-slate-300">
                Empowering lives through compassion – one donation at a time
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-gray-100 mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-100 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <FiMapPin className="text-slate-300 w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FiPhone className="text-slate-300 w-5 h-5 flex-shrink-0" />
                <span className="break-all">+8801700000000</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FiMail className="text-slate-300 w-5 h-5 flex-shrink-0" />
                <span className="break-all">admin@bloodbridge.com</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: <FiFacebook />, link: "#" },
                  { icon: <FiTwitter />, link: "#" },
                  { icon: <FiInstagram />, link: "#" },
                  { icon: <FiLinkedin />, link: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold text-slate-300">BloodBridge</span>. All
              rights reserved. Made with{" "}
              <FiHeart className="inline text-slate-400 animate-pulse" /> for
              humanity.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
