"use client"
import { signOut} from 'next-auth/react';
import { Button } from './ui/button';
import React from 'react'

const UserAccountnav = () => {
  return (
    <Button onClick = {() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/sign-in`,
    })} variant="outline"> Sign Out</Button>
  )
}

export default UserAccountnav