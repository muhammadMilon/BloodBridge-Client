import { Link } from "react-router";

const Featured = () => {
  return (
    <section className=" py-12 px-6 md:px-20 text-center rounded-2xl shadow-md my-10">
      <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-4">
        Donate Blood, Save Lives ❤️
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto text-lg mb-6">
        A single pint can save up to three lives. Your small act of kindness can
        make a big difference. Join our mission to make blood accessible to
        everyone in need.
      </p>
      <Link
        to="/request"
        className="inline-block mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
      >
        Request Blood
      </Link>
      <Link
        to="/registration"
        className="inline-block mt-4 ml-4 border-2 border-red-500 text-red-500 hover:bg-red-100 font-semibold py-2 px-6 rounded-full transition duration-300"
      >
        Become a Donor
      </Link>
    </section>
  );
};

export default Featured;
