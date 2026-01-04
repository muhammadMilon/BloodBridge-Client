// DashboardLayout.jsx
import { HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router";
import Header from "../components/Header";

const DashboardLayout = () => {
  // Removed blocking useRole loader to allow layout to render immediately
  // Individual components handle their own data/role loading states


  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-950">
        {/* Keep global navbar at the top */}
        <Header />
        <div className="container mx-auto">
          <main className="min-h-[calc(100vh-4rem)] transition-all duration-300">
            <div className="p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default DashboardLayout;
