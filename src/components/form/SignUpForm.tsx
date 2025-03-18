"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from 'next/link';
import GoogleSignInButton from "../GitHubSignInButton";
import { useRouter } from 'next/navigation';
const formSchema = z.object({
    username: z.string().min(1, 'username is required').max(30),
    email: z.string().min(1, 'Email is Required').email('Invalid Email'),
    password: z.string().min(1, "Password is Required").min(8, 'Password must have 8 Characters'),
    confirmpassword: z.string().min(1, "Confirmation is Required"),
  }).refine(data => data.password === data.confirmpassword, {
    path: ['confirmpassword'],
    message: 'Passwords do not match' // Changed 'Password do not match' to plural for clarity
  });

const SignUpForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password,
            }),
        });

        // Check if the registration was successful
        if (response.ok) {
            router.push('/sign-in'); // Redirect on success
        } else {
            const data = await response.json(); // Extract the error message from the response
            console.error('Registration failed:', data.message || 'Unknown error');
            // Show error message to the user
            form.setError('email', {
                type: 'manual',
                message: data.message || 'An error occurred during registration.',
            });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        // Display a generic error message
        form.setError('email', {
            type: 'manual',
            message: 'Failed to register. Please try again later.',
        });
    }
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className='space-y-2'>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="JohnDoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter the Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type = "password" placeholder="Enter Your Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type = "password" placeholder="Enter Your Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        
        <Button className='w-full mt-6' type="submit"> Sign Up </Button>
      </form>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
or
</div>
<GoogleSignInButton > Sign Up with Github</GoogleSignInButton>
<p className='text-center text-sm text-gray-600 mt-2'>
If you don&apos;t have an account, Please&nbsp;
<Link className='text-blue-500 hover:underline font-bold' href='/sign-in'>Sign In</Link>
</p>

    </Form>
  );
};

export default SignUpForm;