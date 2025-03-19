"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const refreshAuthToken = async () => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.refreshToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    signOut(); // Logout if refresh fails
  }
};

const UserAccountNav = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAuthToken();
    }, 55 * 60 * 1000); // Refresh every 55 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }
      variant="outline"
    >
      Sign Out
    </Button>
  );
};

export default UserAccountNav;
