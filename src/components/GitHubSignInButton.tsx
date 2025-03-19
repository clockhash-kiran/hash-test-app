"use client"; // Required for event handlers in Next.js App Router

import React, { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image"; // For handling the logo image

interface GitHubSignInButtonProps {
  children: ReactNode;
}

const GitHubSignInButton: FC<GitHubSignInButtonProps> = ({ children }) => {
  const loginWithGitHub = () => signIn("github");

  return (
    <Button
      onClick={loginWithGitHub}
      className="w-full bg-white text-gray-900 hover:bg-gray-00 focus:ring-2 focus:ring-gray-500 flex items-center justify-center space-x-2"
    >
      <Image src="/github-logo.svg" alt="GitHub Logo" width={20} height={20} />
      <span>{children}</span>
    </Button>
  );
};

export default GitHubSignInButton;
