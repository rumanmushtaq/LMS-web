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
import useForgotPassword from "./useForgotPassword";


const ForgotPasswordForm = () => {
  const { form, onSubmit} = useForgotPassword();

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
        Forgot Password?
      </h1>
      <p>Enter your email to reset your password</p>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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


          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-full gap-1"
          >
            Submit <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      </Form>



      {/* Sign Up */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Remember Password?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
