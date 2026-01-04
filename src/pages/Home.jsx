import Banner from "../components/Banner";
import DonationProcess from "../components/DonationProcess";
import HealthInsights from "../components/HealthInsights";
import ImpactStatistics from "../components/ImpactStatistics";
import QrVerificationInfo from "../components/QrVerificationInfo";
import RewardsShowcase from "../components/RewardsShowcase";

const Home = () => {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Banner></Banner>
      <ImpactStatistics></ImpactStatistics>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.05]"></div>
        <DonationProcess></DonationProcess>
        <HealthInsights></HealthInsights>
        <RewardsShowcase></RewardsShowcase>
        <QrVerificationInfo></QrVerificationInfo>
      </div>
    </div>
  );
};

export default Home;
