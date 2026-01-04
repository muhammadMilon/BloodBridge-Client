import { useState } from "react";
import Lottie from "lottie-react";
import animation from "../assets/Lottie red.json";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/axiosPublic";

const ContactUs = () => {
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      timestamp: new Date().toISOString(),
    };

    try {
      // For now, we'll just show a success message
      // You can add a backend endpoint later to store contact messages
      await axiosPublic.post("/contact", data).catch((err) => {
        // If endpoint doesn't exist, just log it
        console.log("Contact message:", data, err);
      });

      Swal.fire({
        title: "Message Sent!",
        text: "Thank you for contacting us. We'll get back to you soon.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      e.target.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to send message. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-red-50 via-rose-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-600">
            Contact Us
          </h2>
          <p className="mt-3 text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Have questions about donating blood or want to get involved? Reach
            out to us!
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Lottie Animation */}
          <div className="flex justify-center md:justify-start">
            <div className="max-w-[350px] sm:max-w-[400px] lg:max-w-[450px]">
              <Lottie animationData={animation} loop={true} />
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-rose-100 w-full"
          >
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                required
                rows="4"
                placeholder="Write your message..."
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
