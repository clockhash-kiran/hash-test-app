// app/verify-email/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Use `useSearchParams` instead of `useRouter`

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Access query parameters with `useSearchParams`
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();
        setStatus(data.message || 'Error occurred');
      };

      verifyEmail();
    }
  }, [token]);

  return (
    <div>
      <h1>{status}</h1>
    </div>
  );
};

export default VerifyEmailPage;
