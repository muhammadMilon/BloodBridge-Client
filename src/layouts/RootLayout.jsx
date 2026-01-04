import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { FaRobot } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

const queryClient = new QueryClient();

const RootLayout = () => {
  const location = useLocation();
  const hideFooterRoutes = ["/registration"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div>
          <Header />
          <main className="min-h-[calc(100vh-285px)] ">
            <Outlet></Outlet>
          </main>
          {!shouldHideFooter && <Footer />}
          <Link
            to="/blood-helper"
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-400 hover:scale-110 transition-all duration-300 flex items-center justify-center animate-[bounce_3s_infinite] group"
            title="Blood Helper AI"
          >
            <FaRobot className="text-3xl" />
            <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">Need Help? Ask AI!</span>
          </Link>
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default RootLayout;
