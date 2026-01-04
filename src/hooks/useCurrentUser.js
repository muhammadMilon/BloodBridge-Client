import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

export default function useCurrentUser() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!user?.email) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    // Fetch full user data from database (includes gender and all fields)
    setLoading(true);
    axiosSecure
      .get("/get-user")
      .then((res) => {
        // Merge database user data with auth user data
        setCurrentUser({
          ...user,
          ...res.data,
          // Ensure displayName and photoURL are available
          displayName: res.data.name || user.displayName,
          photoURL: res.data.image || user.photoURL,
        });
      })
      .catch((err) => {
        console.error("Failed to load user data:", err);
        // Fallback to auth user if database fetch fails
        setCurrentUser(user);
      })
      .finally(() => setLoading(false));
  }, [user, axiosSecure]);

  // Return loading state from auth if user is not yet loaded, otherwise return our loading state
  return { currentUser, loading: authLoading || loading };
}
