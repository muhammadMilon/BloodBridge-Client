import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { BiEnvelope, BiKey } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import PageTitle from "../components/PageTitle";
import useAxiosPublic from "../hooks/axiosPublic";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { signIn, googleSignIn, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect path (default to "/")
  // Check both location.state and URL search params for redirect
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");
  const from = location?.state || redirectParam || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (user?.email) {
      // Get user role and redirect accordingly
      axiosSecure
        .get("/get-user-role")
        .then((res) => {
          const role = res.data?.role;
          if (role === "admin") {
            navigate("/admindashboard", { replace: true });
          } else if (role === "donor") {
            navigate("/donordashboard", { replace: true });
          } else if (role === "receiver") {
            navigate("/recipientdashboard", { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        })
        .catch(() => {
          navigate(from, { replace: true });
        });
    }
  }, [user, navigate, from, axiosSecure]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const pass = form.pass.value;

    signIn(email, pass)
      .then(async (res) => {
        Swal.fire({
          title: "Welcome Back!",
          text: "You have successfully logged in.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        
        // Get role from login response or fetch it
        let role = res?.data?.user?.role;
        
        if (!role) {
          try {
            const roleRes = await axiosSecure.get("/get-user-role");
            role = roleRes.data?.role;
          } catch (err) {
            console.error("Failed to get user role:", err);
          }
        }
        
        // Redirect based on role
        if (role === "admin") {
          navigate("/admindashboard", { replace: true });
        } else if (role === "donor") {
          navigate("/donordashboard", { replace: true });
        } else if (role === "receiver") {
          navigate("/recipientdashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        const errorMessage = err.message || err.response?.data?.message || "Invalid email or password.";
        Swal.fire("Login Failed", errorMessage, "error");
      });
  };

  const handleGoogleLogin = () => {
    googleSignIn()
      .then(async (result) => {
        const user = result.user;
        try {
          // 1. Sync user to database (create if not exists)
          // We try to get user role first to see if they exist
          let role = "donor"; // Default
          
          try {
             // Check if user exists by trying to add them. 
             // The /add-user endpoint returns "user already exist" if they do, or creates them.
             // It also handles the ID token verification ideally, but here we just send profile data.
             await axiosPublic.post("/add-user", {
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
                role: "donor", 
                status: "active",
                loginCount: 1,
                availabilityStatus: "available",
             });
          } catch(e) {
             console.log("User sync error (might be duplicate, which is fine):", e);
          }

          // 2. Create Backend Session
          const loginRes = await axiosPublic.post("/social-login", {
             email: user.email
          });

          // 3. Redirect based on role
          if (loginRes.data && loginRes.data.user) {
             role = loginRes.data.user.role;
             
             Swal.fire({
                title: "Welcome!",
                text: "You have successfully signed in with Google.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });

             if (role === "admin") {
                navigate("/admindashboard", { replace: true });
              } else if (role === "donor") {
                navigate("/donordashboard", { replace: true });
              } else if (role === "receiver") {
                navigate("/recipientdashboard", { replace: true });
              } else {
                navigate(from, { replace: true });
              }
          }

        } catch (err) {
          console.error("Google login backend sync failed", err);
          Swal.fire(
            "Login Failed",
            "Could not establish session with server.",
            "error"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire(
          "Google Sign-in Failed",
          "We couldn't complete your Google login. Please try again.",
          "error"
        );
      });
  };

  return (
    <div className="bg-slate-950 min-h-screen py-20 flex items-center relative overflow-hidden">
      <PageTitle title={"Login"} />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-10 right-10 w-96 h-96 bg-emerald-900/20 rounded-full filter blur-3xl"
          />
          <motion.div
             animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute bottom-10 left-10 w-80 h-80 bg-slate-800/40 rounded-full filter blur-3xl"
          />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center items-center gap-12 lg:gap-20 flex-col lg:flex-row">
          
          {/* Left Side - Login Form */}
          <div className="flex-1 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Login to continue your life-saving journey
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/50 backdrop-blur-md p-6 sm:p-10 flex flex-col gap-6 shadow-2xl rounded-2xl border border-slate-800"
            >
              {/* Email */}
              <div className="flex justify-start items-center gap-3">
                <BiEnvelope className="text-2xl text-slate-500 flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-all duration-200 text-white text-sm sm:text-base placeholder-slate-600"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-start items-center gap-3">
                  <BiKey className="text-2xl text-slate-500 flex-shrink-0" />
                  <input
                    className="outline-none flex-1 border-b border-slate-700 py-2 bg-transparent focus:border-emerald-500 transition-all duration-200 text-white text-sm sm:text-base placeholder-slate-600"
                    type="password"
                    name="pass"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm text-slate-500 cursor-pointer hover:text-emerald-400 hover:underline transition-colors">
                    Forgot password?
                  </span>
                </div>
              </div>

              {/* Login Actions */}
              <input
                type="submit"
                value="Login Now"
                className="cursor-pointer w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-300 mt-4"
              />

              {/* Google login */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 border border-slate-700 rounded-xl py-3 text-sm sm:text-base font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all duration-200"
                >
                  <FcGoogle className="text-xl" />
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Register link */}
              <div className="flex flex-col gap-1 text-center text-xs sm:text-sm text-slate-500 mt-2">
                <p>
                  Don't have an account?{" "}
                  <Link
                    to="/registration"
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Side - Animation */}
          <div className="hidden lg:flex flex-1 w-full max-w-md justify-center items-center relative h-[500px]">
             
             {/* Central Lock Icon */}
             <motion.div
                animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-[140px] drop-shadow-2xl z-20 relative"
             >
                🔐
             </motion.div>

             {/* Floating Elements around */}
             <motion.div
                animate={{ x: [-30, 30, -30], y: [-20, 20, -20], rotate: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 text-6xl opacity-40 grayscale"
             >
                👤
             </motion.div>

             <motion.div
                animate={{ x: [30, -30, 30], y: [20, -20, 20], rotate: [0, -10, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-10 text-6xl opacity-40 grayscale"
             >
                🔑
             </motion.div>
             
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl -z-10"
              />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
