"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const VerifyEmailClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<string>("Verifying...");

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await fetch(`/api/verify-email?token=${token}`);
          const data = await response.json();
          setStatus(data.message || "Error occurred");

          // Optionally redirect on success
          if (response.ok) {
            setTimeout(() => router.push("/dashboard"), 2000);
          }
        } catch (error) {
          console.error(error);
          setStatus("Verification failed. Try again.");
        }
      };

      verifyEmail();
    } else {
      setStatus("Invalid verification link.");
    }
  }, [token, router]);

  return (
    <div>
      <h1>{status}</h1>
    </div>
  );
};

export default VerifyEmailClient;
