import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountnav from "./UserAccountnav";
import Image from "next/image";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>

      <nav className="bg-zinc-100 py-2 fixed w-full top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain rounded-md"
            />
          </Link>

          {/* Navigation / User Interaction */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <UserAccountnav />
                {session.user.role === "ADMIN" && (
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    href="/admin"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <Link
                className={buttonVariants({ variant: "outline" })}
                href="/sign-in"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
