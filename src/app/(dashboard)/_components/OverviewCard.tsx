import { Users, Building2, CreditCard, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="flex-1 min-w-[220px] rounded-2xl border border-gray-100 shadow-[0px_4px_6px_0px_#0000001A] bg-white h-[139px]">
  <CardContent className="p-6 flex flex-row items-center justify-between h-full">
    {/* Left Text */}
    <div className="flex flex-col justify-center gap-1">
      <span className="text-sm text-gray-500 font-medium">{title}</span>
      <span className="text-3xl font-bold text-[#1a2341] tracking-tight">
        {value}
      </span>
    </div>

    {/* Right Icon */}
    <div className="flex items-center justify-center text-[#1a2341] opacity-80">
      {icon}
    </div>
  </CardContent>
</Card>
  )
}

const stats = [
  {
    title: "Total Users",
    value: "12,345",
    icon: <Users size={28} strokeWidth={1.5} />,
  },
  {
    title: "Active Properties",
    value: "1,856",
    icon: <Building2 size={28} strokeWidth={1.5} />,
  },
  {
    title: "Monthly Revenue",
    value: "$84,290",
    icon: <CreditCard size={28} strokeWidth={1.5} />,
  },
  {
    title: "Active Agents",
    value: "342",
    icon: <TrendingUp size={28} strokeWidth={1.5} />,
  },
]

export default function OverviewCard() {
  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}