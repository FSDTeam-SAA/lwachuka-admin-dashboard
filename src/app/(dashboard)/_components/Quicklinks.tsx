import { Building2, CreditCard, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface QuickLinkItem {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
}

const quickLinks: QuickLinkItem[] = [
  {
    icon: <Building2 size={26} strokeWidth={1.5} className="text-[#1a2341]" />,
    title: "Property Listings",
    description: "Manage all property listings",
    href: "/property-listings",
  },
  {
    icon: <CreditCard size={26} strokeWidth={1.5} className="text-[#1a2341]" />,
    title: "Payments",
    description: "View payment transactions",
    href: "/payment-management",
  },
  {
    icon: <Users size={26} strokeWidth={1.5} className="text-[#1a2341]" />,
    title: "Profile",
    description: "Manage your account settings",
    href: "/settings/profileinfo",
  },
]

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
      {quickLinks.map((link) => (
        <Link key={link.title} href={`${link?.href}`}>
          <Card
          className="rounded-2xl border border-gray-100 shadow-[0px_4px_6px_0px_#0000001A] bg-white transition-shadow cursor-pointer"
        >
          <CardContent className="p-6 flex flex-col gap-3">
            <div>{link.icon}</div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">{link.title}</span>
              <span className="text-xs text-gray-400">{link.description}</span>
            </div>
          </CardContent>
        </Card>
        </Link>
      ))}
    </div>
  )
}