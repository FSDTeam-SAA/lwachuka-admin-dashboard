import Header from "@/components/share/Header";
import { Card, CardContent } from "@/components/ui/card";

interface Cards {
  userGrowthRate: number;
  totalUsers: number;
  totalProperties: number;
  totalRevenue: number;
}

interface Props {
  cards?: Cards;
  isLoading?: boolean;
}

export default function AnalyticsReportsCard({ cards, isLoading }: Props) {
  const stats = [
    {
      title: "Total Revenue",
      value: cards?.totalRevenue != null ? `$${cards.totalRevenue.toLocaleString()}` : "—",
    },
    {
      title: "Total Users",
      value: cards?.totalUsers ?? "—",
    },
    {
      title: "Total Properties",
      value: cards?.totalProperties ?? "—",
    },
    {
      title: "User Growth Rate",
      value: cards?.userGrowthRate != null ? `${cards.userGrowthRate}%` : "—",
    },
  ];

  return (
    <div>
      <Header
        title="Analytics & Reports"
        subtitle="View and analyze your business metrics"
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