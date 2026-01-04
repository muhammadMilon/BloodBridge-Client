import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { ambulanceDirectory } from "../data/platformData";

const haversineKm = (a, b) => {
  if (!a || !b) return Infinity;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(R * c);
};

const AmbulanceDirectory = () => {
  const divisions = useMemo(
    () => ["All Divisions", ...new Set(ambulanceDirectory.map((a) => a.division))],
    []
  );
  const [division, setDivision] = useState("All Divisions");
  const [geoAccessDenied, setGeoAccessDenied] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoAccessDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => setGeoAccessDenied(true),
      { timeout: 7000 }
    );
  }, []);

  const filteredProviders = useMemo(() => {
    if (division === "All Divisions") return ambulanceDirectory;
    return ambulanceDirectory.filter((provider) => provider.division === division);
  }, [division]);

  const highlightedProvider = useMemo(() => {
    if (!filteredProviders.length) return null;
    if (!userLocation) return filteredProviders[0];

    return filteredProviders.reduce((closest, provider) => {
      const currentDistance = haversineKm(userLocation, provider.gps);
      const bestDistance = haversineKm(userLocation, closest.gps);
      return currentDistance < bestDistance ? provider : closest;
    }, filteredProviders[0]);
  }, [filteredProviders, userLocation]);

  const handleSOS = (provider) => {
    Swal.fire({
      icon: "success",
      title: "SOS dispatched",
      text: `BloodBridge has pinged ${provider.name}. They will call ${provider.hotline} within ${provider.etaMinutes} minutes.`,
      confirmButtonColor: "#e11d48",
    });
  };

  return (
    <section
      id="ambulance"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Emergency Ambulance Service
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Division-wise Verified Ambulances
          </h2>
          <p className="text-slate-400 max-w-2xl mt-2">
            GPS-enhanced routing prioritizes the closest verified ambulance provider. Use SOS to alert the crew instantly.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="border border-slate-700 rounded-xl px-4 py-3 bg-slate-800 text-gray-200 text-sm font-bold focus:ring-2 focus:ring-slate-600 outline-none"
          >
            {divisions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setUserLocation({
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude,
                    });
                    setGeoAccessDenied(false);
                  },
                  () => setGeoAccessDenied(true)
                );
              }
            }}
            className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold shadow-lg hover:shadow-slate-900/40 hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            GPS Locate 🚑
          </button>
        </div>
      </div>

      {geoAccessDenied && (
        <div className="p-4 border border-amber-900/50 bg-amber-950/30 rounded-2xl text-amber-500 text-sm font-medium">
          We could not access your GPS location. Select a division manually or enable location access for auto-detection.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => {
          const isHighlighted = highlightedProvider?.name === provider.name;
          return (
            <article
              key={provider.name}
              className={`relative bg-slate-900/40 backdrop-blur-sm border rounded-2xl p-6 flex flex-col gap-4 shadow-lg transition-transform ${
                isHighlighted ? "border-slate-600 scale-[1.02] shadow-slate-900/20" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {provider.verified && (
                <span className="absolute top-4 right-4 text-xs font-bold text-slate-400 bg-slate-800/50 rounded-full px-3 py-1 border border-slate-700">
                  Verified
                </span>
              )}
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  {provider.division}
                </p>
                <h3 className="text-2xl font-bold text-white">{provider.name}</h3>
                <p className="text-sm text-slate-500">
                  ETA {provider.etaMinutes} min · {provider.status.toUpperCase()}
                </p>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <p>
                  Hotline:{" "}
                  <a href={`tel:${provider.hotline}`} className="font-semibold text-slate-300 hover:text-white">
                    {provider.hotline}
                  </a>
                </p>
                <p>Coverage: {provider.coverage.join(", ")}</p>
                {userLocation && (
                  <p>
                    Distance:{" "}
                    <span className="font-semibold text-gray-300">
                      {haversineKm(userLocation, provider.gps)} km
                    </span>
                  </p>
                )}
              </div>
              <button
                onClick={() => handleSOS(provider)}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold py-3 hover:bg-slate-700 hover:text-white hover:shadow-lg transition-all"
              >
                One-click SOS
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default AmbulanceDirectory;

