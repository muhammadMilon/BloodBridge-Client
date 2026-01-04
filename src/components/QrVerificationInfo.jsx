const QrVerificationInfo = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 items-center">
        <div className="space-y-5 max-w-xl">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 font-semibold">
            QR Verification
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Scan, Verify, Update Stats</h2>
          <p className="text-slate-400">
            Every donor profile and request now ships with a unique QR signature. Hospitals scan it to confirm donation completion, auto-update statistics, and trigger reward badges.
          </p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>• QR embedded in donor dashboard & request details</li>
            <li>• Works offline; verification syncs once back online</li>
            <li>• Prevents duplicate or fraudulent submissions</li>
          </ul>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 w-full lg:w-1/3 text-center space-y-4 shadow-lg">
          <div className="w-full aspect-square rounded-2xl bg-white flex items-center justify-center text-slate-900 font-black text-xl shadow-inner">
            QR Preview
          </div>
          <p className="text-sm text-slate-400">
            Actual QR codes are generated dynamically from donor/request IDs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QrVerificationInfo;

