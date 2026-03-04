"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", user: 850  },
  { month: "Feb", user: 970  },
  { month: "Mar", user: 1100 },
  { month: "Apr", user: 1220 },
  { month: "May", user: 1350 },
  { month: "Jun", user: 1480 },
  { month: "Jul", user: 1750 },
]

export default function PropertyListingsGrowth() {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pb-2 pt-5 px-6">
        <CardTitle className="text-base font-semibold text-[#1a2341]">
          Property Listings Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e5e7eb"
              vertical={true}
              horizontal={true}
            />
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
              domain={[0, 1800]}
              ticks={[0, 450, 900, 1350, 1800]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            />
            <Line
              type="linear"
              dataKey="user"
              stroke="#1a2341"
              strokeWidth={2}
              dot={{ r: 4, fill: "#1a2341", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}