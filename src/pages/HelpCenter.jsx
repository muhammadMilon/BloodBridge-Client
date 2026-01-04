import DoctorSuggestions from "../components/DoctorSuggestions";
import NgoDirectory from "../components/NgoDirectory";
import PageTitle from "../components/PageTitle";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-slate-400">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-900/20 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative z-10">
        <PageTitle title={"Help Center"} />
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
            Help Center
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Division-wise Experts & Support Lines
          </h1>
          <p className="text-slate-400">
            Find verified hematologists, NGOs, and blood banks organized by division. Book
            consultations, escalate emergencies, or share these contacts with recipients in need.
          </p>
        </div>

        <DoctorSuggestions />

        <NgoDirectory />

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center space-y-2">
          <h3 className="text-xl font-bold text-white">
            Need additional assistance?
          </h3>
          <p className="text-slate-400">
            Chat with our volunteer desk or email <a href="mailto:support@bloodbridge.org" className="text-slate-200 hover:text-white underline decoration-slate-600 underline-offset-4 transition-colors">support@bloodbridge.org</a> for personalized routing
            to clinics, ambulances, or NGOs in your division.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

