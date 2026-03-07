"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { month: string; listings: number }[];
}

export default function PropertyListingsGrowthBar({ data }: Props) {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pb-2 pt-5 px-6">
        <CardTitle className="text-base font-semibold text-[#1a2341]">
          Property Listings Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            barCategoryGap="35%"
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Bar dataKey="listings" fill="#1a2341" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}