"use client"
import Header from "@/components/share/Header";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function PaymentManagementCard() {
  const session = useSession()
    const TOKEN = session?.data?.user?.accessToken;
  const { data: paymentOverview, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/payment-overview`, {method : "GET", headers : {
          Authorization: `Bearer ${TOKEN}`,
        }}
      );
      if (!res.ok) throw new Error("Failed to fetch payment overview");
      return res.json();
    },
  });

  const data = paymentOverview?.data;

  const stats = [
    {
      title: "Total Revenue",
      value: data?.completedAmount != null
        ? `$${data.completedAmount.toLocaleString()}`
        : "—",
    },
    {
      title: "Pending Payments",
      value: data?.pendingAmount != null
        ? `$${data.pendingAmount.toLocaleString()}`
        : "—",
    },
    {
      title: "Failed Transactions",
      value: data?.totalFaildTencations ?? "—",
    },
    {
      title: "Total Transactions",
      value: data?.totalTensations ?? "—",
    },
  ];

  return (
    <div>
      <Header
        title="Payment Management"
        subtitle="Track and manage all transactions"
      />
      <div className="flex flex-wrap gap-4 px-6 mt-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="flex-1 min-w-[200px] rounded-2xl border border-gray-100 shadow-sm bg-white"
          >
            <CardContent className="p-6 flex flex-col gap-1">
              <span className="text-sm text-gray-500 font-medium">
                {stat.title}
              </span>
              {isLoading ? (
                <div className="h-9 w-24 bg-gray-200 rounded animate-pulse mt-1" />
              ) : (
                <span className="text-3xl font-bold text-[#1a2341] tracking-tight">
                  {stat.value}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}