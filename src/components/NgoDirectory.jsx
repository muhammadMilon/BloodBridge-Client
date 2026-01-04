import { useMemo, useState } from "react";
import { ngoDirectory } from "../data/platformData";

const NgoDirectory = () => {
  const divisions = useMemo(
    () => ["All Divisions", ...new Set(ngoDirectory.map((item) => item.division))],
    []
  );
  const [division, setDivision] = useState("All Divisions");

  const visibleRows = useMemo(() => {
    if (division === "All Divisions") return ngoDirectory;
    return ngoDirectory.filter((item) => item.division === division);
  }, [division]);

  return (
    <section className="py-16 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Blood Banks & NGOs</h2>
          <p className="text-slate-400">
            Tap any contact to initiate email or phone. Directory is kept up-to-date with verified partners.
          </p>
        </div>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="px-4 py-3 border border-slate-700 rounded-xl bg-slate-800 text-gray-200 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
        >
          {divisions.map((item) => (
            <option key={item} value={item} className="bg-slate-800">
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-left text-slate-400 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Division</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              {visibleRows.map((row) => (
                <tr key={row.name} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-100">{row.name}</td>
                  <td className="px-4 py-3 text-slate-500">{row.division}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${row.contact}`} className="text-slate-300 hover:text-white font-semibold transition-colors">
                      {row.contact}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${row.email}`} className="text-slate-300 hover:text-white font-semibold transition-colors">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        row.verified
                          ? "bg-emerald-900/30 text-emerald-400 border-emerald-900/50"
                          : "bg-amber-900/30 text-amber-500 border-amber-900/50"
                      }`}
                    >
                      {row.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default NgoDirectory;

