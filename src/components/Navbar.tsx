import React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserAccountnav from './UserAccountnav';
import Image from 'next/image';

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>

      <div className="bg-zinc-100 py-2  fixed w-full top-0 z-50">
        <div className="container flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="object-contain rounded-md" />
          </Link>

          {/* Navigation / User Interaction */}
          {session?.user ? (
            <UserAccountnav />
          ) : (
            <Link className={buttonVariants({ variant: 'outline' })} href="/sign-in">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
