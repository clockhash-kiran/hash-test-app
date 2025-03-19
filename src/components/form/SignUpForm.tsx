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
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(1, "Username is required").max(30),
  email: z.string().min(1, "Email is Required").email("Invalid Email"),
  password: z.string().min(1, "Password is Required").min(8, "Password must have 8 Characters"),
  confirmpassword: z.string().min(1, "Confirmation is Required"),
}).refine((data) => data.password === data.confirmpassword, {
  path: ["confirmpassword"],
  message: "Passwords do not match", // Clear message for better understanding
});

const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        router.push("/sign-in"); // Redirect on success
      } else {
        const data = await response.json();
        console.error("Registration failed:", data.message || "Unknown error");
        form.setError("email", {
          type: "manual",
          message: data.message || "An error occurred during registration.",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      form.setError("email", {
        type: "manual",
        message: "Failed to register. Please try again later.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="JohnDoe"
                    className="bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the Email"
                    className="bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Your Password"
                    className="bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Your Password"
                    className="bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-500">
          Sign Up
        </Button>
      </form>

      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-gray-300 after:ml-4 after:block after:h-px after:flex-grow after:bg-gray-300">
        or
      </div>

      <p className="text-center text-sm text-gray-600 mt-2">
        If you already have an account, please{" "}
        <Link className="text-blue-500 hover:underline font-bold" href="/sign-in">
          Sign In
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;
