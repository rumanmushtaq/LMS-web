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
    <div className="relative min-h-[calc(100vh-80px)] bg-background flex items-center justify-center p-6 lg:p-12 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-7xl z-10">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-foreground">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're here to help! Whether you have questions about our platform,
            need technical support, or just want to say hi, our team is ready to
            assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {/* LEFT PANEL - Contact Info */}
          <div className="lg:col-span-4 bg-primary text-primary-foreground rounded-3xl p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Inner background decorative element */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>

              <div className="space-y-10">
                <div className="flex items-center gap-6 group/item cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-all group-hover/item:bg-white/20 group-hover/item:scale-110">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/60 mb-1 font-medium uppercase tracking-wider">
                      Call Us
                    </p>
                    <span className="text-lg font-semibold">+012 3456 789</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 group/item cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-all group-hover/item:bg-white/20 group-hover/item:scale-110">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/60 mb-1 font-medium uppercase tracking-wider">
                      Email Us
                    </p>
                    <span className="text-lg font-semibold">
                      contact@varonaacademy.com
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-6 group/item cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-all group-hover/item:bg-white/20 group-hover/item:scale-110">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/60 mb-1 font-medium uppercase tracking-wider">
                      Visit Us
                    </p>
                    <span className="text-lg font-semibold leading-snug">
                      132 Dartmouth Street Boston, Massachusetts 02156
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-12">
              <p className="text-sm font-medium mb-4 opacity-70 uppercase tracking-widest">
                Connect with us
              </p>
              <div className="flex items-center gap-4">
                {[Twitter, Instagram, MessageCircle].map((Icon, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-white border-0"
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Contact Form */}
          <div className="lg:col-span-8 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-10 lg:p-14 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground/70 ml-1">
                    First Name
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. John"
                        className="h-14 rounded-2xl bg-background/50 border-border/50 focus:ring-primary/20 focus:border-primary transition-all px-5 text-base"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground/70 ml-1">
                    Last Name
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. Doe"
                        className="h-14 rounded-2xl bg-background/50 border-border/50 focus:ring-primary/20 focus:border-primary transition-all px-5 text-base"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/70 ml-1">
                  Email Address
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="john@example.com"
                      className="h-14 rounded-2xl bg-background/50 border-border/50 focus:ring-primary/20 focus:border-primary transition-all px-5 text-base"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/70 ml-1">
                  Message
                </Label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="What would you like to tell us?"
                      className="min-h-[160px] rounded-2xl bg-background/50 border-border/50 focus:ring-primary/20 focus:border-primary transition-all p-5 text-base resize-none"
                    />
                  )}
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
