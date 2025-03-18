"use client"; // Required for event handlers in Next.js App Router

import React, { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GitHubSignInButtonProps {
    children: ReactNode;
}

const GitHubSignInButton: FC<GitHubSignInButtonProps> = ({ children }) => {
    const loginWithGitHub = () => signIn("github");

    return (
        <Button onClick={loginWithGitHub} className="w-full">
            {children}
        </Button>
    );
};

export default GitHubSignInButton;
