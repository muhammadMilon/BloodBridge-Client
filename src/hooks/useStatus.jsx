import { useContext, useEffect, useState, useRef } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

export default function useStatus() {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user) {
      setStatus("");
      setLoading(false);
      hasFetched.current = false;
      return;
    }

    // Only fetch once per user session
    if (hasFetched.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosSecure
      .get("/get-user-status")
      .then((res) => {
        setStatus(res.data?.status || "");
        hasFetched.current = true;
      })
      .catch((err) => {
        console.error("Failed to load user status:", err);
        setStatus("");
        hasFetched.current = true;
      })
      .finally(() => setLoading(false));
  }, [user, axiosSecure]);

  return { status, loading };
}
