import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
// import { NextUIProvider } from "@nextui-org/react";
import mainRoutes from "./Routers/mainRoutes";
import "./index.css";
import AuthProvider from "./providers/AuthProvider";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <NextUIProvider> */}
    <Toaster position="top-right" reverseOrder={false} />
    <AuthProvider>
      <RouterProvider router={mainRoutes} />
    </AuthProvider>
    {/* </NextUIProvider> */}
  </React.StrictMode>
);
