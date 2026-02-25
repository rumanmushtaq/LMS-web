"use client";

import { Controller } from "react-hook-form";
import { useW8BENForm } from "./w8-benform";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function W8BENForm() {
  const { form, onSubmit } = useW8BENForm();

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="shadow-xl border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Form W-8BEN
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Certificate of Foreign Status of Beneficial Owner
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-10 pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >

              {/* Keep ALL your existing sections EXACTLY the same */}
              {/* Just replace `form` usage like this: */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Legal Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ⚠️ IMPORTANT */}
              {/* Rest of your form remains EXACT SAME */}
              {/* No logic change required */}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:opacity-90"
              >
                Submit Form
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}