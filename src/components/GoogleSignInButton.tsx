"use client"; // Required for event handlers in Next.js App Router

import React, { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GoogleSignInButtonProps {
    children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
    const loginWithGoogle = () => signIn("google");

    return (
        <div className="pt-3">
            <Button onClick={loginWithGoogle} className="w-full">
            {children}
        </Button>
        </div>
    );
};

export default GoogleSignInButton;
