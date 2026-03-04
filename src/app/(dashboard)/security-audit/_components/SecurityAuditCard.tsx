import Header from "@/components/share/Header"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { title: "Total Revenue",       value: "$1,358,500" },
  { title: "Pending Payments",    value: "$12,500"    },
  { title: "Failed Transactions", value: "1"          },
  { title: "Total Transactions",  value: "5"          },
]

export default function SecurityAuditCard() {
  return (
    <div>
        <Header
          title="Security Audit"
          subtitle="Review and manage security settings"
        />
        <div className="flex flex-wrap gap-4 px-6 mt-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="flex-1 min-w-[200px] rounded-2xl border border-gray-100 shadow-sm bg-white">
          <CardContent className="p-6 flex flex-col gap-1">
            <span className="text-sm text-gray-500 font-medium">{stat.title}</span>
            <span className="text-3xl font-bold text-[#1a2341] tracking-tight">{stat.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
    </div>
  )
}