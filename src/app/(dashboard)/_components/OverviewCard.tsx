"use client"
import { Users, Building2, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/share/Header";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function OverviewCard() {
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;


  const { data: overviewData } = useQuery({
    queryKey: ["overviewData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/admin-overview`, {method : "GET", headers : {
          Authorization: `Bearer ${TOKEN}`,
        }}
      );
      if (!res.ok) throw new Error("Failed to fetch overview");
      return res.json();
    },
  });

  const data = overviewData?.data;

  const stats = [
    {
      title: "Total Users",
      value: data?.user ?? "—",
      icon: <Users size={28} strokeWidth={1.5} />,
    },
    {
      title: "Active Properties",
      value: data?.property ?? "—",
      icon: <Building2 size={28} strokeWidth={1.5} />,
    },
    {
      title: "Monthly Revenue",
      value: data?.thismounthRevenue != null ? `$${data.thismounthRevenue.toLocaleString()}` : "—",
      icon: <CreditCard size={28} strokeWidth={1.5} />,
    },
    {
      title: "Active Agents",
      value: data?.activeAgent ?? "—",
      icon: <TrendingUp size={28} strokeWidth={1.5} />,
    },
  ];

  return (
    <div>
      <Header title="Dashboard" subtitle="Welcome back 👋" />
      <div className="flex flex-wrap gap-4 p-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="flex-1 min-w-[220px] rounded-2xl border border-gray-100 shadow-[0px_4px_6px_0px_#0000001A] bg-white h-[139px]"
          >
            <CardContent className="p-6 flex flex-row items-center justify-between h-full">
              {/* Left Text */}
              <div className="flex flex-col justify-center gap-1">
                <span className="text-sm text-gray-500 font-medium">
                  {stat.title}
                </span>
                <span className="text-3xl font-bold text-[#1a2341] tracking-tight">
                  {stat.value}
                </span>
              </div>

              {/* Right Icon */}
              <div className="flex items-center justify-center text-[#1a2341] opacity-80">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}