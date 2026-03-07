"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface LoginHistory {
  _id: string
  userId: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
  role: string
  loginTime: string
  ipaddress: string
}

export default function RecentActivity() {
  const session = useSession()
  const TOKEN = session?.data?.user?.accessToken

  const { data: recentLog } = useQuery({
    queryKey: ["recentLogData"],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/loginhistory`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch login history")
      return res.json()
    },
  })

  const activities: LoginHistory[] = recentLog?.data || []

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diff < 60) return `${diff} seconds ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

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
          {activities.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No recent activity.</p>
          ) : (
            activities.map((item) => (
              <div key={item._id} className="flex items-center justify-between py-6">
                <span className="text-sm font-medium text-[#1a2341] w-48">
                  User Login
                </span>
                <span className="text-sm text-gray-400 w-28">
                  {`${item.userId?.firstName || ""} ${item.userId?.lastName || ""}`.trim() || "—"}
                </span>
                <span className="text-sm text-gray-400 w-32">
                  {formatTime(item.loginTime)}
                </span>
                <span className="text-sm text-gray-400 capitalize">
                  {item.role}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}