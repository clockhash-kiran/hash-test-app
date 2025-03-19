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
import GitHubSignInButton from "../GitHubSignInButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GoogleSignInButton from "../GoogleSignInButton";

const formSchema = z.object({
  email: z.string().min(1, "Email is Required").email("Invalid Email"),
  password: z
    .string()
    .min(1, "Password is Required")
    .min(8, "Password must have 8 Characters"),
});

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      toast.error("Invalid email or password. Please try again.");
    } else {
      toast.success("Login successful! Redirecting...");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
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
            Sign In
          </Button>
        </form>

        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-gray-300 after:ml-4 after:block after:h-px after:flex-grow after:bg-gray-300">
          or
        </div>

        <div onClick={() => signIn("github", { callbackUrl: "/" })}>
          <GitHubSignInButton>Sign In with GitHub</GitHubSignInButton>
        </div>

        <div onClick={() => signIn("google", { callbackUrl: "/" })}>
          <GoogleSignInButton>Sign In with Google</GoogleSignInButton>
        </div>

        <p className="text-center text-sm text-gray-600 mt-2">
          If you don&apos;t have an account, please{" "}
          <Link
            className="text-blue-500 md:font-bold hover:underline"
            href="/sign-up"
          >
            sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignInForm;
