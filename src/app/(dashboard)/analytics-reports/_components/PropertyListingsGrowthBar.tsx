"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", listings: 480  },
  { month: "Feb", listings: 1400 },
  { month: "Mar", listings: 720  },
  { month: "Apr", listings: 1820 },
  { month: "May", listings: 950  },
  { month: "Jun", listings: 1480 },
]

export default function PropertyListingsGrowthBar() {
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
              domain={[0, 2250]}
              ticks={[0, 450, 900, 1350, 1800, 2250]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Bar
              dataKey="listings"
              fill="#1a2341"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}