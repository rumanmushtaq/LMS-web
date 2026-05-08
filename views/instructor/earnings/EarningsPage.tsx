"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DollarSign, Star, UserCheck, Calendar } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EarningsStats {
  totalRevenue: number;
  averageRating: number;
  studentsThisMonth: number;
  earningsByMonth: number[];
  recentOrders: Array<{
    orderId: string;
    date: string;
    courseName: string;
    amount: number;
  }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function EarningsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EarningsStats | null>(null);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/instructors/my-earnings", {
        params: {
          chartYear: selectedYear,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page,
          limit,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, startDate, endDate, page]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.earningsByMonth.map((amount, index) => ({
      name: MONTHS[index],
      amount,
    }));
  }, [data]);

  const totalPages = data?.pagination?.totalPages || 1;

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading your earnings...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20 shrink-0">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-green-500">
              ${data?.totalRevenue?.toLocaleString() || "0"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Earning this month</p>
          </div>
        </div>

        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Courses Ratings</p>
            <p className="text-2xl font-bold text-red-500">
              {data?.averageRating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Rating this month</p>
          </div>
        </div>

        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20 shrink-0">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Students Enrolled
            </p>
            <p className="text-2xl font-bold text-violet-600">
              {data?.studentsThisMonth?.toLocaleString() || "0"}
            </p>
            <p className="text-xs text-gray-400 mt-1">New this month</p>
          </div>
        </div>
      </div>

      {/* Year Chart */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800">Earnings by Year</h2>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-gray-50">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              className="bg-transparent border-none text-sm font-medium focus:outline-none text-gray-700"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(val) =>
                  `${val / 1000 >= 1 ? val / 1000 + "k" : val}`
                }
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: any) => [`$${value}`, "Earnings"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
                activeDot={{
                  r: 6,
                  fill: "#ef4444",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Earnings History</h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-full px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
              <input
                type="date"
                className="bg-transparent border-none text-sm focus:outline-none text-gray-600 block w-[110px]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-gray-400 mx-2">-</span>
              <input
                type="date"
                className="bg-transparent border-none text-sm focus:outline-none text-gray-600 block w-[110px]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs text-red-500 font-medium hover:text-red-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm">
                  Order ID
                </th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm">
                  Date
                </th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm">
                  Course Name
                </th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders && data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-violet-700">
                      ORD{order.orderId}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                      {order.courseName}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800 text-right">
                      ${order.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-500 text-sm"
                  >
                    No transactions found for the selected dates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Showing page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
