import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useW8BENForm } from "./useW8Ben";

export default function W8BENForm() {
const {
    form,
    onSubmit,
  } = useW8BENForm()

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* PART I */}
              <section className="space-y-6">
                <h2 className="text-lg font-semibold">
                  Part I — Identification of Beneficial Owner
                </h2>

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Legal Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Citizenship</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="cityStateProvince" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City / State / Province</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="addressCountry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Separator />

                <h3 className="font-medium">Mailing Address (if different)</h3>

                <FormField control={form.control} name="mailingAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="mailingCityState" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City / State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="mailingCountry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <Separator />

                <FormField control={form.control} name="usTaxId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>U.S. Taxpayer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="XXX-XX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="foreignTaxId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foreign Tax ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <Controller
                  control={form.control}
                  name="ftinNotRequired"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>FTIN not legally required</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="referenceNumbers" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Numbers</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input placeholder="MM-DD-YYYY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </section>

              <Separator />

              {/* PART II */}
              <section className="space-y-6">
                <h2 className="text-lg font-semibold">
                  Part II — Claim of Tax Treaty Benefits
                </h2>

                <FormField control={form.control} name="treatyCountry" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treaty Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="articleParagraph" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article & Paragraph</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="withholdingRate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Withholding Rate (%)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="incomeType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Income</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="additionalConditions" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Conditions</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )} />
              </section>

              <Separator />

              {/* PART III */}
              <section className="space-y-6">
                <h2 className="text-lg font-semibold">
                  Part III — Certification
                </h2>

                <FormField control={form.control} name="printName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Print Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="signatureDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="MM-DD-YYYY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Controller
                  control={form.control}
                  name="certify"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>
                          I certify that the information provided is correct.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </section>

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