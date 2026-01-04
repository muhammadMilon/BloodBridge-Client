import { useRouteError, Link } from "react-router";
import Header from "../components/Header";

const Error = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div className="min-h-screen bg-slate-950">
      <Header></Header>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-2xl text-center max-w-2xl backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Page Not Found
          </h2>
          <p className="text-slate-400 mb-8">
            {error?.statusText ||
              error?.message ||
              "The page you're looking for doesn't exist."}
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
