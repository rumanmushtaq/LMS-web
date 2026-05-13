"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Save,
  Lock,
  Loader2,
  Landmark,
  User,
  FileDigit,
  Hash,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PayoutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bankAccount, setBankAccount] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        const userData = res.data.data || res.data;
        if (userData.kycData?.bankAccount) {
          setBankAccount(userData.kycData.bankAccount);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axiosInstance.patch("/users/profile", {
        bankAccount,
      });
      toast.success("Payment details updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update payment details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage where you receive your lesson earnings
          </p>
        </div>
        <div className="bg-primary/5 text-primary px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5" /> Secure Payouts
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 lg:p-12 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bank Account Details</h2>
              <p className="text-xs text-muted-foreground">
                Standard bank transfer (ACH/SWIFT)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-500 flex items-center gap-2">
                <Landmark className="w-3 h-3" /> Bank Name
              </Label>
              <Input
                className="h-14 px-5 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-2 ring-primary/20 transition-all"
                value={bankAccount.bankName}
                onChange={(e) =>
                  setBankAccount({ ...bankAccount, bankName: e.target.value })
                }
                placeholder="e.g. Chase Bank"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-500 flex items-center gap-2">
                <User className="w-3 h-3" /> Account Holder Name
              </Label>
              <Input
                className="h-14 px-5 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-2 ring-primary/20 transition-all"
                value={bankAccount.accountHolderName}
                onChange={(e) =>
                  setBankAccount({
                    ...bankAccount,
                    accountHolderName: e.target.value,
                  })
                }
                placeholder="Name as it appears on account"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-500 flex items-center gap-2">
                <Hash className="w-3 h-3" /> Account Number
              </Label>
              <Input
                className="h-14 px-5 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-2 ring-primary/20 transition-all"
                value={bankAccount.accountNumber}
                onChange={(e) =>
                  setBankAccount({
                    ...bankAccount,
                    accountNumber: e.target.value,
                  })
                }
                placeholder="Your bank account number"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-500 flex items-center gap-2">
                <FileDigit className="w-3 h-3" /> Routing Number / SWIFT
              </Label>
              <Input
                className="h-14 px-5 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-2 ring-primary/20 transition-all"
                value={bankAccount.routingNumber}
                onChange={(e) =>
                  setBankAccount({
                    ...bankAccount,
                    routingNumber: e.target.value,
                  })
                }
                placeholder="9-digit routing or SWIFT code"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[11px] text-muted-foreground max-w-md">
              By saving these details, you authorize Dreams LMS to initiate
              payouts to this account for your completed lesson earnings.
              Payouts are typically processed every Friday.
            </p>
            <Button
              onClick={handleSave}
              disabled={
                saving || !bankAccount.bankName || !bankAccount.accountNumber
              }
              className="h-14 px-10 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary)] text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
