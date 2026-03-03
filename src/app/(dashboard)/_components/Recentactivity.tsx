import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  title: string
  name: string
  time: string
  role: string
}

const activities: ActivityItem[] = [
  { title: "New user registration", name: "John Doe", time: "5 minutes ago", role: "user" },
  { title: "New user registration", name: "John Doe", time: "5 minutes ago", role: "user" },
  { title: "New user registration", name: "John Doe", time: "5 minutes ago", role: "user" },
]

export default function RecentActivity() {
  return (
    <Card className="flex-1 rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
        <CardTitle className="text-base font-semibold text-[#1a2341]">
          Recent Activity
        </CardTitle>
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          See all
        </button>
      </CardHeader>

      <CardContent className="px-6 pb-5 flex-1">
        <div className="divide-y divide-gray-100">
          {activities.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-6">
              <span className="text-sm font-medium text-[#1a2341] w-48">
                {item.title}
              </span>
              <span className="text-sm text-gray-400 w-28">
                {item.name}
              </span>
              <span className="text-sm text-gray-400 w-32">
                {item.time}
              </span>
              <span className="text-sm text-gray-400">
                {item.role}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}