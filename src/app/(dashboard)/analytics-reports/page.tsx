"use client"
import React from "react";
import AnalyticsReportsCard from "./_components/AnalyticsReportsCard";
import UserGrowthTrend from "./_components/UserGrowthTrend";
import RevenueTrend from "./_components/RevenueTrend";
import PropertyListingsGrowth from "./_components/PropertyListingsGrowth";
import PropertiesbyType from "./_components/PropertiesbyType";
import PropertyListingsGrowthBar from "./_components/PropertyListingsGrowthBar";
import PropertybyTypeBar from "./_components/PropertybyTypeBar";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface AnalyticsData {
  cards: {
    userGrowthRate: number;
    totalUsers: number;
    totalProperties: number;
    totalRevenue: number;
  };
  charts: {
    userTrend: { _id: number; users: number }[];
    revenueTrend: { _id: number; revenue: number }[];
    propertyGrowth: { _id: number; properties: number }[];
    propertyByType: { _id: string; total: number }[];
  };
}

const MONTH_NAMES: Record<number, string> = {
  1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
  5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
  9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
};

const Page = () => {

  const session = useSession()
  const TOKEN = session?.data?.user?.accessToken;

  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/analytics-reports`, {method : "GET", headers : {
          Authorization: `Bearer ${TOKEN}`,
        }}
      );
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  const data: AnalyticsData | undefined = analyticsRes?.data;

  const userTrendData = (data?.charts.userTrend || []).map((d) => ({
    month: MONTH_NAMES[d._id] || String(d._id),
    user: d.users,
  }));

  const revenueTrendData = (data?.charts.revenueTrend || []).map((d) => ({
    month: MONTH_NAMES[d._id] || String(d._id),
    revenue: d.revenue,
  }));

  const propertyGrowthData = (data?.charts.propertyGrowth || []).map((d) => ({
    month: MONTH_NAMES[d._id] || String(d._id),
    listings: d.properties,
  }));

  const propertyByTypeData = (data?.charts.propertyByType || []).map((d) => ({
    type: d._id,
    total: d.total,
  }));

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <AnalyticsReportsCard cards={data?.cards} isLoading={isLoading} />

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col gap-6">
          <UserGrowthTrend data={userTrendData} />
          <RevenueTrend data={revenueTrendData} />
        </div>

        <div className="flex flex-col gap-6">
          <PropertyListingsGrowth data={propertyGrowthData} />
          <PropertiesbyType data={propertyByTypeData} />
        </div>
      </div>

      {/* Bottom Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <PropertyListingsGrowthBar data={propertyGrowthData} />
        <PropertybyTypeBar data={propertyByTypeData} />
      </div>
    </div>
  );
};

export default Page;