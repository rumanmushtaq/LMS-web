"use client";

import { Controller } from "react-hook-form";
import { useContactForm } from "./useContact";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Twitter,
  Instagram,
} from "lucide-react";

export default function ContactPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useContactForm();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Contact Us
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-md mx-auto">
            Any question or remarks? Just write us a message!
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">
          
          {/* LEFT PANEL */}
          <div className="lg:col-span-2 bg-primary text-primary-foreground p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Contact Information
              </h2>

              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+012 3456 789</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">demo@gmail.com</span>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 mt-0.5" />
                  <span className="text-sm leading-relaxed">
                    132 Dartmouth Street Boston,
                    <br />
                    Massachusetts 02156 United States
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-12">
              <Twitter className="w-4 h-4" />
              <Instagram className="w-4 h-4" />
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-3 p-8 sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(["firstName", "lastName"] as const).map((fieldName) => (
                  <div key={fieldName}>
                    <Label className="mb-2 block">
                      {fieldName === "firstName"
                        ? "First Name"
                        : "Last Name"}
                    </Label>

                    <Controller
                      name={fieldName}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={
                            fieldName === "firstName"
                              ? "Enter your first name"
                              : "Enter your last name"
                          }
                        />
                      )}
                    />

                    {errors[fieldName] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[fieldName]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="json@gmail.com"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <Label>Message</Label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Type your message..." />
                  )}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}