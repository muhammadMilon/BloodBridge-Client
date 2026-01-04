import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { hematologyDoctors } from "../data/platformData";

const DoctorSuggestions = () => {
  const divisions = useMemo(
    () => ["All Divisions", ...new Set(hematologyDoctors.map((doc) => doc.division))],
    []
  );
  const [division, setDivision] = useState("All Divisions");

  const visibleDoctors = useMemo(() => {
    if (division === "All Divisions") return hematologyDoctors;
    return hematologyDoctors.filter((doc) => doc.division === division);
  }, [division]);

  const handleRequest = (doctor) => {
    Swal.fire({
      title: "Request Appointment",
      html: `
        <div class="text-left space-y-4 mt-2">
          <p class="text-slate-300">To schedule an urgent consult with <span class="text-white font-bold">${doctor.name}</span>, please contact directly:</p>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
             <span class="text-3xl">📞</span>
             <div class="flex flex-col items-start">
                <p class="text-xs text-slate-500 uppercase tracking-wider font-bold">Emergency Hotline</p>
                <a href="tel:${doctor.contact}" class="text-xl font-mono text-white font-bold hover:text-emerald-400 transition-colors tracking-wide">${doctor.contact}</a>
             </div>
          </div>
          <p class="text-sm text-slate-500 italic border-l-2 border-slate-700 pl-3">Mention <b>"BloodBridge"</b> for priority verification.</p>
        </div>
      `,
      background: "#020617", // slate-950
      color: "#f8fafc",
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: "border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl bg-slate-950/90",
        title: "text-2xl font-black text-white text-left",
        htmlContainer: "text-left !m-0 !px-0"
      }
    });
  };

  return (
    <section className="py-16 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Division-wise Hematology Experts
          </h2>
          <p className="text-slate-400 mt-2">
            Verified specialists with direct contact details, curated for urgent consults and follow-up appointments.
          </p>
        </div>
        <select
          className="border border-slate-700 rounded-xl px-5 py-3 font-semibold text-sm bg-slate-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-600 outline-none cursor-pointer hover:bg-slate-750"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        >
          {divisions.map((item) => (
            <option key={item} value={item} className="bg-slate-800">{item}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDoctors.map((doctor) => (
          <article
            key={doctor.name}
            className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold">
                  {doctor.division}
                </p>
                <h3 className="text-xl font-bold text-gray-100">{doctor.name}</h3>
                <p className="text-sm text-slate-500">{doctor.hospital}</p>
              </div>
              {doctor.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">
                  Verified
                </span>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-400">
                Specialties:
                <span className="text-slate-500 font-normal"> {doctor.specialties.join(", ")}</span>
              </p>
              <a
                href={`tel:${doctor.contact}`}
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-semibold transition-colors"
              >
                📞 {doctor.contact}
              </a>
            </div>
            <button 
              onClick={() => handleRequest(doctor)}
              className="mt-auto px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-700 hover:text-white transition-all shadow-sm hover:shadow-slate-900/40"
            >
              Request Appointment
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DoctorSuggestions;

