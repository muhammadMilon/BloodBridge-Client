import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import Loader from "./Loader";

export default function PendingRequests() {
  const axiosPublic = useAxiosPublic();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    axiosPublic
      .get("/all-donation-requests-public")
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        const pendingOnly = data.filter(
          (d) => String(d.donationStatus).toLowerCase() === "pending"
        );
        setItems(pendingOnly.slice(0, 6));
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load pending requests.");
      })
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-3 text-white">
          Urgent Pending Requests
        </h2>
        <p className="text-slate-400 text-lg">
          These patients are waiting for your help.
        </p>
      </div>

      {loading ? (
        <Loader label="Loading requests..." />
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center opacity-70 text-slate-500">
          No pending requests right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article
              key={item._id}
              className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-gray-100">
                  {item.recipientName}
                </h3>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 border border-rose-900/30 text-rose-400 font-bold shadow-sm">
                    {item.bloodGroup}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                      item.urgencyLevel === "critical"
                        ? "bg-red-900/20 text-red-400 border-red-900/30"
                        : item.urgencyLevel === "urgent"
                        ? "bg-orange-900/20 text-orange-400 border-orange-900/30"
                        : "bg-emerald-900/20 text-emerald-400 border-emerald-900/30"
                    }`}
                  >
                    {item.urgencyLevel || "urgent"}
                  </span>
                </div>
              </div>
              <div className="text-sm text-slate-400 space-y-3">
                <p className="flex items-start">
                  <span className="font-semibold text-slate-600 mr-2">📍</span>
                  <span>
                    {item.recipientDistrict}, {item.recipientUpazila}
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-slate-600 mr-2">🕒</span>
                  <span>
                    {item.donationDate} at {item.donationTime}
                  </span>
                </p>
                <p className="flex items-start capitalize">
                  <span className="font-semibold text-slate-600 mr-2">📋</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-yellow-900/20 text-yellow-500 border border-yellow-900/30 text-xs font-semibold">
                    {item.donationStatus}
                  </span>
                </p>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-800/50">
                  Units needed: {item.unitsNeeded || 1} •{" "}
                  {item.needsAmbulance ? "Ambulance on standby" : "No ambulance needed"}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  to={`/details/${item._id}`}
                  className="block text-center px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-bold transition-all shadow-sm"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/request"
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 font-bold transition-all transform hover:-translate-y-1"
        >
          Browse All Requests
        </Link>
      </div>
    </section>
  );
}
