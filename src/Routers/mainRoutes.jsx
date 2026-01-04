import { createBrowserRouter } from "react-router";
import RoleBasedProfile from "../components/RoleBasedProfile";
import RoleBasedRedirect from "../components/RoleBasedRedirect";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import AddBlog from "../pages/adminDashboard/AddBlog";
import AdminDashboard from "../pages/adminDashboard/AdminDashboard";
import AllBloodDonationRequest from "../pages/adminDashboard/AllBloodDonationRequest";
import AllUsers from "../pages/adminDashboard/AllUsers";
import ContentManagement from "../pages/adminDashboard/ContentManagement";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import BloodHelper from "../pages/BloodHelper";
import CreateDonationRequest from "../pages/donorDashboard/CreateDonationRequest";
import DonationRequest from "../pages/donorDashboard/DonationRequest";
import DonorDashboard from "../pages/donorDashboard/DonorDashboard";
import DonorRegister from "../pages/DonorRegister";
import Error from "../pages/Error";
import ErrorPage from "../pages/ErrorPage";
import HelpCenter from "../pages/HelpCenter";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ReceiverDashboard from "../pages/receiverDashboard/ReceiverDashboard";
import RecipientRegister from "../pages/RecipientRegister";
import RegisterSelection from "../pages/RegisterSelection";
import Request from "../pages/Request";
import Search from "../pages/Search";
import UpdateDonationRequest from "../pages/UpdateDonationRequest";
import ViewDetails from "../pages/ViewDetails";
import PrivateRoute from "./PrivateRoute";

const mainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "blog-details/:ID",
        element: (
          <PrivateRoute>
            <BlogDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "request",
        element: <Request />,
      },
      {
        path: "help-center",
        element: <HelpCenter />,
      },
      {
        path: "details/:ID",
        element: (
          <PrivateRoute>
            <ViewDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "blood-helper",
        element: <BloodHelper />,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "registration",
        element: <RegisterSelection></RegisterSelection>,
      },
      {
        path: "register/donor",
        element: <DonorRegister></DonorRegister>,
      },
      {
        path: "register/recipient",
        element: <RecipientRegister></RecipientRegister>,
      },
      // Redirect old /dashboard to role-based dashboards
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <RoleBasedRedirect />
          </PrivateRoute>
        ),
      },
      // 404 Route
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  // Admin Dashboard Routes
  {
    path: "/admindashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "profile",
        element: <RoleBasedProfile />,
      },
      {
        path: "all-users",
        element: <AllUsers />,
      },
      {
        path: "all-blood-donation-request",
        element: <AllBloodDonationRequest />,
      },
      {
        path: "content-management",
        element: <ContentManagement />,
      },
      {
        path: "content-management/add-blog",
        element: <AddBlog />,
      },
    ],
  },
  // Donor Dashboard Routes
  {
    path: "/donordashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <DonorDashboard />,
      },
      {
        path: "profile",
        element: <RoleBasedProfile />,
      },
      {
        path: "my-donation-requests",
        element: <DonationRequest />,
      },
      {
        path: "update-donation-request/:ID",
        element: <UpdateDonationRequest />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
    ],
  },
  // Recipient Dashboard Routes
  {
    path: "/recipientdashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <ReceiverDashboard />,
      },
      {
        path: "profile",
        element: <RoleBasedProfile />,
      },
      {
        path: "my-donation-requests",
        element: <DonationRequest />,
      },
      {
        path: "update-donation-request/:ID",
        element: <UpdateDonationRequest />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
    ],
  },
]);

export default mainRoutes;
