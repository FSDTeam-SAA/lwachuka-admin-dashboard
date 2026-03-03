import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserItem {
  name: string
  email: string
  role: string
  date: string
}

const users: UserItem[] = [
  { name: "John Doe", email: "john@example.com", role: "Buyer", date: "2024-01-15" },
  { name: "John Doe", email: "john@example.com", role: "Buyer", date: "2024-01-15" },
  { name: "John Doe", email: "john@example.com", role: "Buyer", date: "2024-01-15" },
]

export default function UserManagement() {
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
          {users.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between py-4">
              <div className="flex flex-col min-w-[180px]">
                <span className="text-sm font-semibold text-[#1a2341]">
                  {user.name}
                </span>
                <span className="text-xs text-gray-400">
                  {user.email}
                </span>
              </div>

              <span className="text-sm text-gray-400 w-24 text-center">
                {user.role}
              </span>

              <span className="text-sm text-gray-400">
                {user.date}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}