"use client";

import Link from "next/link";

import { z } from "zod";
import { ChevronRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import useOTP from "./useOTP";

const OtpForm = () => {
  const {
    handleResend,
    onSubmit,
    handleKeyDown,
    form,
    handleChange,
    formatTime,
    inputsRef,
    timeLeft,
  } = useOTP();

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
        <a
          href="/"
          className="text-primary font-medium hover:underline text-sm"
        >
          Back to Home
        </a>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground mb-3">Email OTP</h1>
      <p className="text-muted-foreground text-sm mb-8">
        OTP sent to your Email Address ending ******doe@example.com
      </p>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => {
              const otpValue = field.value.padEnd(4, " ").split("");
              return (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-4">
                      {otpValue.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el: HTMLInputElement | null) => {
                            inputsRef.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit.trim()}
                          onChange={(e) =>
                            handleChange(e.target.value, index, field.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className="w-20 h-16 text-center text-lg font-semibold border-input"
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Timer */}
          <div className="flex items-center justify-center gap-1.5 text-primary text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-full gap-1"
          >
            Verify & Proceed <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      </Form>

      {/* Resend */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Didn't get the OTP?{" "}
        <button
          onClick={handleResend}
          className="text-primary font-medium hover:underline"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default OtpForm;
