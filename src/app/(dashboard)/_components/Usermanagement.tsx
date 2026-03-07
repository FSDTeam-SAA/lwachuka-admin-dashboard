"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface UserItem {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export default function UserManagement() {
  const session = useSession()
  const TOKEN = session?.data?.user?.accessToken

  const { data, isLoading } = useQuery({
    queryKey: ["all-user"],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/all-users?role=user&limit=5`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch users")
      return res.json()
    },
  })

  const users: UserItem[] = (data?.data || []).slice(0, 5)

  return (
    <Card className="flex-1 rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
        <CardTitle className="text-base font-semibold text-[#1a2341]">
          User Management
        </CardTitle>
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          See all
        </button>
      </CardHeader>

      <CardContent className="px-6 pb-5 flex-1">
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-1 min-w-[180px]">
                  <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-3.5 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user._id} className="flex items-center justify-between py-4">
                <div className="flex flex-col min-w-[180px]">
                  <span className="text-sm font-semibold text-[#1a2341]">
                    {`${user.firstName} ${user.lastName}`.trim()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {user.email}
                  </span>
                </div>

                <span className="text-sm text-gray-400 w-24 text-center capitalize">
                  {user.role}
                </span>

                <span className="text-sm text-gray-400">
                  {user.createdAt
                    ? new Date(user.createdAt).toISOString().split("T")[0]
                    : "—"}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}