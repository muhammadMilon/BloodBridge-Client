import { clinicDirectory } from "../data/platformData";

const ClinicHighlights = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Division-wise Clinics
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Trusted Hematology Clinics & Emergency Units
          </h2>
          <p className="text-slate-400">
            BloodBridge curates the highest-rated clinics per division with facilities, emergency
            contacts, and shortcuts to ambulance and request modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicDirectory.map((clinic) => (
            <article
              key={clinic.name}
              className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:border-slate-700 hover:shadow-slate-900/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                  {clinic.division}
                </p>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-yellow-500 border border-slate-700">
                  ⭐ {clinic.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-100">{clinic.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{clinic.address}</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                {clinic.facilities.map((facility) => (
                  <li key={facility} className="flex items-center gap-2">
                    <span className="text-slate-600">•</span>
                    {facility}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${clinic.emergencyContact}`}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm text-center hover:bg-slate-800 transition-colors"
                >
                  Call {clinic.emergencyContact}
                </a>
                <a
                  href="#ambulance"
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm shadow-md hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Request Ambulance
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClinicHighlights;

