import { urgencyDefinitions } from "../data/platformData";

const UrgencyMatrix = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500 font-semibold">
            Urgency Prioritization
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Automatically Route Donors by Need
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto">
            Each incoming request is tagged with an SLA and color-coded alerts. BloodBridge pushes notifications to
            donors closest to the hospital and best suited for the urgency window.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {urgencyDefinitions.map((item) => (
            <article
              key={item.level}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-6 flex flex-col gap-4 hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl grayscale opacity-70">{item.badge}</span>
                <h3 className="text-xl font-bold text-gray-100">{item.level}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
              <ul className="text-xs uppercase tracking-[0.3em] text-slate-500 space-y-2">
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600" /> Smart donor notifications</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600" /> SLA timers</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600" /> GPS ambulance linking</li>
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UrgencyMatrix;

