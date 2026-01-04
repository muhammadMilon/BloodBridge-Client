import { rewardBadges } from "../data/platformData";

const RewardsShowcase = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 font-semibold">
          Donor Rewards
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Badges, Certificates & Recognition
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto">
          BloodBridge unlocks milestone badges automatically and emails a printable certificate once a donation is verified through QR scan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewardBadges.map((badge) => (
          <article
            key={badge.name}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className={`mx-auto w-20 h-20 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-2xl font-black shadow-inner`}
            >
              🩸
            </div>
            <h3 className="text-2xl font-bold text-white">{badge.name}</h3>
            <p className="text-sm text-slate-400">{badge.description}</p>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.5em]">
              {badge.threshold}+ Donations
            </p>
            <button className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-700 hover:text-white transition-all">
              Preview Certificate
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RewardsShowcase;

