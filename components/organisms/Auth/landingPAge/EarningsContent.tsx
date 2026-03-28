"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DollarSign, Star, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const stats = [
  {
    label: "Revenue",
    value: "$8420",
    subtitle: "Earning this month",
    icon: DollarSign,
    iconBg: "bg-success",
  },
  {
    label: "Courses Ratings",
    value: "4.8",
    subtitle: "Rating this month",
    icon: Star,
    iconBg: "bg-accent",
  },
  {
    label: "Students Enrolled",
    value: "12000",
    subtitle: "New this month",
    icon: Users,
    iconBg: "bg-primary",
  },
];

const chartData = [
  { month: "Jan", earnings: 4800 },
  { month: "Feb", earnings: 5200 },
  { month: "Mar", earnings: 4500 },
  { month: "Apr", earnings: 9500 },
  { month: "May", earnings: 6200 },
  { month: "Jun", earnings: 6800 },
  { month: "Jul", earnings: 8200 },
  { month: "Aug", earnings: 4200 },
  { month: "Sep", earnings: 9800 },
  { month: "Oct", earnings: 6400 },
  { month: "Nov", earnings: 7800 },
  { month: "Dec", earnings: 5800 },
];

const orders = [
  { id: "ORD010", date: "28 Jan 2025", course: "Information about UI/UX Design Degree", amount: "$160" },
  { id: "ORD009", date: "22 Jan 2025", course: "Wordpress for Beginners - Master Wordpress Quickly", amount: "$140" },
  { id: "ORD008", date: "17 Jan 2025", course: "Sketch from A to Z (2022): Become an app designer", amount: "$200" },
  { id: "ORD007", date: "08 Jan 2025", course: "Learn Angular Fundamental From beginning to advance", amount: "$170" },
  { id: "ORD006", date: "03 Jan 2025", course: "C# Developers Double Your Coding Speed", amount: "$120" },
];

const EarningsContent = () => {
  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold text-foreground mb-6">Earnings</h2>
      <Separator className="mb-6" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
          >
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
                  <stat.icon className="h-6 w-6 text-card" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Earnings by Year</CardTitle>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              2025
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    // tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    // formatter={(value: number) => [`$${value.toLocaleString()}`, "Earnings"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fill="url(#earningsGradient)"
                    dot={{ r: 4, fill: "hsl(var(--accent))", stroke: "hsl(var(--card))", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Earnings Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mt-8"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Earnings</CardTitle>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              01 Jan 2025 - 31 Jan 2025
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Course</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link href="#" className="text-primary font-medium hover:underline">{order.id}</Link>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-3.5 px-4 text-foreground">{order.course}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-foreground">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EarningsContent;
