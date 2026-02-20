"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useSignup from "./useSignUp";

const SignupForm = () => {
  const {
    form,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useSignup();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            Dreams<span className="text-primary">LMS</span>
          </span>
        </div>

        <Link
          href="/"
          className="text-primary font-medium hover:underline text-sm"
        >
          Back to Home
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Sign into Your Account
      </h1>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* fullName */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter your fullName"
                      className="pr-10 h-12"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pr-10 h-12"
                      {...field}
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-10 h-12"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev: boolean) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-10 h-12"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev: boolean) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember + Forgot */}
          <div className="flex">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <div
                  className="flex items-center gap-2"
                  onClick={() => field.onChange(!!field.value)}
                >
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree with {" "}
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>
                    {" "}
                    and
                    {" "}
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              )}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-full gap-1"
          >
            Sign up <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">Or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Social Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-full gap-2 font-medium"
        >
          Google
        </Button>

        <Button
          variant="outline"
          className="flex-1 h-12 rounded-full gap-2 font-medium"
        >
          Facebook
        </Button>
      </div>

      {/* Sign Up */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        If you have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
