"use client"; // Required for event handlers in Next.js App Router

import React, { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => signIn("google");

  return (
    <div className="pt-3">
      <Button
        onClick={loginWithGoogle}
        className="w-full bg-white text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 flex items-center justify-center space-x-2"
      >
        <Image
          src="/google-logo.svg" 
          alt="Google Logo"
          width={20}
          height={20}
        />
        <span>{children}</span>
      </Button>
    </div>
  );
};

export default GoogleSignInButton;
